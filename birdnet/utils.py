from typing import List, Dict, Any
from datetime import datetime
import json
import os

async def read_detections_file(config: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Read and parse the detections file."""
    try:
        with open(config['detections_file'], 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

async def get_audio_buffer(config: Dict[str, Any], filename: str) -> bytes:
    """Get audio file contents as a buffer."""
    audio_path = os.path.join(config['audio_dir'], filename)
    try:
        with open(audio_path, 'rb') as f:
            return f.read()
    except FileNotFoundError:
        raise FileNotFoundError(f"Audio file not found: {filename}")

def filter_detections_by_date(
    detections: List[Dict[str, Any]],
    start_date: str,
    end_date: str
) -> List[Dict[str, Any]]:
    """Filter detections by date range."""
    start = datetime.fromisoformat(start_date)
    end = datetime.fromisoformat(end_date)
    
    return [
        d for d in detections
        if start <= datetime.fromisoformat(d['timestamp']) <= end
    ]

def filter_detections_by_species(
    detections: List[Dict[str, Any]],
    species: str
) -> List[Dict[str, Any]]:
    """Filter detections by species name (partial match)."""
    species_lower = species.lower()
    return [
        d for d in detections
        if species_lower in d['species'].lower()
    ]

def calculate_confidence_stats(detections: List[Dict[str, Any]]) -> Dict[str, float]:
    """Calculate confidence statistics for detections."""
    if not detections:
        return {
            "min": 0,
            "max": 0,
            "average": 0
        }
    
    confidences = [d['confidence'] for d in detections]
    return {
        "min": min(confidences),
        "max": max(confidences),
        "average": sum(confidences) / len(confidences)
    }