import os
import cv2
import time
import numpy as np
import tensorflow as tf
import pygame
import uuid
from gtts import gTTS
from PIL import Image, ImageDraw, ImageFont
import logging

tf.get_logger().setLevel(logging.ERROR)  # Chỉ hiển thị lỗi
# Tắt cảnh báo TensorFlow
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"  # Chỉ hiển thị ERROR, bỏ qua cả WARNING

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

# Khởi tạo pygame
pygame.mixer.init()

# Font tiếng Việt
FONT_PATH = "arial.ttf"


def speak(label):
    vi, en = label.split(" - ")  # Tách tiếng Việt & tiếng Anh  
    files = []  # Danh sách file mp3 để xóa sau khi phát xong

    # Tạo file âm thanh tiếng Việt
    vi_mp3 = f"label_vi_{uuid.uuid4().hex}.mp3"
    gTTS(text=vi, lang="vi").save(vi_mp3)
    files.append(vi_mp3)

    # Tạo file âm thanh tiếng Anh
    en_mp3 = f"label_en_{uuid.uuid4().hex}.mp3"
    gTTS(text=en, lang="en").save(en_mp3)
    files.append(en_mp3)

    for mp3_file in files:
        pygame.mixer.music.load(mp3_file)
        pygame.mixer.music.play()

        # Đợi cho đến khi phát xong
        while pygame.mixer.music.get_busy(): 
            time.sleep(0.1)
            
        pygame.mixer.music.stop()
        pygame.mixer.quit()  # Đóng pygame để giải phóng file
        time.sleep(0.5)  # Chờ hệ thống hoàn toàn giải phóng file

        os.remove(mp3_file)  # Xóa file
        pygame.mixer.init()  # Khởi động lại pygame để tiếp tục phát âm thanh sau này


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


last_label = None

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Kiểm tra nếu camera bị mất kết nối
        if not cap.isOpened():
            cap.release()
            cap = cv2.VideoCapture(0)

        # Tiền xử lý ảnh
        img = cv2.resize(frame, (224, 224))
        img = img.astype("float32") / 255.0
        img = np.expand_dims(img, axis=0)

        # Dự đoán nhãn
        predictions = model.predict(img)
        confidence = np.max(predictions)
        class_id = np.argmax(predictions)
        label = labels[class_id]

        if confidence > 0.8 and label != last_label:
            speak(label)
            last_label = label
        else:
            label = "Không có trái cây"

        frame = draw_text(frame, label, (20, 50))
        cv2.imshow("Fruit Detection", frame)

        # Reset camera buffer để tránh lag
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

finally:
    cap.release()
    cv2.destroyAllWindows()
    pygame.mixer.quit()