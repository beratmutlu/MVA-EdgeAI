# EdgeAI: Visual Perception Tasks on Edge Devices - Group 2

**Group Members:**  
- Berat Emir Mutlu  
- Kazım Efe Koçyiğit

## 📌 Project Overview

This project addresses real-time visual perception tasks on edge devices within a **Federated Learning** framework. It includes:

- Specialized edge-side tasks: **Color Detection** and **Direction Detection**
- A **web-based visualization tool** for inspecting and analyzing model predictions

## 🎯 Goals

- Implement object attribute recognition (color & direction) on edge devices
- Design an interactive frontend for monitoring outputs
- Ensure modularity for easy integration into federated learning workflows

---

## 🧠 Core Features

### 🔹 Specialized Tasks on Edge

#### 1. Color Detection
- Uses YOLOv8 for vehicle detection
- Extracts image regions and filters with RGBA masking
- Performs K-Means clustering for dominant color detection
- Maps RGB to human-readable XKCD color names
- Updates labels every second

#### 2. Direction Detection
- Calculates motion vectors based on frame-to-frame centers
- Converts vectors to 8 cardinal directions (N, NE, E, etc.)
- Updates every 2 seconds

---

### 🔹 Web-Based Visualization Tool

A browser-based GUI to interactively analyze system outputs.

#### Features:
- Load predictions from `.json` files
- Visualize object class frequency and predictions over time
- Inspect system stats (CPU, memory) during execution

#### Tech Stack:
- `Chart.js` for plotting
- `HTML/CSS/JavaScript` frontend
- Lightweight JSON-driven architecture


---

## 🚀 Getting Started

### Requirements
- Python ≥ 3.8
- OpenCV, NumPy, scikit-learn (for edge tasks)
- Modern browser (for web GUI)
