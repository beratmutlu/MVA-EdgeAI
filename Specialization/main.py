# main.py
import cv2
import argparse
from tracker import initialize_tracker, update_tracker
from detector import detect_vehicles
from renderer import render_labels
from utils import get_fps

def parse_args():
    parser = argparse.ArgumentParser(description="Vehicle Tracking System")
    parser.add_argument("--video", type=str, default="vidoe2.webm", help="Path to video file")
    parser.add_argument("--model", type=str, default="yolov8n.pt", help="Path to YOLO model")
    return parser.parse_args()


def main():
    args = parse_args()

    cap = cv2.VideoCapture(args.video)
    if not cap.isOpened():
        print("ERROR: Could not open video file.")
        return

    fps = get_fps(cap)
    tracker_state = initialize_tracker(fps, args.model)

    frame_id = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        detections, vehicle_types = detect_vehicles(tracker_state['model'], frame)
        tracks = update_tracker(tracker_state, frame, detections, vehicle_types, frame_id)
        render_labels(frame, tracks, tracker_state, frame_id)

        cv2.imshow("Specialization", frame)
        if cv2.waitKey(1) == 27:
            break

        frame_id += 1

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
