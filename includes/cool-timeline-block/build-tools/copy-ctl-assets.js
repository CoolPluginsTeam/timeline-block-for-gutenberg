import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcAssets = path.resolve(__dirname, '../assets');
const targetAssets = path.resolve(__dirname, '../../../../cool-timeline/includes/cool-timeline-block/assets');

if (!fs.existsSync(targetAssets)) {
  fs.mkdirSync(targetAssets, { recursive: true });
}

if (fs.existsSync(srcAssets)) {
  fs.cpSync(srcAssets, targetAssets, { recursive: true });
  console.log('✓ Successfully synced block assets to cool-timeline');
} else {
  console.log('Target cool-timeline assets directory not found at: ' + targetAssets);
}
