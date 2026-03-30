const {onRequest} = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const axios = require('axios');

const ADOBE_AUTH_URL = 'https://ims-na1.adobelogin.com/ims/token/v3';
const ADOBE_API_BASE_URL = 'https://pdf-services.adobe.io';

async function getAdobeAccessToken() {
  const clientId = process.env.ADOBE_CLIENT_ID;
  const clientSecret = process.env.ADOBE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Adobe credentials are not configured');
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'openid,AdobeID,DCAPI',
  });

  const response = await axios.post(ADOBE_AUTH_URL, body.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 30000,
  });

  const token = response.data?.access_token;
  if (!token) {
    throw new Error('Failed to retrieve Adobe access token');
  }

  return token;
}

function getAdobeHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'x-api-key': process.env.ADOBE_CLIENT_ID,
    'Content-Type': 'application/json',
  };
}

async function uploadPdfAsset({token, fileName, fileBase64}) {
  const createAssetResponse = await axios.post(
      `${ADOBE_API_BASE_URL}/assets`,
      {mediaType: 'application/pdf'},
      {
        headers: getAdobeHeaders(token),
        timeout: 30000,
      },
  );

  const assetId = createAssetResponse.data?.assetID;
  const uploadUri = createAssetResponse.data?.uploadUri;

  if (!assetId || !uploadUri) {
    throw new Error('Adobe asset initialization failed');
  }

  const buffer = Buffer.from(fileBase64, 'base64');
  await axios.put(uploadUri, buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': buffer.length,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
    maxBodyLength: Infinity,
    timeout: 120000,
  });

  return assetId;
}

async function pollAdobeJob({token, location}) {
  let attempts = 0;
  while (attempts < 20) {
    const statusResponse = await axios.get(location, {
      headers: getAdobeHeaders(token),
      timeout: 30000,
    });

    const status = statusResponse.data?.status;
    if (status === 'done') {
      return statusResponse.data;
    }

    if (status === 'failed' || status === 'error') {
      throw new Error(statusResponse.data?.error?.message || 'Adobe job failed');
    }

    attempts += 1;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error('Adobe job timed out');
}

async function downloadOutputFile(downloadUri) {
  const response = await axios.get(downloadUri, {
    responseType: 'arraybuffer',
    timeout: 120000,
  });

  return Buffer.from(response.data).toString('base64');
}

exports.generateText = onRequest(
    {
      region: 'us-central1',
      secrets: ['GEMINI_API_KEY'],
      cors: true,
    },
    async (req, res) => {
      try {
        const prompt = req.body?.prompt;
        if (!prompt) return res.status(400).json({error: 'prompt required'});

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          logger.error('GEMINI_API_KEY missing at runtime');
          return res.status(500).json({error: 'GEMINI_API_KEY missing at runtime'});
        }

        const url =
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

        const payload = {
          contents: [{parts: [{text: prompt}]}],
        };

        const response = await axios.post(url, payload, {
          params: {key: apiKey},
          headers: {'Content-Type': 'application/json'},
          timeout: 60000,
        });

        const text =
        response.data?.candidates?.[0]?.content?.parts
            ?.map((p) => p.text)
            .join('') || '';

        return res.status(200).json({reply: text || '(empty response)'});
      } catch (err) {
        const status = err.response?.status;
        const data = err.response?.data;

        logger.error('Gemini call failed', {status, data, message: err.message});

        return res.status(500).json({
          error: 'Gemini call failed',
          status,
          details: data || err.message,
        });
      }
    },
);

exports.mergePdf = onRequest(
    {
      region: 'us-central1',
      secrets: ['ADOBE_CLIENT_ID', 'ADOBE_CLIENT_SECRET'],
      cors: true,
    },
    async (req, res) => {
      try {
        const files = req.body?.files;
        if (!Array.isArray(files) || files.length < 2) {
          return res.status(400).json({error: 'At least two PDF files are required'});
        }

        const token = await getAdobeAccessToken();
        const assetIds = await Promise.all(files.map((file) => uploadPdfAsset({
          token,
          fileName: file.name,
          fileBase64: file.base64,
        })));

        const mergeResponse = await axios.post(
            `${ADOBE_API_BASE_URL}/operation/mergepdf`,
            {
              inputs: assetIds.map((assetID) => ({assetID})),
            },
            {
              headers: getAdobeHeaders(token),
              timeout: 60000,
              validateStatus: (status) => status === 202,
            },
        );

        const location = mergeResponse.headers.location;
        if (!location) {
          throw new Error('Adobe merge location header missing');
        }

        const result = await pollAdobeJob({token, location});
        const downloadUri = result?.asset?.downloadUri;
        if (!downloadUri) {
          throw new Error('Adobe merge output URI missing');
        }

        const fileBase64 = await downloadOutputFile(downloadUri);

        return res.status(200).json({
          fileName: 'merged.pdf',
          mimeType: 'application/pdf',
          fileBase64,
        });
      } catch (err) {
        logger.error('Merge PDF failed', {
          message: err.message,
          data: err.response?.data,
          status: err.response?.status,
        });

        return res.status(500).json({
          error: 'Failed to merge PDF files',
          details: err.response?.data || err.message,
        });
      }
    },
);

exports.compressPdf = onRequest(
    {
      region: 'us-central1',
      secrets: ['ADOBE_CLIENT_ID', 'ADOBE_CLIENT_SECRET'],
      cors: true,
    },
    async (req, res) => {
      try {
        const file = req.body?.file;
        if (!file?.base64 || !file?.name) {
          return res.status(400).json({error: 'A PDF file is required'});
        }

        const token = await getAdobeAccessToken();
        const assetId = await uploadPdfAsset({
          token,
          fileName: file.name,
          fileBase64: file.base64,
        });

        const compressResponse = await axios.post(
            `${ADOBE_API_BASE_URL}/operation/compresspdf`,
            {
              input: {assetID: assetId},
              compressionLevel: req.body?.compressionLevel || 'medium',
            },
            {
              headers: getAdobeHeaders(token),
              timeout: 60000,
              validateStatus: (status) => status === 202,
            },
        );

        const location = compressResponse.headers.location;
        if (!location) {
          throw new Error('Adobe compress location header missing');
        }

        const result = await pollAdobeJob({token, location});
        const downloadUri = result?.asset?.downloadUri;
        if (!downloadUri) {
          throw new Error('Adobe compress output URI missing');
        }

        const fileBase64 = await downloadOutputFile(downloadUri);

        return res.status(200).json({
          fileName: 'compressed.pdf',
          mimeType: 'application/pdf',
          fileBase64,
        });
      } catch (err) {
        logger.error('Compress PDF failed', {
          message: err.message,
          data: err.response?.data,
          status: err.response?.status,
        });

        return res.status(500).json({
          error: 'Failed to compress PDF file',
          details: err.response?.data || err.message,
        });
      }
    },
);
exports.testAPI = onRequest((req, res) => {
  res.json({ message: "Backend is working 🚀" });
});
