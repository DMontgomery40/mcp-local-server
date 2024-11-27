from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from birdnet.functions import (
    get_bird_detections,
    get_detection_stats,
    get_audio_recording,
    get_daily_activity,
    generate_detection_report
)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MCPRequest(BaseModel):
    name: str
    parameters: Dict[str, Any]

# Map function names to their handlers
FUNCTION_MAP = {
    'getBirdDetections': get_bird_detections,
    'getDetectionStats': get_detection_stats,
    'getAudioRecording': get_audio_recording,
    'getDailyActivity': get_daily_activity,
    'generateDetectionReport': generate_detection_report
}

@app.post("/invoke")
async def invoke_function(request: MCPRequest):
    if request.name not in FUNCTION_MAP:
        raise HTTPException(status_code=404, detail=f"Function {request.name} not found")
    
    try:
        result = await FUNCTION_MAP[request.name](**request.parameters)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/functions")
async def get_functions():
    functions = [
        {
            "name": "getBirdDetections",
            "description": "Get bird detections filtered by date range and optionally by species",
            "parameters": {
                "type": "object",
                "properties": {
                    "startDate": {
                        "type": "string",
                        "description": "Start date in ISO format (YYYY-MM-DD)"
                    },
                    "endDate": {
                        "type": "string",
                        "description": "End date in ISO format (YYYY-MM-DD)"
                    },
                    "species": {
                        "type": "string",
                        "description": "Optional: Filter by species name (partial match)"
                    }
                },
                "required": ["startDate", "endDate"]
            }
        },
        # Add other function definitions here
    ]
    return {"functions": functions}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
