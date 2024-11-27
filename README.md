# BirdNet-Pi MCP Server

A Python-based Model Context Protocol (MCP) server for BirdNet-Pi integration.

## Features

- Bird detection data retrieval with date and species filtering
- Detection statistics and analysis
- Audio recording access
- Daily activity patterns
- Report generation

## Requirements

- Python 3.8+
- FastAPI
- Uvicorn
- Other dependencies listed in `requirements.txt`

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YourUsername/mcp-server.git
cd mcp-server
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up your data directories:
```bash
mkdir -p data/audio data/reports
```

## Configuration

The server can be configured using environment variables:
- `BIRDNET_DETECTIONS_FILE`: Path to detections JSON file (default: 'data/detections.json')
- `BIRDNET_AUDIO_DIR`: Path to audio files directory (default: 'data/audio')
- `BIRDNET_REPORT_DIR`: Path to reports directory (default: 'data/reports')

## Running the Server

Start the server:
```bash
python server.py
```

The server will run on `http://localhost:8000`.

## API Endpoints

- `/functions` - List available functions (GET)
- `/invoke` - Invoke a function (POST)

### Available Functions

1. `getBirdDetections`
   - Get bird detections filtered by date range and species
   - Parameters: startDate, endDate, species (optional)

2. `getDetectionStats`
   - Get detection statistics for a time period
   - Parameters: period ('day', 'week', 'month', 'all'), minConfidence (optional)

3. `getAudioRecording`
   - Get audio recording for a detection
   - Parameters: filename, format ('base64' or 'buffer')

4. `getDailyActivity`
   - Get bird activity patterns for a specific day
   - Parameters: date, species (optional)

5. `generateDetectionReport`
   - Generate a report of detections
   - Parameters: startDate, endDate, format ('html' or 'json')

## Directory Structure

```
mcp-server/
├── birdnet/
│   ├── __init__.py
│   ├── config.py
│   ├── functions.py
│   └── utils.py
├── data/
│   ├── audio/
│   └── reports/
├── server.py
├── requirements.txt
└── README.md
```