const fs = require('fs');
let html = fs.readFileSync('NA.html','utf8');
html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
html = html.replace(/src="data:image[^"]+"/gi, 'src=""');
let textMatches = html.match(/>([^<]+)</g);
if(textMatches) {
    let texts = textMatches.map(t => t.replace(/[><]/g, '').trim()).filter(t => t.length > 2);
    console.log(texts.join('\n'));
}
