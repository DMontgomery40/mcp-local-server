# MCP Local Server with BirdNet-Pi Integration

A Model Context Protocol server that provides access to BirdNet-Pi data along with visualization and analysis capabilities.

## Features

### BirdNet-Pi Integration
- Real-time access to bird detection data
- Audio recording retrieval
- Advanced filtering by date, species, and confidence level
- Statistical analysis and reporting
- Visualization of detection patterns

## Available Functions

### 1. getBirdDetections
Get bird detections filtered by date range and optionally by species.
```typescript
{
  startDate: string;  // ISO format (YYYY-MM-DD)
  endDate: string;    // ISO format (YYYY-MM-DD)
  species?: string;   // Optional species filter
}
```

### 2. getDetectionStats
Get detailed statistics about bird detections.
```typescript
{
  period: 'day' | 'week' | 'month' | 'all';
  minConfidence?: number;  // Optional confidence threshold (0-1)
}
```

### 3. getAudioRecording
Retrieve audio recordings of bird detections.
```typescript
{
  filename: string;
  format?: 'base64' | 'buffer';  // Output format (default: 'base64')
}
```

### 4. getDailyActivity
Analyze bird activity patterns throughout the day.
```typescript
{
  date: string;       // ISO format (YYYY-MM-DD)
  species?: string;   // Optional species filter
}
```

### 5. generateDetectionReport
Generate comprehensive reports with visualizations.
```typescript
{
  startDate: string;  // ISO format (YYYY-MM-DD)
  endDate: string;    // ISO format (YYYY-MM-DD)
  format?: 'html' | 'markdown';  // Output format (default: 'html')
}
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/DMontgomery40/mcp-local-server.git
cd mcp-local-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

Set the following environment variables:
- `BIRDNET_DATA_PATH`: Path to BirdNet-Pi data directory (default: '/var/www/birdnet/data')
- `BIRDNET_AUDIO_PATH`: Path to BirdNet-Pi audio recordings (default: '/var/www/birdnet/audio')
- `BIRDNET_DETECTION_FILE`: Name of the detection data file (default: 'detections.json')

## Usage

1. Start the server:
```bash
npm start
```

2. Configure your MCP client (e.g., Claude Desktop) with:
```json
{
  "mcpServers": {
    "birdnet": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/path/to/mcp-local-server",
      "env": {
        "BIRDNET_DATA_PATH": "/your/custom/path/to/data"
      }
    }
  }
}
```

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

## Visualization Examples

The server provides two types of visualizations:

1. Daily Activity Chart - Shows bird activity patterns throughout the day
2. Species Distribution Chart - Shows the distribution of different bird species

These can be accessed through the `generateDetectionReport` function, which produces either HTML or Markdown output.

## Error Handling

The server implements robust error handling:
- File access errors return meaningful error messages
- Invalid date ranges are properly validated
- Missing audio files are handled gracefully
- Configuration errors provide clear resolution steps

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details