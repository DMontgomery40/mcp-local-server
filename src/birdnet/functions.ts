import { MCPFunction } from '@modelcontextprotocol/typescript-sdk';
import { BirdDetection, DetectionStats } from './types';
import { defaultConfig } from './config';
import {
  readDetectionsFile,
  getAudioBuffer,
  filterDetectionsByDate,
  filterDetectionsBySpecies,
  calculateConfidenceStats
} from './utils';

export const getBirdDetections: MCPFunction = {
  name: 'getBirdDetections',
  description: 'Get bird detections filtered by date range and optionally by species',
  parameters: {
    type: 'object',
    properties: {
      startDate: {
        type: 'string',
        description: 'Start date in ISO format (YYYY-MM-DD)'
      },
      endDate: {
        type: 'string',
        description: 'End date in ISO format (YYYY-MM-DD)'
      },
      species: {
        type: 'string',
        description: 'Optional: Filter by species name (partial match)',
        required: false
      }
    },
    required: ['startDate', 'endDate']
  },
  handler: async ({ startDate, endDate, species }) => {
    let detections = await readDetectionsFile(defaultConfig);
    detections = filterDetectionsByDate(detections, startDate, endDate);
    
    if (species) {
      detections = filterDetectionsBySpecies(detections, species);
    }
    
    const stats = calculateConfidenceStats(detections);
    
    return {
      detections,
      stats,
      total: detections.length
    };
  }
};

export const getDetectionStats: MCPFunction = {
  name: 'getDetectionStats',
  description: 'Get detailed statistics about bird detections',
  parameters: {
    type: 'object',
    properties: {
      period: {
        type: 'string',
        enum: ['day', 'week', 'month', 'all'],
        description: 'Time period for statistics'
      },
      minConfidence: {
        type: 'number',
        description: 'Optional: Minimum confidence threshold (0-1)',
        required: false
      }
    },
    required: ['period']
  },
  handler: async ({ period, minConfidence = 0 }) => {
    const detections = await readDetectionsFile(defaultConfig);
    const now = new Date();
    
    const filteredDetections = detections.filter(detection => {
      const detectionDate = new Date(detection.timestamp);
      const withinPeriod = period === 'all' ? true :
        now.getTime() - detectionDate.getTime() <= {
          day: 86400000,
          week: 604800000,
          month: 2592000000
        }[period];
        
      return withinPeriod && detection.confidence >= minConfidence;
    });

    const stats: DetectionStats = {
      totalDetections: filteredDetections.length,
      uniqueSpecies: new Set(filteredDetections.map(d => d.species)).size,
      detectionsBySpecies: {},
      topSpecies: []
    };

    filteredDetections.forEach(detection => {
      stats.detectionsBySpecies[detection.species] = 
        (stats.detectionsBySpecies[detection.species] || 0) + 1;
    });

    stats.topSpecies = Object.entries(stats.detectionsBySpecies)
      .map(([species, count]) => ({ species, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const confidenceStats = calculateConfidenceStats(filteredDetections);

    return {
      ...stats,
      confidenceStats,
      periodCovered: period,
      minConfidence
    };
  }
};

export const getAudioRecording: MCPFunction = {
  name: 'getAudioRecording',
  description: 'Get the audio recording for a specific detection',
  parameters: {
    type: 'object',
    properties: {
      filename: {
        type: 'string',
        description: 'Audio file name'
      },
      format: {
        type: 'string',
        enum: ['base64', 'buffer'],
        description: 'Output format for the audio data',
        default: 'base64'
      }
    },
    required: ['filename']
  },
  handler: async ({ filename, format = 'base64' }) => {
    const audioBuffer = await getAudioBuffer(defaultConfig, filename);
    return format === 'base64' ? audioBuffer.toString('base64') : audioBuffer;
  }
};

export const getDailyActivity: MCPFunction = {
  name: 'getDailyActivity',
  description: 'Get bird activity patterns throughout the day',
  parameters: {
    type: 'object',
    properties: {
      date: {
        type: 'string',
        description: 'Date to analyze (YYYY-MM-DD)'
      },
      species: {
        type: 'string',
        description: 'Optional: Filter by species',
        required: false
      }
    },
    required: ['date']
  },
  handler: async ({ date, species }) => {
    const detections = await readDetectionsFile(defaultConfig);
    const targetDate = new Date(date);
    
    let dayDetections = detections.filter(detection => {
      const detectionDate = new Date(detection.timestamp);
      return detectionDate.toDateString() === targetDate.toDateString();
    });
    
    if (species) {
      dayDetections = filterDetectionsBySpecies(dayDetections, species);
    }
    
    // Group by hour
    const hourlyActivity = Array(24).fill(0);
    dayDetections.forEach(detection => {
      const hour = new Date(detection.timestamp).getHours();
      hourlyActivity[hour]++;
    });
    
    return {
      date,
      species: species || 'all',
      totalDetections: dayDetections.length,
      hourlyActivity,
      peakHour: hourlyActivity.indexOf(Math.max(...hourlyActivity)),
      uniqueSpecies: new Set(dayDetections.map(d => d.species)).size
    };
  }
};
