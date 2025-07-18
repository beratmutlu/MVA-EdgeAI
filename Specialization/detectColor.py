import matplotlib.colors as mcolors
import numpy as np
from sklearn.cluster import KMeans

def hex_to_rgb(hex_code):
    hex_code = hex_code.lstrip('#')
    return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))

def closest_xkcd_color(rgb):
    min_dist = float('inf')
    closest_name = None

    for name, hex_val in mcolors.XKCD_COLORS.items():
        xkcd_rgb = hex_to_rgb(hex_val)
        dist = sum((a - b) ** 2 for a, b in zip(rgb, xkcd_rgb))
        if dist < min_dist:
            min_dist = dist
            closest_name = name.replace('xkcd:', '')

    return closest_name

def get_dominant_color_from_rgba(rgba_image, k=3):

    assert rgba_image.shape[2] == 4, "Input must be an RGBA image"

    # Reshape to a list of pixels
    pixels = rgba_image.reshape(-1, 4)

    # Filter out fully transparent pixels
    visible_pixels = pixels[pixels[:, 3] > 0]

    if len(visible_pixels) == 0:
        raise ValueError("No visible pixels found in alpha mask.")

    # Extract only RGB values
    rgb_pixels = visible_pixels[:, :3]

    # Run K-Means clustering
    kmeans = KMeans(n_clusters=k, n_init='auto', random_state=42)
    kmeans.fit(rgb_pixels)

    # Count how many pixels are in each cluster
    _, counts = np.unique(kmeans.labels_, return_counts=True)

    # Sort colors by count descending
    sorted_indices = np.argsort(-counts)
    sorted_colors = kmeans.cluster_centers_[sorted_indices]

    # Convert to uint8 RGB values
    dominant_color = tuple(map(int, sorted_colors[0]))
    all_colors = [tuple(map(int, c)) for c in sorted_colors]

    return dominant_color, all_colors