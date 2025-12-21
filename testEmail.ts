import {sendExpiryNotification} from "./server/services/email";

(async () => {
  try {
    await sendExpiryNotification(
      "patelprincy4480@gmail.com",  // 🔹 Replace with your test email
      "Milk", 
      new Date("2025-08-28"), 
      2
    );
    console.log("Test email sent!");
  } catch (err) {
    console.error("Failed:", err);
  }
})();