import fs from 'fs';

const filePath = './dev.config.js';
const setFallbackImage = (value) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const updatedContent = fileContent.replace(/fallbackImage: (true|false)/, `fallbackImage: ${value}`);
  fs.writeFileSync(filePath, updatedContent, 'utf8');
};

const value = process.argv[2] === 'true';
setFallbackImage(value);