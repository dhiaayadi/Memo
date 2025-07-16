import express from "express";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post("/", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Le champ content est requis." });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content }],
    });

    const aiContent = response.data.choices[0].message.content;

    res.json({ aiMessage: { content: aiContent } });
  } catch (err) {
    console.error("❌ Erreur serveur messages:", err);
    res.status(500).json({ message: "Erreur IA", error: err.message });
  }
});

export default router;
