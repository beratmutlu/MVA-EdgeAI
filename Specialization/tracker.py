# tracker.py
import numpy as np
from collections import defaultdict
from sort import Sort
from cropVehicle import cropCar
from detectColor import get_dominant_color_from_rgba, closest_xkcd_color
from calcDirection import get_center, angle_to_direction, compute_angle
from ultralytics import YOLO


def initialize_tracker(fps, model_path):
    return {
        "model": YOLO(model_path),
        "tracker": Sort(max_age=20, min_hits=3, iou_threshold=0.3),
        "track_history": defaultdict(list),
        "last_directions": {},
        "vehicle_colors": {},
        "vehicle_types": {},
        "last_color_update": {},
        "fps": fps,
        "direction_interval": int(fps * 2),
        "color_interval": int(fps),
    }


def update_tracker(state, frame, detections, temp_types, frame_id):
    tracks = state["tracker"].update(np.array(detections))
    results = []

    for i, track in enumerate(tracks):
        x1, y1, x2, y2, track_id = map(int, track)
        center = get_center(x1, y1, x2, y2)
        state["track_history"][track_id].append((frame_id, center))

        if track_id not in state["vehicle_types"] and i < len(temp_types):
            state["vehicle_types"][track_id] = temp_types[i]

        if (track_id not in state["vehicle_colors"] or
                frame_id - state["last_color_update"].get(track_id, 0) >= state["color_interval"]):
            crop_ = frame[y1:y2, x1:x2]
            thisresult = cropCar(crop_)
            if thisresult is not None:
                _, _, crop = thisresult
                if crop is not None and crop.size > 0:
                    colorrgb, _ = get_dominant_color_from_rgba(crop)
                    color = closest_xkcd_color(colorrgb)
                    state["vehicle_colors"][track_id] = color
                    state["last_color_update"][track_id] = frame_id

        history = state["track_history"][track_id]
        if len(history) >= 2:
            _, prev = history[-2]
            _, curr = history[-1]

            if (track_id not in state["last_directions"] or
                    frame_id - state["last_directions"][track_id][0] > state["direction_interval"]):
                angle = compute_angle(prev, curr)
                direction = angle_to_direction(angle)
                state["last_directions"][track_id] = (frame_id, direction)

        results.append((x1, y1, x2, y2, track_id))

    return results
