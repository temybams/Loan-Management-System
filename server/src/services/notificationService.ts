// services/notification.service.ts
import { notificationQueue } from "../queues/notification.queue";

export const NotificationService = {
  send: async (payload: any) => {
    await notificationQueue.add("send-notification", payload, {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 }
    });
  },
};