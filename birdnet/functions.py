from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import json
import base64
import os
from .utils import (
    read_detections_file,
    get_audio_buffer,
    filter_detections_by_date,
    filter_detections_by_species,
    calculate_confidence_stats
)
from .config import default_config

async def get_bird_detections(
    start_date: str,
    end_date: str,
    species: Optional[str] = None
) -> Dict[str, Any]:
    detections = await read_detections_file(default_config)
    detections = filter_detections_by_date(detections, start_date, end_date)
    
    if species:
        detections = filter_detections_by_species(detections, species)
    
    stats = calculate_confidence_stats(detections)
    
    return {
        "detections": detections,
        "stats": stats,
        "total": len(detections)
    }

async def get_detection_stats(
    period: str,
    min_confidence: float = 0.0
) -> Dict[str, Any]:
    detections = await read_detections_file(default_config)
    now = datetime.now()
    
    period_map = {
        "day": timedelta(days=1),
        "week": timedelta(weeks=1),
        "month": timedelta(days=30)
    }
    
    filtered_detections = [
        d for d in detections
        if (period == "all" or 
            now - datetime.fromisoformat(d["timestamp"]) <= period_map[period])
        and d["confidence"] >= min_confidence
    ]
    
    # Calculate statistics
    unique_species = set(d["species"] for d in filtered_detections)
    detections_by_species = {}
    for detection in filtered_detections:
        species = detection["species"]
        detections_by_species[species] = detections_by_species.get(species, 0) + 1
    
    top_species = sorted(
        [{"species": k, "count": v} for k, v in detections_by_species.items()],
        key=lambda x: x["count"],
        reverse=True
    )[:10]
    
    confidence_stats = calculate_confidence_stats(filtered_detections)
    
    return {
        "totalDetections": len(filtered_detections),
        "uniqueSpecies": len(unique_species),
        "detectionsBySpecies": detections_by_species,
        "topSpecies": top_species,
        "confidenceStats": confidence_stats,
        "periodCovered": period,
        "minConfidence": min_confidence
    }

async def get_audio_recording(
    filename: str,
    format: str = 'base64'
) -> Dict[str, Any]:
    audio_buffer = await get_audio_buffer(default_config, filename)
    if format == 'base64':
        return {
            "audio": base64.b64encode(audio_buffer).decode('utf-8'),
            "format": format
        }
    return {
        "audio": audio_buffer,
        "format": 'buffer'
    }

async def get_daily_activity(
    date: str,
    species: Optional[str] = None
) -> Dict[str, Any]:
    detections = await read_detections_file(default_config)
    target_date = datetime.fromisoformat(date)
    
    # Filter detections for the target date
    day_detections = [
        d for d in detections
        if datetime.fromisoformat(d["timestamp"]).date() == target_date.date()
    ]
    
    if species:
        day_detections = filter_detections_by_species(day_detections, species)
    
    # Calculate hourly activity
    hourly_activity = [0] * 24
    for detection in day_detections:
        hour = datetime.fromisoformat(detection["timestamp"]).hour
        hourly_activity[hour] += 1
    
    return {
        "date": date,
        "species": species or "all",
        "totalDetections": len(day_detections),
        "hourlyActivity": hourly_activity,
        "peakHour": hourly_activity.index(max(hourly_activity)),
        "uniqueSpecies": len(set(d["species"] for d in day_detections))
    }

async def generate_detection_report(
    start_date: str,
    end_date: str,
    format: str = 'html'
) -> Dict[str, Any]:
    detections = await get_bird_detections(start_date, end_date)
    stats = await get_detection_stats("all")
    
    if format == 'html':
        # Generate HTML report
        html_content = f"""
        <html>
            <head><title>Bird Detection Report</title></head>
            <body>
                <h1>Bird Detection Report</h1>
                <p>Period: {start_date} to {end_date}</p>
                <h2>Summary</h2>
                <ul>
                    <li>Total Detections: {stats['totalDetections']}</li>
                    <li>Unique Species: {stats['uniqueSpecies']}</li>
                </ul>
                <!-- Add more report content -->
            </body>
        </html>
        """
        return {"report": html_content, "format": "html"}
    
    return {
        "report": {
            "period": {"start": start_date, "end": end_date},
            "summary": stats,
            "detections": detections
        },
        "format": "json"
    }