import {
  filterDetectionsByDate,
  filterDetectionsBySpecies,
  calculateConfidenceStats
} from '../utils';
import { BirdDetection } from '../types';

describe('BirdNet Utils', () => {
  const sampleDetections: BirdDetection[] = [
    {
      species: 'American Robin',
      confidence: 0.85,
      timestamp: '2024-01-01T10:00:00Z',
      audioFile: 'robin1.wav'
    },
    {
      species: 'Northern Cardinal',
      confidence: 0.92,
      timestamp: '2024-01-02T11:30:00Z',
      audioFile: 'cardinal1.wav'
    },
    {
      species: 'American Robin',
      confidence: 0.78,
      timestamp: '2024-01-03T09:15:00Z',
      audioFile: 'robin2.wav'
    }
  ];

  describe('filterDetectionsByDate', () => {
    it('filters detections within date range', () => {
      const filtered = filterDetectionsByDate(
        sampleDetections,
        '2024-01-01',
        '2024-01-02'
      );
      expect(filtered).toHaveLength(2);
      expect(filtered[0].species).toBe('American Robin');
      expect(filtered[1].species).toBe('Northern Cardinal');
    });

    it('handles empty date range', () => {
      const filtered = filterDetectionsByDate(
        sampleDetections,
        '2023-12-01',
        '2023-12-31'
      );
      expect(filtered).toHaveLength(0);
    });

    it('handles single day range', () => {
      const filtered = filterDetectionsByDate(
        sampleDetections,
        '2024-01-01',
        '2024-01-01'
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].species).toBe('American Robin');
    });
  });

  describe('filterDetectionsBySpecies', () => {
    it('filters detections by species name', () => {
      const filtered = filterDetectionsBySpecies(sampleDetections, 'Robin');
      expect(filtered).toHaveLength(2);
      expect(filtered[0].species).toBe('American Robin');
      expect(filtered[1].species).toBe('American Robin');
    });

    it('handles case-insensitive search', () => {
      const filtered = filterDetectionsBySpecies(sampleDetections, 'robin');
      expect(filtered).toHaveLength(2);
    });

    it('returns empty array for non-matching species', () => {
      const filtered = filterDetectionsBySpecies(sampleDetections, 'Sparrow');
      expect(filtered).toHaveLength(0);
    });

    it('handles partial species name matches', () => {
      const filtered = filterDetectionsBySpecies(sampleDetections, 'Card');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].species).toBe('Northern Cardinal');
    });
  });

  describe('calculateConfidenceStats', () => {
    it('calculates correct confidence statistics', () => {
      const stats = calculateConfidenceStats(sampleDetections);
      expect(stats.avg).toBeCloseTo(0.85, 2);
      expect(stats.min).toBe(0.78);
      expect(stats.max).toBe(0.92);
    });

    it('handles empty detection list', () => {
      const stats = calculateConfidenceStats([]);
      expect(stats).toEqual({ avg: 0, min: 0, max: 0 });
    });

    it('handles single detection', () => {
      const stats = calculateConfidenceStats([sampleDetections[0]]);
      expect(stats.avg).toBe(0.85);
      expect(stats.min).toBe(0.85);
      expect(stats.max).toBe(0.85);
    });
  });
});