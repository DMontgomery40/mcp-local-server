import os

default_config = {
    'detections_file': os.getenv('BIRDNET_DETECTIONS_FILE', 'data/detections.json'),
    'audio_dir': os.getenv('BIRDNET_AUDIO_DIR', 'data/audio'),
    'report_dir': os.getenv('BIRDNET_REPORT_DIR', 'data/reports')
}