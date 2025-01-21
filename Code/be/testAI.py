import cv2
import mediapipe as mp
import math

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

    # Kiểm tra nếu có ít nhất hai bàn tay
    if result.multi_hand_landmarks and len(result.multi_hand_landmarks) >= 2:
        # Lấy hai bàn tay đầu tiên
        hand1 = result.multi_hand_landmarks[0]
        hand2 = result.multi_hand_landmarks[1]

        # Lấy tọa độ điểm MCP (điểm 9) của ngón giữa từ hai bàn tay
        x1, y1 = hand1.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_MCP].x, hand1.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_MCP].y
        x2, y2 = hand2.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_MCP].x, hand2.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_MCP].y

        # Chuyển đổi tọa độ chuẩn hóa thành tọa độ pixel
        h, w, _ = frame.shape
        x1, y1 = int(x1 * w), int(y1 * h)
        x2, y2 = int(x2 * w), int(y2 * h)

        # Tính trung điểm và bán kính của vòng tròn
        center_x, center_y = (x1 + x2) // 2, (y1 + y2) // 2
        radius = int(math.sqrt((x2 - x1)**2 + (y2 - y1)**2) / 2)

        # Vẽ vòng tròn
        cv2.circle(frame, (center_x, center_y), radius, (0, 255, 0), 2)

        # Vẽ đường thẳng nối giữa hai điểm MCP của ngón giữa
        cv2.line(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)

    # Vẽ các landmarks nếu có
    if result.multi_hand_landmarks:
        for hand_landmarks in result.multi_hand_landmarks:
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

    # Hiển thị kết quả
    cv2.imshow("Hand Landmarks Detection", frame)

    # Thoát khi nhấn phím 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Giải phóng camera và đóng cửa sổ
cap.release()
cv2.destroyAllWindows()
