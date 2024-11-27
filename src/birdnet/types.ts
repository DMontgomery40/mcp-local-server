export interface BirdDetection {
  species: string;
  confidence: number;
  timestamp: string;
  audioFile: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface DetectionStats {
  totalDetections: number;
  uniqueSpecies: number;
  detectionsBySpecies: Record<string, number>;
  topSpecies: Array<{species: string, count: number}>;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}