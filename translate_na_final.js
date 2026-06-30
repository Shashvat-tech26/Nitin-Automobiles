const fs = require('fs');

let translations = {
    'Saal Ka Experience': 'Years of Experience',
    'Caryaan Repair Ki': 'Cars Repaired',
    '???? ?? ??????': 'Engine Repair',
    'Engine overhaul, tune-up, piston ring replacement, oil leakage fix, timing belt — sab engine related problems ka solution yahan milta hai.': 'Engine overhaul, tune-up, piston ring replacement, oil leakage fix, timing belt — the solution to all engine-related problems is available here.',
    '??? ?????? ? ??????': 'AC Service & Repair',
    'AC gas refilling, compressor repair, cooling check, blower service — garmi mein gaadi ka AC sahi rakhna zaroori hai.': 'AC gas refilling, compressor repair, cooling check, blower service — it\'s essential to keep the car AC in good condition during summer.',
    '?????????? ???': 'Electrical Work',
    'Wiring issues, battery checkup, alternator, starter motor, sensor faults — electrical problems mein hum expert hain.': 'Wiring issues, battery checkup, alternator, starter motor, sensor faults — we are experts in solving electrical problems.',
    '??????? ? ???????': 'Denting & Painting',
    'Body dent remove karna, scratch repair, full paint job ya partial painting — gaadi ko naya jaise dikhaate hain hum.': 'Removing body dents, scratch repair, full paint job or partial painting — we make your car look brand new.',
    '?????? ??????? ??????': 'Spare Parts Available',
    'Genuine aur quality spare parts available hain — engine parts, brake pads, belts, filters, oils, aur bahut kuch shop mein stocked rahta hai.': 'Genuine and high-quality spare parts available — engine parts, brake pads, belts, filters, oils, and much more remain stocked in our shop.',
    '??????? ??????': 'General Service',
    'Oil change, filter replacement, brake check, suspension alignment — regular service se gaadi lamba chalti hai.': 'Oil change, filter replacement, brake check, suspension alignment — regular servicing extends the life of your car.',
    'Hamari Workshop': 'Our Workshop',
    'Garage<br><em>Ki Jhaank<\/em>': 'A Peek Inside<br><em>Our Garage<\/em>',
    'Dekho kaise kaam hota hai Nitin Automobiles mein — professional equipment, neat workspace.': 'See how work is done at Nitin Automobiles — professional equipment, neat workspace.',
    'Hamari Team': 'Our Team',
    'Log Jo<br><em>Kaam Karte Hain<\/em>': 'The People<br><em>Who Make It Happen<\/em>',
    'Experience aur dedication ke saath aapki gaadi ki dekhbhaal karte hain hamare expert log.': 'Our experts take care of your car with experience and dedication.',
    '20\\+ saalon ka experience gaadi repair mein. Khud haath lagaate hain kaam mein, isliye quality pe compromise nahi. Azamgarh mein unka naam hi guarantee hai.': '20+ years of experience in car repair. Hands-on involvement in the work ensures no compromise on quality. His name is a guarantee in Azamgarh.',
    'Customer relations aur workshop coordination ka zimma inke haath mein hai. Har customer ki problem sunna aur sahi solution dena inki khasiyat hai.': 'Responsible for customer relations and workshop coordination. Listening to every customer\'s problem and providing the right solution is his specialty.',
    'Log Kya<br><em>Kehte Hain\\?<\/em>': 'What Do<br><em>People Say?<\/em>',
    'Hamare khush customers hi hamari sabse badi pehchaan hain. Yeh hain unke kuch alfaaz.': 'Our happy customers are our biggest identity. Here are a few words from them.',
    '"Meri Maruti Suzuki Swift ka engine kaafi time se problem de raha tha. Nitin bhai ne ek baar mein hi sab theek kar diya. Bahut hi reasonable rate aur kaam ekdum sahi. Highly recommended!"': '"My Maruti Suzuki Swift\'s engine was giving trouble for a long time. Nitin brother fixed everything in one go. Very reasonable rates and excellent work. Highly recommended!"',
    '"AC service bahut achhi tarah se ki. Garmi mein jab AC band ho gaya tha, Nitin Automobiles ne same day fix kar diya. Ab bilkul sahi chalta hai. Thank you!"': '"AC service was done very well. When the AC stopped working in summer, Nitin Automobiles fixed it the same day. Now it runs perfectly. Thank you!"',
    '"Denting painting ka kaam itna sahi kiya ki nayi gaadi jaise lag rahi hai. Puri body smooth ho gayi, rang bhi perfect match kiya. Isse achha koi garage nahi Azamgarh mein!"': '"The denting and painting work was done so perfectly that it looks like a new car. The entire body became smooth, and the color matched perfectly. There\'s no better garage in Azamgarh!"',
    '"Electric wiring problem mein kisi ne help nahi ki, yahan aaya to problem pakad li aur jaldi theek kar di. 2002 se chal raha hai, isliye itna experience hai inhe. Baar baar aata hoon main."': '"No one helped with the electric wiring problem, but when I came here, they caught the issue and fixed it quickly. They have been running since 2002, which explains their vast experience. I come here again and again."',
    '"Spare parts genuine milte hain yahan, koi duplicate nahi. Engine oil bhi acche brands ke hain. Sath mein service bhi karte hain. Ek stop shop hai yeh jagah."': '"Genuine spare parts are available here, no duplicates. Engine oils are also from good brands. They provide servicing along with it. This place is a one-stop-shop."',
    '"Nitin bhai ka garage bahut hi trustworthy hai. Meri Hyundai i20 ka full service yahan se kara raha hoon pichhle 3 saal se. Kabhi koi cheating nahi, jo kaam karna hota hai wahi bata dete hain."': '"Nitin brother\'s garage is very trustworthy. I\'ve been getting my Hyundai i20 fully serviced from here for the last 3 years. No cheating ever, they only tell you the necessary work."',
    'Sampark Karein': 'Contact Us',
    'Baat<br><em>Karein Hum Se<\/em>': 'Talk<br><em>To Us<\/em>',
    'Koi bhi sawaal ho gaadi ke baare mein — call karein, WhatsApp karein, ya seedha aa jaiye!': 'Any questions about your car — call, WhatsApp, or just drop by directly!'
};

let html = fs.readFileSync('NA.html','utf8');
for(let key in translations) {
    let regexKey = key.replace(/ /g, '\\\\s+');
    html = html.replace(new RegExp(regexKey, 'gi'), translations[key]);
}
fs.writeFileSync('NA.html', html);
console.log('Translated everything left in NA.html');
