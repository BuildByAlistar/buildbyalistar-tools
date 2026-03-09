const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require("axios");

exports.generateText = onRequest(
  {
    region: "us-central1",
    secrets: ["GEMINI_API_KEY"],
    cors: true,
  },
  async (req, res) => {
    try {
      const prompt = req.body?.prompt;
      if (!prompt) return res.status(400).json({ error: "prompt required" });

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        logger.error("GEMINI_API_KEY missing at runtime");
        return res.status(500).json({ error: "GEMINI_API_KEY missing at runtime" });
      }

      // ✅ Use a valid model name (from your ListModels output)
      const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      const response = await axios.post(url, payload, {
        params: { key: apiKey }, // ✅ key goes here (NOT hardcoded into URL)
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      });

      const text =
        response.data?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text)
          .join("") || "";

      return res.status(200).json({ reply: text || "(empty response)" });
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      logger.error("Gemini call failed", { status, data, message: err.message });

      return res.status(500).json({
        error: "Gemini call failed",
        status,
        details: data || err.message,
      });
    }
  }
);