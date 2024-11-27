---
layout: default
title: API Documentation
nav_order: 2
---

# API Documentation

The BirdNet MCP Server implements the Model Context Protocol specification version 1.0. All requests must follow the JSON-RPC 2.0 format.

## Core MCP Methods

### mcp.getVersion

Returns the server version information.

**Request:**
```json
{
    "jsonrpc": "2.0",
    "method": "mcp.getVersion",
    "id": 1
}
```

**Response:**
```json
{
    "jsonrpc": "2.0",
    "result": {
        "version": "1.0.0"
    },
    "id": 1
}
```

### mcp.getFunctions

Returns all available functions and their specifications.

**Request:**
```json
{
    "jsonrpc": "2.0",
    "method": "mcp.getFunctions",
    "id": 1
}
```

## BirdNet-Specific Methods

### getBirdDetections

Get bird detections filtered by date range and optionally by species.

**Parameters:**
- `startDate` (required): Start date in ISO format (YYYY-MM-DD)
- `endDate` (required): End date in ISO format (YYYY-MM-DD)
- `species` (optional): Species name filter

**Example:**
```json
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

### getDetectionStats

Get detection statistics for a specified time period.

**Parameters:**
- `period` (required): Time period ('day', 'week', 'month', 'all')
- `minConfidence` (optional): Minimum confidence threshold (0-1)

### getAudioRecording

Retrieve audio recording for a specific detection.

**Parameters:**
- `filename` (required): Audio file name
- `format` (optional): Output format ('base64' or 'buffer', default: 'base64')

### getDailyActivity

Get bird activity patterns for a specific day.

**Parameters:**
- `date` (required): Date in ISO format (YYYY-MM-DD)
- `species` (optional): Filter by species name