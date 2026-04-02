import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

// const client = Twilio(
//     process.env.TWILIO_ACCOUNT_SID!,
//     process.env.TWILIO_AUTH_TOKEN!
// );

// const formatPhone = (phone: string) => {
//     if (phone.startsWith("0")) {
//         return "+234" + phone.slice(1);
//     }
//     return phone;
// };

// export const SmsService = {
//     sendSMS: async (phone: string, message: string) => {
//         try {
//             const res = await client.messages.create({
//                 body: message,
//                 from: process.env.TWILIO_PHONE_NUMBER!,
//                 to: formatPhone(phone),
//             });

//             console.log("✅ SMS sent:", res.sid);
//         } catch (error) {
//             console.error("❌ SMS failed:", error);
//         }
//     },
// };

export const SmsService = {
   sendSMS: async (recipient: string, message: string) => {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);


try {
    // Ensure you are using your Twilio number in 'from'
    const messageResponse = await client.messages.create({
        body: message,
        to: recipient,             // The recipient's phone number
        from: process.env.TWILIO_PHONE_NUMBER,  // Your Twilio phone number
    });
    console.log("SMS sent:", messageResponse.sid);
} catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
}
}
};