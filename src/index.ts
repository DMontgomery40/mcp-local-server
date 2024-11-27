import { MCPServer } from '@modelcontextprotocol/typescript-sdk';
import { getBirdDetections, getDetectionStats, getAudioRecording, getDailyActivity } from './birdnet/functions';
import { generateDetectionReport } from './birdnet/report';

// Initialize the server with all functions
const server = new MCPServer({
  functions: [
    // BirdNet-Pi functions
    getBirdDetections,
    getDetectionStats,
    getAudioRecording,
    getDailyActivity,
    generateDetectionReport
  ]
});

// Start the server
server.start();
console.log('MCP Server started successfully with BirdNet-Pi integration!');