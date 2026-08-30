const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace('.view-layer {\n    position: absolute;', '.view-layer {\n    position: absolute;\n    height: 100%;\n    overflow: hidden;');
css = css.replace('.view-layer.active {\n    opacity: 1;', '.view-layer.active {\n    height: auto;\n    overflow: visible;\n    opacity: 1;');
fs.writeFileSync('src/index.css', css);
