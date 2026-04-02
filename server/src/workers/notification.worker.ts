import { Worker } from "bullmq";
import { redisConfig } from "../config/redis";
import { EmailService } from "../services/emailService";
import { SmsService } from "../services/smsService";
import { prisma } from "../services/prisma.service";
import { NotificationTemplates } from "../templates/notification.templates";


new Worker(
  "notifications",
  async (job) => {
    console.log("Processing job:", job.id);

    try {
      const { user, type, data } = job.data;

      let template;

      // ✅ BUILD TEMPLATE HERE
      switch (type) {
        case "LOAN_CREATED":
          template = NotificationTemplates.LOAN_CREATED(
            user.name,
            data.amount
          );
          break;

        case "REPAYMENT_SUCCESS":
          template = NotificationTemplates.REPAYMENT_SUCCESS(
            user.name,
            data.amount,
            data.balance
          );
          break;

        case "OVERDUE_ALERT":
          template = NotificationTemplates.OVERDUE_ALERT(
            user.name,
            data.amount
          );
          break;

        default:
          throw new Error(`Unknown notification type: ${type}`);
      }

      const { subject, email, sms } = template;


      // ✅ SEND NOTIFICATIONS
      let emailStatus = "FAILED";
      let smsStatus = "FAILED";


      try {
        await EmailService.sendEmail(user.email, subject, email);
        emailStatus = "SENT";
      } catch (err) {
        console.error("Email failed:", err);
      }

      // try {
      //   await SmsService.sendSMS(user.phone, sms);
      //   smsStatus = "SENT";
      // } catch (err) {
      //   console.error("SMS failed:", err);
      // }

      await prisma.notification.createMany({
        data: [
          {
            userId: user.id,
            type,
            title: subject,
            message: email,
            channel: "EMAIL",
            status: "SENT",
            sentAt: emailStatus === "SENT" ? new Date() : null,
          },
          // {
          //   userId: user.id,
          //   type,
          //   title: subject,
          //   message: sms,
          //   channel: "SMS",
          //   status: "SENT",
          //   sentAt: smsStatus === "SENT" ? new Date() : null,
          // }
        ]
      });

      console.log("✅ Job completed:", job.id);

    } catch (error) {
      console.error("❌ Job failed:", error);
      throw error;
    }
  },
  { connection: redisConfig }
);