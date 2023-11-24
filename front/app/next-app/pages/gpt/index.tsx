import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [tokensUsed, setTokensUsed] = useState(null);

  const handleGeneratePrompt = async () => {
    try {
      const response = await axios.post('/api/gpt', { prompt });
      setResult(response.data.result);
      setTokensUsed(response.data.tokensUsed);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-4">GPT-3.5 Turbo Prompt Generator</h1>
        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows="4"
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={handleGeneratePrompt}
          >
            Generate Prompt
          </button>
        </div>
        {result && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Generated Response:</h2>
            <p className="border border-gray-300 p-2 rounded-lg">{result}</p>
          </div>
        )}
        {tokensUsed !== null && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Tokens Used:</h2>
            <p className="mb-2">Tokens: {tokensUsed}</p>
            <p>Cost: ${(tokensUsed * 0.002 / 1000).toFixed(6)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
