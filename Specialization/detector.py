# detector.py
def detect_vehicles(model, frame):
    results = model(frame)[0]
    detections = []
    vehicle_types = []

    for box in results.boxes:
        cls_id = int(box.cls[0])
        label = model.names[cls_id]
        if label not in ["car", "truck", "bus"]:
            continue

        x1, y1, x2, y2 = map(int, box.xyxy[0])
        conf = float(box.conf[0])
        detections.append([x1, y1, x2, y2, conf])
        vehicle_types.append(label)

    return detections, vehicle_types
