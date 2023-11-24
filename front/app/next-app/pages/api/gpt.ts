import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const prompt = req.body.prompt; // リクエストボディからpromptを取得

    const api_url = "https://api.openai.com/v1/chat/completions";

    const data = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {"role":"system","content":"あなたは演劇の脚本を作るスペシャリストです。"},
        {"role": "user", "content": prompt}
      ],
      "max_tokens": 3000
    };

    const headers = {
      "Authorization": `Bearer ${process.env.API_KEY}` // 環境変数からAPIキーを取得
    };

    const response = await axios.post(api_url, data, { headers });
    const result = response.data.choices[0].message.content;
    const tokensUsed = response.data.usage.total_tokens;

    res.status(200).json({ result, tokensUsed });

    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
