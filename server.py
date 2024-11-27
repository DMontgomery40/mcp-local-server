from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List, Union
from uuid import uuid4
import json
from birdnet.functions import (
    get_bird_detections,
    get_detection_stats,
    get_audio_recording,
    get_daily_activity
)

class JsonRpcRequest(BaseModel):
    jsonrpc: str = Field("2.0", const=True)
    method: str
    params: Optional[Dict[str, Any]] = None
    id: Optional[Union[str, int]] = None

class JsonRpcResponse(BaseModel):
    jsonrpc: str = "2.0"
    result: Optional[Any] = None
    error: Optional[Dict[str, Any]] = None
    id: Optional[Union[str, int]] = None

app = FastAPI(title="BirdNet MCP Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MCP Function definitions following the spec
MCP_FUNCTIONS = {
    "getBirdDetections": {
        "handler": get_bird_detections,
        "description": "Get bird detections filtered by date range and species",
        "parameters": {
            "type": "object",
            "required": ["startDate", "endDate"],
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
                    "description": "Optional species filter"
                }
            }
        }
    },
    # Add other functions here
}

@app.post("/")
async def handle_jsonrpc(request: JsonRpcRequest) -> JsonRpcResponse:
    # Validate JSON-RPC request
    if request.method not in MCP_FUNCTIONS:
        return JsonRpcResponse(
            error={
                "code": -32601,
                "message": "Method not found"
            },
            id=request.id
        )
    
    try:
        # Handle MCP method calls
        if request.method == "mcp.getVersion":
            return JsonRpcResponse(
                result={"version": "1.0.0"},
                id=request.id
            )
            
        if request.method == "mcp.getFunctions":
            return JsonRpcResponse(
                result={
                    "functions": [
                        {
                            "name": name,
                            "description": func["description"],
                            "parameters": func["parameters"]
                        }
                        for name, func in MCP_FUNCTIONS.items()
                    ]
                },
                id=request.id
            )
        
        # Execute function if it exists
        func = MCP_FUNCTIONS[request.method]
        result = await func["handler"](**(request.params or {}))
        
        return JsonRpcResponse(
            result=result,
            id=request.id
        )
        
    except Exception as e:
        return JsonRpcResponse(
            error={
                "code": -32000,
                "message": str(e)
            },
            id=request.id
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)