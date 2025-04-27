import numpy as np
import tensorflow as tf
from PIL import Image
from io import BytesIO

class PredictionService:
    # Load model và labels khi import
    model = tf.keras.models.load_model(r"D:\PBL5\Code\be\be\services\MyModel.keras")
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

    @staticmethod
    def predict(file_bytes):
        try:
            # Đọc ảnh
            image = Image.open(BytesIO(file_bytes))
            image = image.resize((224, 224))
            image = np.array(image).astype("float32") / 255.0
            if image.shape[-1] == 4:  # Nếu có alpha channel thì bỏ
                image = image[:, :, :3]
            image = np.expand_dims(image, axis=0)

            # Dự đoán
            preds = PredictionService.model.predict(image)
            confidence = np.max(preds)
            class_id = np.argmax(preds)

            if confidence > 0.8:
                label = PredictionService.labels[class_id]
                print(label)
            else:
                label = "Không có trái cây"

            return {
                "label": label,
                "confidence": float(confidence)
            }
        except Exception as e:
            raise ValueError(f"Prediction failed: {str(e)}")
