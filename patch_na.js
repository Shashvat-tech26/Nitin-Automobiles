const fs = require('fs');

let html = fs.readFileSync('NA.html', 'utf8');

// 1. Add IDs to the input fields so we can select them
html = html.replace('<input type="text" placeholder="Full name likhein..." />', '<input type="text" id="na-name" placeholder="Full name likhein..." />');
html = html.replace('<input type="tel" placeholder="+91 XXXXX XXXXX" />', '<input type="tel" id="na-phone" placeholder="+91 XXXXX XXXXX" />');
html = html.replace('<input type="text" placeholder="jaise: Maruti Swift, Hyundai i20..." />', '<input type="text" id="na-car" placeholder="jaise: Maruti Swift, Hyundai i20..." />');
html = html.replace('<select>', '<select id="na-service">');
html = html.replace('<textarea placeholder="Gaadi mein kya problem aa rahi hai, thoda detail mein batayein..."></textarea>', '<textarea id="na-notes" placeholder="Gaadi mein kya problem aa rahi hai, thoda detail mein batayein..."></textarea>');

// 2. Replace the WhatsApp link with a submit button
const waLinkStr = `<a href="https://wa.me/918795324949?text=Namaste%20Nitin%20Automobiles!%20Mujhe%20appointment%20book%20karni%20hai." target="_blank" class="btn-primary" style="display:block; text-align:center; width:100%;">
          dY" WhatsApp Pe Book Karein
        </a>`;
const waLinkStr2 = `<a href="https://wa.me/918795324949?text=Namaste%20Nitin%20Automobiles!%20Mujhe%20appointment%20book%20karni%20hai." target="_blank" class="btn-primary" style="display:block; text-align:center; width:100%;">
          📱 WhatsApp Pe Book Karein
        </a>`;

// The exact string might vary due to emojis, so let's use a regex
html = html.replace(/<a href="https:\/\/wa\.me\/[^>]+class="btn-primary" style="display:block; text-align:center; width:100%;">[\s\S]*?<\/a>/, `<button onclick="submitAppointment()" class="btn-primary" style="display:block; text-align:center; width:100%; border:none; cursor:pointer;">
          🚀 Appointment Book Karein
        </button>`);

// 3. Add the JS function
const jsCode = `
  async function submitAppointment() {
    const name = document.getElementById('na-name').value.trim();
    const phone = document.getElementById('na-phone').value.trim();
    const car = document.getElementById('na-car').value.trim();
    const service = document.getElementById('na-service').value;
    const notes = document.getElementById('na-notes').value.trim();

    if (!name || !phone) {
      alert('Kripya apna naam aur phone number daalein.');
      return;
    }

    const payload = {
      name, phone, car, service, notes,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert('Aapka appointment book ho gaya hai! Hum jald hi aapse sampark karenge.');
        document.getElementById('na-name').value = '';
        document.getElementById('na-phone').value = '';
        document.getElementById('na-car').value = '';
        document.getElementById('na-service').value = '';
        document.getElementById('na-notes').value = '';
      } else {
        alert('Kuch gadbad ho gayi. Kripya baad mein try karein.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error. Kripya apna connection check karein.');
    }
  }
</script>`;

html = html.replace('</script>', jsCode);

fs.writeFileSync('NA.html', html);
console.log('Successfully patched NA.html');
