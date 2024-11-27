---
layout: default
title: Home
nav_order: 1
---

# BirdNet MCP Server

A Model Context Protocol (MCP) server implementation for BirdNet-Pi integration. This server provides standardized access to BirdNet detection data and audio recordings through the MCP specification.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
python server.py
```

The server will be available at `http://localhost:8000`.

## Available Methods

| Method | Description |
|--------|-------------|
| `getBirdDetections` | Get bird detections filtered by date and species |
| `getDetectionStats` | Get detection statistics for a time period |
| `getAudioRecording` | Get audio recording for a specific detection |
| `getDailyActivity` | Get bird activity patterns for a specific day |

## Example Usage

```python
# Example JSON-RPC request
{
    "jsonrpc": "2.0",
    "method": "getBirdDetections",
    "params": {
        "startDate": "2024-01-01",
        "endDate": "2024-01-31",
        "species": "American Robin"
    },
    "id": 1
}
```

See the [API Documentation](api.html) for detailed information about each method.