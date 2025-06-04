const express = require('express');
const admin = require('firebase-admin');

const app = express();

// Read the service account JSON from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Simple test route
app.get('/', (req, res) => {
  res.send('🚀 Firebase Admin is wired up securely via Railway!');
});

// Listen on the Railway-provided port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});