import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/textColor: 'text-\\[(#[A-F0-9]+)\\]',/g, "textColor: 'text-[$1]',\n        borderColor: 'border-[$1]',");
fs.writeFileSync('src/App.tsx', content);
