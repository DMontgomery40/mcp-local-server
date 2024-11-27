#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('BirdNet-Pi MCP Server Setup\n');

  // Get BirdNet-Pi paths
  const dataPath = await question('Enter BirdNet-Pi data directory path [/var/www/birdnet/data]: ') 
    || '/var/www/birdnet/data';
  const audioPath = await question('Enter BirdNet-Pi audio directory path [/var/www/birdnet/audio]: ') 
    || '/var/www/birdnet/audio';
  
  // Create .env file
  const envContent = `BIRDNET_DATA_PATH=${dataPath}
BIRDNET_AUDIO_PATH=${audioPath}
BIRDNET_DETECTION_FILE=detections.json`;

  try {
    await fs.writeFile(path.join(__dirname, '..', '.env'), envContent);
    console.log('\nConfiguration saved to .env file');

    // Verify paths exist
    await fs.access(dataPath);
    await fs.access(audioPath);
    console.log('Verified access to BirdNet-Pi directories');

    // Create example client config
    const clientConfig = {
      mcpServers: {
        birdnet: {
          command: 'npm',
          args: ['start'],
          cwd: process.cwd(),
          env: {
            BIRDNET_DATA_PATH: dataPath,
            BIRDNET_AUDIO_PATH: audioPath
          }
        }
      }
    };

    await fs.writeFile(
      path.join(__dirname, '..', 'client-config-example.json'), 
      JSON.stringify(clientConfig, null, 2)
    );
    console.log('Created example client configuration file');

    console.log('\nSetup completed successfully!');
  } catch (error) {
    console.error('\nError during setup:', error.message);
    console.error('Please check the paths and permissions and try again');
  } finally {
    rl.close();
  }
}

setup();