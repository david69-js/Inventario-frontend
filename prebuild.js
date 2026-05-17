const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwindcss = require('@tailwindcss/postcss');

const envPath = path.join(__dirname, '.env');
const outputPath = path.join(__dirname, 'src', 'environments', 'environment.ts');

let apiUrl = 'http://localhost:3000/api';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('API_URL=')) {
      apiUrl = trimmed.slice(8).trim().replace(/^["']|["']$/g, '');
    }
  });
}

const output = `export const environment = {
  production: false,
  apiUrl: '${apiUrl}',
};
`;

fs.writeFileSync(outputPath, output);
console.log(`Environment generated: API_URL = ${apiUrl}`);

// Process CSS with Tailwind v4
const cssPath = path.join(__dirname, 'src', 'styles.css');
const css = fs.readFileSync(cssPath, 'utf-8');

postcss([tailwindcss()])
  .process(css, { from: cssPath, to: cssPath })
  .then(result => {
    fs.writeFileSync(cssPath, result.css);
    console.log('Tailwind CSS processed successfully');
  })
  .catch(err => {
    console.error('Tailwind CSS processing failed:', err);
  });
