const fs = require('fs');
const path = require('path');

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
