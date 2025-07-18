import cv2
import numpy as np
from matplotlib import pyplot as plt

def cropCar(image):
    if image is None or np.allclose(image.copy(), 0):
        return None
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 5)
    gray = cv2.bilateralFilter(gray, 9, 75, 75)
    gray = cv2.fastNlMeansDenoising(gray, h=10)

    kernel = np.ones((5, 5), np.uint8)
    edges = cv2.Canny(gray, 50, 150)
    edges = cv2.dilate(edges, kernel, iterations=2)
    edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel, iterations=1)

    contours, _ = cv2.findContours(edges.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    min_area = 0.1 * image.shape[0] * image.shape[1]
    contours = [c for c in contours if cv2.contourArea(c) > min_area]

    if not contours:
        print("No valid contours found.")
        return None, None, None

    largest = max(contours, key=cv2.contourArea)

    mask = np.zeros(image.shape[:2], dtype=np.uint8)
    cv2.drawContours(mask, [largest], -1, color=(255,), thickness=-1)

    masked = cv2.bitwise_and(image, image, mask=mask)
    x, y, w, h = cv2.boundingRect(largest)
    car_cropped = masked[y:y + h, x:x + w]
    mask_cropped = mask[y:y + h, x:x + w]

    if car_cropped.shape[0] == 0 or car_cropped.shape[1] == 0:
        print("Cropped image is empty.")
        return None, None, None

    b, g, r = cv2.split(car_cropped)
    alpha = mask_cropped
    rgba = cv2.merge((r, g, b, alpha))

    """
    plt.figure(figsize=(6, 6))
    plt.imshow(rgba)
    plt.title("Cropped Car with Transparent Background")
    plt.axis('off')
    plt.show()
    """

    return car_cropped, mask_cropped, rgba