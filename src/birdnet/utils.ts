import fs from 'fs/promises';
import path from 'path';
import { BirdDetection } from './types';
import { BirdNetConfig } from './config';

export async function readDetectionsFile(config: BirdNetConfig): Promise<BirdDetection[]> {
  try {
    const filePath = path.join(config.dataPath, config.detectionFile);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading detections file:', error);
    return [];
  }
}

export async function getAudioBuffer(config: BirdNetConfig, filename: string): Promise<Buffer> {
  try {
    const audioPath = path.join(config.audioPath, filename);
    return await fs.readFile(audioPath);
  } catch (error) {
    throw new Error(`Audio file not found: ${filename}`);
  }
}

export function filterDetectionsByDate(
  detections: BirdDetection[],
  startDate: string,
  endDate: string
): BirdDetection[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return detections.filter(detection => {
    const detectionDate = new Date(detection.timestamp);
    return detectionDate >= start && detectionDate <= end;
  });
}

export function filterDetectionsBySpecies(
  detections: BirdDetection[],
  species: string
): BirdDetection[] {
  return detections.filter(detection => 
    detection.species.toLowerCase().includes(species.toLowerCase())
  );
}

export function calculateConfidenceStats(detections: BirdDetection[]) {
  if (detections.length === 0) return { avg: 0, min: 0, max: 0 };
  
  const confidences = detections.map(d => d.confidence);
  return {
    avg: confidences.reduce((a, b) => a + b) / confidences.length,
    min: Math.min(...confidences),
    max: Math.max(...confidences)
  };
}