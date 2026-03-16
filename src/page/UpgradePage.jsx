import React from 'react';

const UpgradePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Upgrade Your Plan</h1>
        <p className="text-lg text-gray-400 text-center mb-12">
          Choose the plan that best fits your needs.
        </p>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Free Plan */}
          <div className="bg-gray-800 rounded-lg p-8 flex-1 flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Free</h2>
            <p className="text-4xl font-bold mb-4">$0<span className="text-lg font-normal">/month</span></p>
            <ul className="text-gray-400 space-y-2 mb-8">
              <li>3 tool uses per day</li>
              <li>Access to all tools</li>
            </ul>
            <button className="mt-auto bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
              Your Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-purple-800 rounded-lg p-8 flex-1 flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Pro</h2>
            <p className="text-4xl font-bold mb-4">$20<span className="text-lg font-normal">/month</span></p>
            <ul className="text-gray-300 space-y-2 mb-8">
              <li>Unlimited tool uses</li>
              <li>Access to all tools</li>
              <li>Priority support</li>
            </ul>
            <button className="mt-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg">
              Upgrade to Pro
            </button>
            <p className="text-center text-sm mt-4 text-purple-300">Paddle checkout coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
