# utils.py
def get_fps(cap):
    fps = cap.get(5)  # cv2.CAP_PROP_FPS
    return fps if fps > 0 else 30

def format_label(vehicle_type, color, direction):
    return f"{color} - {direction}"