const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.post("/addData", async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.type) {
      return res.status(400).send("Invalid data");
    }

    await db.collection("donneesRuches").add({
      ...data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send("✅ Données envoyées");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Erreur serveur");
  }
});

app.get("/", (req, res) => {
  res.send("API ESP32 OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
