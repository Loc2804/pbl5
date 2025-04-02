import os
from datetime import time

import cv2
import numpy as np
import tensorflow as tf
from PIL import Image, ImageDraw, ImageFont
import logging

tf.get_logger().setLevel(logging.ERROR)  # Chỉ hiển thị lỗi
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"  # Chỉ hiển thị ERROR

# Load mô hình đã train
model = tf.keras.models.load_model("MyModel.keras")

# Danh sách nhãn
labels = ["Quả táo - Apple", "Quả chuối - Banana", "Củ dền - Beetroot",
          "Ớt chuông - Bell Pepper", "Cải bắp - Cabbage", "Chi ớt - Capsicum",
          "Củ cà rốt - Carrot", "Bông cải trắng - Cauliflower", "Ớt - Chilli Pepper",
          "Quả bắp - Corn", "Quả dưa chuột - Cucumber", "Quả sầu riêng - Durian",
          "Quả cà tím - Eggplant", "Củ tỏi - Garlic", "Củ gừng - Ginger",
          "Quả nho - Grapes", "Ớt - Jalapeno", "Quả kiwi - Kiwi", "Quả chanh - Lemon",
          "Xà lách - Lettuce", "Quả xoài - Mango", "Củ hành - Onion", "Quả cam - Orange",
          "Ớt bột - Paprika", "Quả lê - Pear", "Đậu hà lan - Peas", "Quả dứa - Pineapple",
          "Quả lựu - Pomegranate", "Củ khoai tây - Potato", "Củ cải - Raddish",
          "Đậu nành - Soy Beans", "Rau chân vịt - Spinach", "Bắp ngọt - Sweetcorn",
          "Khoai lang - Sweetpotato", "Quả cà chua - Tomato", "Củ cải - Turnip",
          "Quả dưa hấu - Watermelon"]

# Khởi tạo camera
cap = cv2.VideoCapture(0)

# Font tiếng Việt
FONT_PATH = "arial.ttf"

def draw_text(img, text, position, font_path=FONT_PATH, font_size=32, color=(0, 255, 0)):
    """Hiển thị văn bản có dấu trên ảnh."""
    pil_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(pil_img)
    try:
        font = ImageFont.truetype(font_path, font_size)
    except IOError:
        font = ImageFont.load_default()
    draw.text(position, text, font=font, fill=color)
    return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Không thể đọc dữ liệu từ camera, thử lại...")
            time.sleep(1)
            continue  # Không thoát ngay

        # Dự đoán với mô hình
        img = cv2.resize(frame, (224, 224))
        img = img.astype("float32") / 255.0
        img = np.expand_dims(img, axis=0)

        try:
            predictions = model.predict(img)
            confidence = np.max(predictions)
            class_id = np.argmax(predictions)
            label = labels[class_id] if confidence > 0.8 else "Không có trái cây"
        except Exception as e:
            print(f"Lỗi khi dự đoán: {e}")
            continue  # Nếu lỗi, bỏ qua và tiếp tục

        frame = draw_text(frame, label, (20, 50))
        cv2.imshow("Fruit Detection", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

except Exception as e:
    print(f"Lỗi nghiêm trọng: {e}")

finally:
    cap.release()
    cv2.destroyAllWindows()
