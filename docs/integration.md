---
layout: default
title: Integration Guide
nav_order: 3
---

# Integration Guide

This guide explains how to integrate the BirdNet MCP Server with your applications.

## Prerequisites

- Python 3.8 or higher
- BirdNet-Pi installation
- Network access to the server

## Server Setup

1. Clone the repository:
```bash
git clone https://github.com/DMontgomery40/mcp-local-server.git
cd mcp-local-server
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
export BIRDNET_DETECTIONS_FILE=/path/to/detections.json
export BIRDNET_AUDIO_DIR=/path/to/audio/files
```

## Client Integration

### Python Client Example

```python
import json
import requests

class BirdNetMCPClient:
    def __init__(self, url="http://localhost:8000"):
        self.url = url
        
    def _call(self, method, params=None):
        payload = {
            "jsonrpc": "2.0",
            "method": method,
            "params": params or {},
            "id": 1
        }
        
        response = requests.post(self.url, json=payload)
        return response.json()
        
    def get_bird_detections(self, start_date, end_date, species=None):
        return self._call("getBirdDetections", {
            "startDate": start_date,
            "endDate": end_date,
            "species": species
        })

# Usage example
client = BirdNetMCPClient()
result = client.get_bird_detections("2024-01-01", "2024-01-31")
print(json.dumps(result, indent=2))
```

### JavaScript Client Example

```javascript
class BirdNetMCPClient {
    constructor(url = 'http://localhost:8000') {
        this.url = url;
    }
    
    async call(method, params = {}) {
        const response = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method,
                params,
                id: 1,
            }),
        });
        
        return response.json();
    }
    
    getBirdDetections(startDate, endDate, species = null) {
        return this.call('getBirdDetections', {
            startDate,
            endDate,
            species,
        });
    }
}

// Usage example
const client = new BirdNetMCPClient();
client.getBirdDetections('2024-01-01', '2024-01-31')
    .then(result => console.log(result));
```