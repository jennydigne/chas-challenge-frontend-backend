import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import fetch from "node-fetch"; // Om du vill kalla TinyLlama API

import { readFile } from "fs/promises";

// Firebase Admin init
const serviceAccount = JSON.parse(
  await readFile(new URL("./serviceAccountKey.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// Skicka textmeddelande och få AI-svar
app.post("/messages", async (req, res) => {
  const { userId, text } = req.body;

  try {
    const aiResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "tinyllama:chat",
        prompt: text,
        stream: false,
      }),
    });

    const aiData = await aiResponse.json();
    const botText = aiData.response;

    const chatRef = db.collection("chats").doc();
    await chatRef.set({
      userId,
      userText: text,
      botText,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send({ botText });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to get AI response" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from Neu backend!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
