/**
 * Firebase Cloud Messaging (FCM) Service — Future Integration
 *
 * This module structures the push notification system.
 * Currently uses in-app notifications as a fallback.
 * When FCM is configured, replace with actual Firebase Admin SDK calls.
 */

// Initialize Firebase Admin (future)
export const initFCM = () => {
  // TODO: Initialize firebase-admin with service account
  console.log('FCM: Using mock notifications (Firebase not configured)');
};

// Send push notification to a single user
export const sendToUser = async (fcmToken, { title, body, data = {} }) => {
  if (!fcmToken) {
    console.log(`FCM Mock: Would send "${title}" to user`);
    return { success: false, reason: 'No FCM token' };
  }

  // TODO: Replace with firebase-admin messaging
  // const message = { notification: { title, body }, data, token: fcmToken };
  // const response = await admin.messaging().send(message);

  console.log(`FCM Mock: Sent "${title}" — ${body}`);
  return { success: true, messageId: 'mock_' + Date.now() };
};

// Send push notification to multiple users
export const sendToMultiple = async (fcmTokens, { title, body, data = {} }) => {
  // TODO: Replace with firebase-admin messaging
  console.log(`FCM Mock: Would send "${title}" to ${fcmTokens.length} users`);
  return { success: true, count: fcmTokens.length };
};

// Subscribe user to a topic
export const subscribeToTopic = async (fcmToken, topic) => {
  // TODO: Replace with firebase-admin messaging
  console.log(`FCM Mock: Subscribed to topic "${topic}"`);
  return { success: true };
};
