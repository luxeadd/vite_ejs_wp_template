import fs from 'fs';

const filePath = './dev.config.json';
const setFallbackImage = (value) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const config = JSON.parse(fileContent);
  config.fallbackImage = value;
  const updatedContent = JSON.stringify(config, null, 2);
  fs.writeFileSync(filePath, updatedContent, 'utf8');
};

const value = process.argv[2] === 'true';
setFallbackImage(value);
