import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message manquant' });
  }

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/gpt2',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    const raw = await response.text();
    // Tente de parser la réponse
    try {
      const data = JSON.parse(raw);
      if (data.error) {
        console.error('Erreur HuggingFace:', data.error);
        return res.status(500).json({ error: 'Erreur HuggingFace', detail: data.error });
      }
      const reply = data[0]?.generated_text || 'Pas de réponse.';
      res.json({ reply });
    } catch (e) {
      console.error('Réponse invalide de HuggingFace:', raw);
      return res.status(500).json({ error: 'Réponse invalide HuggingFace', detail: raw });
    }
  } catch (err) {
    console.error('Erreur serveur HuggingFace:', err);
    res.status(500).json({ error: 'Erreur serveur HuggingFace' });
  }
});

export default router;
