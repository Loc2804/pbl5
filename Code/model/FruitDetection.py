from ultralytics import YOLO
import cv2

# Load model (dùng best.pt hoặc yolov8n.pt tùy bạn)
model = YOLO("yolov8n.pt")  # hoặc "yolov8n.pt"

# Mở webcam
cap = cv2.VideoCapture(0)  # 0 là camera mặc định

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Dự đoán
    results = model.predict(frame, conf=0.5)  # conf: confidence threshold

    # Vẽ kết quả lên khung hình
    annotated_frame = results[0].plot()

    # Hiển thị
    cv2.imshow("Fruit Detection", annotated_frame)

    # Nhấn 'q' để thoát
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
