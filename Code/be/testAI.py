import cv2
import mediapipe as mp

# Khởi tạo các đối tượng MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

# Mở webcam hoặc video
cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Chuyển đổi hình ảnh màu sang RGB (MediaPipe yêu cầu hình ảnh RGB)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Phát hiện bàn tay
    result = hands.process(rgb_frame)

    # Vẽ các landmarks nếu có
    if result.multi_hand_landmarks:
        for landmarks in result.multi_hand_landmarks:
            mp_drawing.draw_landmarks(frame, landmarks, mp_hands.HAND_CONNECTIONS)

    # Hiển thị kết quả
    cv2.imshow("Hand Landmarks Detection", frame)

    # Thoát khi nhấn phím 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Giải phóng camera và đóng cửa sổ
cap.release()
cv2.destroyAllWindows()
