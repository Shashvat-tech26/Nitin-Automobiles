const fs = require('fs');

const fullDict = {
  // admin.html specific template texts
  "Aaj Ke Appointments": "Today's Appointments",
  "Sab Dekhein &rarr;": "See All &rarr;",
  "Sab Dekhein": "See All",
  "Naya Appointment Add Karein": "Add New Appointment",
  "Customer Ka Naam": "Customer Name",
  "Gaadi Ka Model": "Car Model",
  "Gaadi": "Car",
  "Naya Review Add Karein": "Add New Review",
  "Services Manage Karein": "Manage Services",
  "Naya Message Add Karein": "Add New Message",
  "Username ya password galat hai!": "Incorrect username or password!",
  "Koi appointment nahi abhi tak": "No appointments yet",
  "Koi review nahi abhi tak": "No reviews yet",
  "Koi message nahi abhi tak": "No messages yet",

  // NA.html specific template texts
  "Humare Services": "Our Services",
  "Hamare Services": "Our Services",
  "Kya problem aa rahi hai...": "What's the issue...",
  "WhatsApp Pe Book Karein": "Book via WhatsApp",
  "Aapka Naam": "Your Name",
  "Full name likhein...": "Enter full name...",
  "jaise: Maruti Swift, Hyundai i20...": "e.g., Maruti Swift, Hyundai i20...",
  "Service Select Karein": "Select Service",
  "Problem Batayein": "Describe the Problem",
  "Gaadi mein kya problem aa rahi hai, thoda detail mein batayein...": "Please describe the car's issue in detail...",
  "Hum Social Media Pe Bhi Hain": "We are also on Social Media",
  "Follow karein latest updates, offers aur car tips ke liye": "Follow us for the latest updates, offers, and car tips",
  "Sab rights reserved.": "All rights reserved.",
  "Appointment Book Karein": "Book Appointment"
};

['admin.html', 'NA.html'].forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    for (const [hi, en] of Object.entries(fullDict)) {
      // Split and join to replace all occurrences globally
      content = content.split(hi).join(en);
    }
    fs.writeFileSync(file, content);
    console.log(`Fully translated: ${file}`);
  } catch (e) {
    console.error(`Error translating ${file}:`, e);
  }
});
