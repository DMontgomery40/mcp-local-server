import { MCPFunction } from '@modelcontextprotocol/typescript-sdk';
import { readDetectionsFile } from './utils';
import { defaultConfig } from './config';
import { generateDailyActivityChart, generateSpeciesDistributionChart } from './visualization';

export const generateDetectionReport: MCPFunction = {
  name: 'generateDetectionReport',
  description: 'Generate a comprehensive report of bird detections with visualizations',
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
      format: {
        type: 'string',
        enum: ['html', 'markdown'],
        description: 'Output format for the report',
        default: 'html'
      }
    },
    required: ['startDate', 'endDate']
  },
  handler: async ({ startDate, endDate, format = 'html' }) => {
    const detections = await readDetectionsFile(defaultConfig);
    
    // Filter detections by date range
    const filteredDetections = detections.filter(detection => {
      const date = new Date(detection.timestamp);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });

    // Generate charts
    const activityChart = generateDailyActivityChart(filteredDetections);
    const distributionChart = generateSpeciesDistributionChart(filteredDetections);

    // Calculate statistics
    const uniqueSpecies = new Set(filteredDetections.map(d => d.species)).size;
    const totalDetections = filteredDetections.length;
    const avgConfidence = filteredDetections.reduce((sum, d) => sum + d.confidence, 0) / totalDetections;

    // Generate report
    if (format === 'html') {
      return `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .chart { margin: 20px 0; }
            .stats { margin: 20px 0; }
            .header { text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Bird Detection Report</h1>
            <p>${startDate} to ${endDate}</p>
          </div>
          
          <div class="stats">
            <h2>Summary Statistics</h2>
            <ul>
              <li>Total Detections: ${totalDetections}</li>
              <li>Unique Species: ${uniqueSpecies}</li>
              <li>Average Confidence: ${(avgConfidence * 100).toFixed(1)}%</li>
            </ul>
          </div>

          <div class="chart">
            <h2>Daily Activity Pattern</h2>
            ${activityChart}
          </div>

          <div class="chart">
            <h2>Species Distribution</h2>
            ${distributionChart}
          </div>
        </body>
        </html>
      `;
    } else {
      // Markdown format
      return `
# Bird Detection Report
${startDate} to ${endDate}

## Summary Statistics
- Total Detections: ${totalDetections}
- Unique Species: ${uniqueSpecies}
- Average Confidence: ${(avgConfidence * 100).toFixed(1)}%

## Charts
[Daily Activity Chart]
${activityChart}

[Species Distribution]
${distributionChart}
      `;
    }
  }
};