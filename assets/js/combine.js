const fs = require('fs');
const path = require('path');

const indexPath = 'index.html';
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Combine CSS
const cssFiles = ['assets/css/main.css'];
let cssCombined = cssFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n');

// Combine JS
const jsFiles = ['assets/js/app.js'];
let jsCombined = jsFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n');

// Insert CSS and JS before closing head
// Remove any previously injected Combined Assets block
indexHtml = indexHtml.replace(/<!-- Combined Assets -->[\s\S]*?<\/script>\n/, '');

// Insert combined CSS and JS just before </head>
const headCloseIdx = indexHtml.indexOf('</head>');
if (headCloseIdx !== -1) {
  const assetsBlock = `\n<!-- Combined Assets -->\n<style>\n${cssCombined}\n</style>\n<script>\n${jsCombined}\n</script>\n`;
  indexHtml = indexHtml.slice(0, headCloseIdx) + assetsBlock + indexHtml.slice(headCloseIdx);
}

// Extract body content from a file
function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1].trim() : '';
}

// Combine public HTML pages
const publicDir = 'public';
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));
let combinedSections = '';
for (const file of files) {
  // Remove any existing section for this file
  const sectionPattern = new RegExp(`<!-- Start ${file} -->[\\s\\S]*?<!-- End ${file} -->`, 'g');
  indexHtml = indexHtml.replace(sectionPattern, '');

  const html = fs.readFileSync(path.join(publicDir, file), 'utf8');
  const body = extractBody(html);
  const id = path.basename(file, '.html');
  combinedSections += `\n<section id="${id}">\n<!-- Start ${file} -->\n${body}\n<!-- End ${file} -->\n</section>\n`;
}

const bodyCloseIdx = indexHtml.lastIndexOf('</body>');
if (bodyCloseIdx !== -1) {
  indexHtml = indexHtml.slice(0, bodyCloseIdx) + combinedSections + indexHtml.slice(bodyCloseIdx);
}

fs.writeFileSync(indexPath, indexHtml);
