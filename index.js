const express = require('express');
const admin = require('firebase-admin');

// Load service account from Railway env variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(express.json());

app.post('/sendPush', async (req, res) => {
  const { fcmToken, title, body } = req.body;

  if (!fcmToken || !title || !body) {
    return res.status(400).json({ error: 'Missing fields: fcmToken, title, and body are required.' });
  }

  const message = {
    token: fcmToken,
    notification: {
      title,
      body,
    },
    android: {
      priority: 'high',
    },
    apns: {
      payload: {
        aps: {
          alert: {
            title,
            body,
          },
          sound: 'default',
        },
      },
    },
  };

  try {
    await admin.messaging().send(message);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Failed to send push notification:', error);
    res.status(500).json({ error: 'Failed to send push notification.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});