import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const title = req.body.title; // リクエストボディからpromptを取得
    const keywords = req.body.keywords;
    const prompt = `title:${title},keyword:${keywords}`

    const api_url = "https://api.openai.com/v1/chat/completions";

    const context = "You are a professional web writer. Write a blog post about the [title] and [keywords] given by the user by following the [steps]. #Step 1: Come up with a number of titles for your article that match your theme and choose the {title} that you predict will get the most traffic and readers will want to click on from an SEO perspective.2: Based on the {title}, create an {outline} of 5 article blocks.3: Based on the {outline}, create an {article text} for the first block.4: Based on the {title}, create an {article text} for the second block.5. Based on the {outline}, create the {article text} for the first block. 4: Revise the {article text} for SEO and readability and output as {final text}. 5: Do the same for the second, third, fourth, and fifth blocks. 6: Summarize the content of all blocks and output as {final text}. Summarize the content of all blocks and create a summary sentence, which is modified for SEO and readability and output as {Summary Sentence}. All articles, including tables, should be written in markdown format in Japanese."

    const data = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {"role":"system","content":context},
        {"role": "user", "content": prompt}
      ],
      "max_tokens": 500
    };

    const headers = {
      "Authorization": `Bearer ${process.env.API_KEY}` // 環境変数からAPIキーを取得
    };

    const response = await axios.post(api_url, data, { headers });
    const result = response.data.choices[0].message.content;
    const tokensUsed = response.data.choices[0].message.tokens;
    res.status(200).json({ result, tokensUsed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
