from silence_tensorflow import silence_tensorflow
import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import matplotlib.pyplot as plt

# Load mô hình
silence_tensorflow()
model = tf.keras.models.load_model("MyModel.keras")

# Kích thước ảnh
IMG_SIZE = (224, 224)  # Điều chỉnh theo input model

# Hàm tiền xử lý ảnh
def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=IMG_SIZE)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array

# Đọc và tiền xử lý ảnh
img_path = "images.jpg"
img_array = preprocess_image(img_path)

# Dự đoán
predictions = model.predict(img_array)
predicted_class = np.argmax(predictions, axis=1)[0]

# Danh sách nhãn
class_labels = ["Quả táo - Apple", "Quả chuối - Banana", "Củ dền - Beetroot",
                "Ớt chuông - Bell Pepper", "Cải bắp - Cabbage", "Chi ớt - Capsicum",
                "Củ cà rốt - Carrot", "Bông cải trắng - Cauliflower", "Ớt - Chilli Pepper",
                "Quả bắp - Corn", "Quả dưa chuột - Cucumber", "Quả sầu riêng - Durian", "Quả cà tím - Eggplant",
                "Củ tỏi - Garlic", "Củ gừng - Ginger", "Quả nho - Grapes", "Ớt - Jalapeno",
                "Quả kiwi - Kiwi", "Quả chanh - Lemon", "Xà lách - Lettuce", "Quả xoài - Mango",
                "Củ hành - Onion", "Quả cam - Orange", "Ớt bột - Paprika", "Quả lê - Pear",
                "Đậu hà lan - Peas", "Quả dứa - Pineapple", "Quả lựu - Pomegranate",
                "Củ khoai tây - Potato", "Củ cải - Raddish", "Đậu nành - Soy Beans",
                "Rau chân vịt - Spinach", "Bắp ngọt - Sweetcorn", "Khoai lang - Sweetpotato",
                "Quả cà chua - Tomato", "Củ cải - Turnip", "Quả dưa hấu - Watermelon"]

predicted_label = class_labels[predicted_class]
print(f"Loại trái cây dự đoán: {predicted_label}")

# Hiển thị ảnh và nhãn dự đoán
img_display = image.load_img(img_path)  # Load lại để hiển thị
plt.imshow(img_display)
plt.axis('off')
plt.title(f"Dự đoán: {predicted_label}", fontsize=14, color='green')
plt.show()
