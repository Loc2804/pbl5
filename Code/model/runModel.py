from silence_tensorflow import silence_tensorflow
import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
import tensorflow as tf
# Load mô hình đã lưu
silence_tensorflow()
model = tf.keras.models.load_model("MyModel.keras")

import numpy as np
from tensorflow.keras.preprocessing import image

# Định nghĩa kích thước ảnh giống khi train
IMG_SIZE = (224, 224)  # Thay đổi theo kích thước input của mô hình bạn

def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=IMG_SIZE)  # Đọc ảnh và resize
    img_array = image.img_to_array(img)  # Chuyển thành numpy array
    img_array = np.expand_dims(img_array, axis=0)  # Thêm batch dimension
    img_array = img_array / 255.0  # Chuẩn hóa nếu cần
    return img_array
# Đọc và tiền xử lý ảnh
img_path = "duriantest4.jpg"  # Đường dẫn ảnh cần nhận diện
img_array = preprocess_image(img_path)

# Dự đoán
predictions = model.predict(img_array)

# Lấy lớp có xác suất cao nhất
predicted_class = np.argmax(predictions, axis=1)[0]

print(f"Dự đoán: {predicted_class}")
# Giả sử bạn có danh sách nhãn giống thứ tự khi train
class_labels = ["Quả táo - Apple", "Quả chuối - Banana", "Củ dền - Beetroot",
                "Ớt chuông - Bell Pepper", "Cải bắp - Cabbage", "Chi ớt - Capsicum",
                "Củ cà rốt - Carrot", "Bông cải trắng - Cauliflower", "Ớt - Chilli Pepper",
                "Quả bắp - Corn", "Quả dưa chuột - Cucumber","Quả sầu riêng - Durian", "Quả cà tím - Eggplant",
                "Củ tỏi - Garlic", "Củ gừng - Ginger","Quả nho - Grapes", "Ớt - Jalapeno",
                "Quả kiwi - Kiwi", "Quả chanh - Lemon", "Xà lách - Lettuce", "Quả xoài - Mango",
                "Củ hành - Onion", "Quả cam - Orange", "Ớt bột - Paprika", "Quả lê - Pear",
                "Đậu hà lan - Peas", "Quả dứa - Pineapple","Quả lựu - Pomegranate",
                "Củ khoai tây - Potato", "Củ cải - Raddish", "Đậu nành - Soy Beans",
                "Rau chân vịt - Spinach", "Bắp ngọt - Sweetcorn", "Khoai lang - Sweetpotato",
                "Quả cà chua - Tomato", "Củ cải - Turnip", "Quả dưa hấu - Watermelon"]  # Thay bằng nhãn của bạn

predicted_label = class_labels[predicted_class]
print(f"Loại trái cây dự đoán: {predicted_label}")