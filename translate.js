const fs = require('fs');

const adminDict = {
  "Koi appointment nahi abhi tak": "No appointments yet",
  "Koi review nahi abhi tak": "No reviews yet",
  "Koi message nahi abhi tak": "No messages yet",
  "Naam daalna zaroori hai!": "Name is required!",
  "Appointment add ho gaya!": "Appointment added successfully!",
  "Appointment add ho gaya! ✓": "Appointment added successfully! ✓",
  "Yeh appointment delete karein?": "Delete this appointment?",
  "Appointment delete ho gaya!": "Appointment deleted!",
  "Naam aur review likhna zaroori hai!": "Name and review are required!",
  "Review add ho gaya! ✓": "Review added successfully! ✓",
  "Yeh review delete karein?": "Delete this review?",
  "Review delete ho gaya!": "Review deleted!",
  "Service update ho gaya! ✓": "Service updated! ✓",
  "Naam aur message zaroori hai!": "Name and message are required!",
  "Message save ho gaya! ✓": "Message saved successfully! ✓",
  "Yeh message delete karein?": "Delete this message?",
  "Message delete ho gaya!": "Message deleted!",
  "Status update ho gaya:": "Status updated:",
  "Server se data load nahi ho paya!": "Failed to load data from server!",
  "Kuch gadbad ho gayi. Kripya baad mein try karein.": "Something went wrong. Please try again later.",
  "Network error. Kripya apna connection check karein.": "Network error. Please check your connection."
};

const naDict = {
  "Appointment Book Karein": "Book Appointment",
  "Aapka Naam": "Your Name",
  "Full name likhein...": "Enter full name...",
  "Gaadi Ka Model": "Car Model",
  "jaise: Maruti Swift, Hyundai i20...": "e.g., Maruti Swift, Hyundai i20...",
  "Service Select Karein": "Select Service",
  "Problem Batayein": "Describe the Problem",
  "Gaadi mein kya problem aa rahi hai, thoda detail mein batayein...": "Please describe the car's issue in detail...",
  "WhatsApp Pe Book Karein": "Book via WhatsApp",
  "Hum Social Media Pe Bhi Hain": "We are also on Social Media",
  "Follow karein latest updates, offers aur car tips ke liye": "Follow us for the latest updates, offers, and car tips",
  "Aapka appointment book ho gaya hai! Hum jald hi aapse sampark karenge.": "Your appointment has been booked! We will contact you soon.",
  "Kripya apna naam aur phone number daalein.": "Please enter your name and phone number.",
  "Sab rights reserved.": "All rights reserved."
};

// Admin HTML replacement
try {
  let adminHtml = fs.readFileSync('admin.html', 'utf8');
  for (const [hi, en] of Object.entries(adminDict)) {
    adminHtml = adminHtml.split(hi).join(en);
  }
  fs.writeFileSync('admin.html', adminHtml);
  console.log('admin.html translated.');
} catch(e) {
  console.error(e);
}

// NA HTML replacement
try {
  let naHtml = fs.readFileSync('NA.html', 'utf8');
  for (const [hi, en] of Object.entries(naDict)) {
    naHtml = naHtml.split(hi).join(en);
  }
  
  // Specifically fix some remaining parts if found
  naHtml = naHtml.split('📱 WhatsApp Pe Book Karein').join('📱 Book via WhatsApp');
  naHtml = naHtml.split('🚀 Appointment Book Karein').join('🚀 Book Appointment');
  
  fs.writeFileSync('NA.html', naHtml);
  console.log('NA.html translated.');
} catch(e) {
  console.error(e);
}
