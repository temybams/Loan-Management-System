import { Queue } from "bullmq";
import { redisConfig } from "../config/redis";

export const notificationQueue = new Queue("notifications", {
  connection: redisConfig,
});