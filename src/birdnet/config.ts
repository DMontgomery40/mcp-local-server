export interface BirdNetConfig {
  dataPath: string;
  audioPath: string;
  detectionFile: string;
}

export const defaultConfig: BirdNetConfig = {
  dataPath: process.env.BIRDNET_DATA_PATH || '/var/www/birdnet/data',
  audioPath: process.env.BIRDNET_AUDIO_PATH || '/var/www/birdnet/audio',
  detectionFile: process.env.BIRDNET_DETECTION_FILE || 'detections.json'
};

export function validateConfig(config: BirdNetConfig): void {
  if (!config.dataPath) {
    throw new Error('BirdNet data path must be specified');
  }
  if (!config.audioPath) {
    throw new Error('BirdNet audio path must be specified');
  }
  if (!config.detectionFile) {
    throw new Error('BirdNet detection file must be specified');
  }
}