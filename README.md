# EdgeAI: Vehicle Tracking & Visualization — Group 2

**Group Members**
- Berat Emir Mutlu  
- Kazim Efe Koçyiğit

---

## 📌 Overview

This project performs **real-time vehicle detection and tracking** on video input using YOLOv8.  
It includes:
- A **vehicle tracking pipeline** in Python (OpenCV + YOLOv8).
- A **web-based visualization interface** to display results.

The code is designed to be extendable for **color detection**, **direction detection**, and possible **Federated Learning** integration.

---

## 🧠 Current Features

### Vehicle Detection & Tracking
- YOLOv8 for detecting vehicles in video frames.
- Tracking across frames using `tracker.py` + SORT algorithm.
- Real-time display with bounding boxes and labels.

### Web Visualization
- Static HTML/CSS/JS interface to load and display prediction data from `.json` files.
- Data table & chart visualization (requires manually prepared JSON).

---

## 🚀 Quick Start

### 1) Requirements

- **Python** ≥ 3.8  
- **Packages**:  
  `opencv-python`, `numpy`, `ultralytics`  
- **Browser**: Any modern browser (Chrome/Firefox/Edge)  
- **VS Code** with **Live Server** extension (for visualization)

Install Python dependencies:
```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -U pip
pip install opencv-python numpy ultralytics
```

---

### 2) Project Structure

```
EdgeAI-Visual-Perception/
│
├─ Specialization/                # Core detection/tracking pipeline
│  ├─ calcDirection.py            #  direction detection
│  ├─ cropVehicle.py               # Extracts vehicle ROIs
│  ├─ detectColor.py               # color detection
│  ├─ detector.py                  # YOLO detection logic
│  ├─ main.py                      # Entry point
│  ├─ renderer.py                  # Renders labels/boxes on frames
│  ├─ sort.py                      # SORT tracking implementation
│  ├─ tracker.py                   # Tracker initialization/update
│  ├─ utils.py                     # Utility functions
│  ├─ vidoe2.webm                  # Sample video 
│  └─ yolov8n.pt                   # YOLOv8 weights
│
├─ Visualisation/                  # Web-based visualization
│  ├─ assets/                      # Images/icons/etc.
│  ├─ data.json                     # Example data file
│  ├─ index.html                    # Main HTML page
│  ├─ script.js                     # Logic for loading/displaying data
│  └─ style.css                     # Styling for visualization
│
├─ Documentation.pdf                # Additional documentation
└─ README.md
```

---

## ▶️ Run the Vehicle Tracker

Currently, the only supported arguments are:

```bash
python main.py --video path/to/video --model path/to/yolov8.pt
```

**Arguments**
- `--video` — Path to a video file (e.g., `sample.mp4`) or camera index (`0` for default webcam).  
  Default: `"vidoe2.webm"` (rename if needed).  
- `--model` — Path to YOLOv8 model weights. Default: `yolov8n.pt`.

**Examples**
```bash
# 1) Use webcam
python main.py --video 0

# 2) Use sample video
python main.py --video vidoe2.webm --model yolov8n.pt
```

---

## 📊 Visualize Results (Web GUI)

### Steps (VS Code Live Server)
1. Open `Visualisation/` in VS Code.  
2. Install the **Live Server** extension.  
3. Right-click `index.html` → **Open with Live Server**.  
4. Double-click `index.html` if browser did not launch automatically.
---
