# renderer.py
import cv2
from utils import format_label

def render_labels(frame, tracks, state, frame_id):
    for x1, y1, x2, y2, track_id in tracks:
        direction = state['last_directions'].get(track_id, (None, ""))[1]
        color = state['vehicle_colors'].get(track_id, "")
        vehicle_type = state['vehicle_types'].get(track_id, "")

        label_text = format_label(vehicle_type, color, direction)
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.4
        thickness = 1

        (text_width, text_height), baseline = cv2.getTextSize(label_text, font, font_scale, thickness)
        text_x, text_y = x1, y1 - 5
        if text_y - text_height - baseline < 0:
            text_y = y1 + text_height + baseline + 5

        bg_color = get_label_color(vehicle_type)

        cv2.rectangle(
            frame,
            (text_x, text_y - text_height - baseline),
            (text_x + text_width, text_y + baseline),
            bg_color, cv2.FILLED
        )

        cv2.putText(frame, label_text, (text_x, text_y),
                    font, font_scale, (0, 0, 0), thickness)



def get_label_color(vehicle_type):
    base_colors = {
        "car": (0, 0, 255),     # red
        "truck": (255, 0, 0),   # blue
        "bus": (0, 255, 0),     # green
    }
    color = base_colors.get(vehicle_type.lower(), (200, 200, 200))
    # Make it transparent-like (lighter shade)
    faded = tuple(int(0.3 * c + 255 * 0.7) for c in color)
    return faded

