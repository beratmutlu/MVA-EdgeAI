import math

def get_center(x1, y1, x2, y2):
    return int((x1 + x2) / 2), int((y1 + y2) / 2)

def compute_angle(start, end):
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    return math.degrees(math.atan2(-dy, dx)) % 360

def angle_to_direction(angle):
    if 337.5 <= angle or angle < 22.5:
        return "East"
    elif 22.5 <= angle < 67.5:
        return "North-East"
    elif 67.5 <= angle < 112.5:
        return "North"
    elif 112.5 <= angle < 157.5:
        return "North-West"
    elif 157.5 <= angle < 202.5:
        return "West"
    elif 202.5 <= angle < 247.5:
        return "South-West"
    elif 247.5 <= angle < 292.5:
        return "South"
    elif 292.5 <= angle < 337.5:
        return "South-East"