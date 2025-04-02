import tensorflow as tf
import cv2
import numpy as np

# Đường dẫn tới mô hình SavedModel (dạng .pb)
model_path = "keras_metadata.pb"  # Thay thế bằng đường dẫn tới thư mục chứa mô hình của bạn

# Tải mô hình SavedModel
model = tf.saved_model.load(model_path)

# Lấy signature của mô hình để thực hiện dự đoán
infer = model.signatures["serving_default"]

# Danh sách nhãn với tiếng Anh và tiếng Việt
labels = {
    0: ('Quince', 'Mộc Qua'), 1: ('Grapefruit White', 'Bưởi Trắng'), 2: ('Granadilla', 'Chanh Leo'),
    3: ('Orange', 'Cam'),
    4: ('Apple Red 3', 'Táo Đỏ 3'), 5: ('Grape White 2', 'Nho Trắng 2'), 6: ('Corn Husk', 'Vỏ Ngô'),
    7: ('Tamarillo', 'Cà Chua Cây'),
    8: ('Banana Red', 'Chuối Đỏ'), 9: ('Nectarine Flat', 'Đào Dẹt'), 10: ('Pepper Yellow', 'Ớt Vàng'),
    11: ('Nut Forest', 'Hạt Rừng'), 12: ('Pear Monster', 'Lê Quái Vật'), 13: ('Fig', 'Sung'),
    14: ('Tomato Heart', 'Cà Chua Tim'),
    15: ('Onion Red Peeled', 'Hành Đỏ Bóc Vỏ'), 16: ('Lemon Meyer', 'Chanh Meyer'), 17: ('Onion Red', 'Hành Đỏ'),
    18: ('Passion Fruit', 'Chanh Leo'), 19: ('Cucumber Ripe', 'Dưa Leo Chín'), 20: ('Cactus fruit', 'Quả Xương Rồng'),
    21: ('Tomato not Ripened', 'Cà Chua Chưa Chín'), 22: ('Mango Red', 'Xoài Đỏ'),
    23: ('Apple Pink Lady', 'Táo Pink Lady'),
    24: ('Pomegranate', 'Lựu'), 25: ('Plum', 'Mận'), 26: ('Pineapple', 'Dứa'), 27: ('Tomato 1', 'Cà Chua 1'),
    28: ('Cherry 2', 'Anh Đào 2'), 29: ('Apple Red 2', 'Táo Đỏ 2'), 30: ('Avocado ripe', 'Bơ Chín'),
    31: ('Dates', 'Chà Là'), 32: ('Maracuja', 'Chanh Leo Maracuja'), 33: ('Papaya', 'Đu Đủ'),
    34: ('Nut Pecan', 'Hạt Hồ Đào'),
    35: ('Pear Stone', 'Lê Đá'), 36: ('Cherry Wax Yellow', 'Anh Đào Vàng Sáp'), 37: ('Eggplant', 'Cà Tím'),
    38: ('Apple Golden 2', 'Táo Vàng 2'), 39: ('Guava', 'Ổi'), 40: ('Beetroot', 'Củ Dền'),
    41: ('Tomato Maroon', 'Cà Chua Đỏ Sẫm'), 42: ('Potato Red', 'Khoai Tây Đỏ'),
    43: ('Apple Red Delicious', 'Táo Đỏ Ngon'),
    44: ('Cherry Wax Red', 'Anh Đào Đỏ Sáp'), 45: ('Kiwi', 'Kiwi'), 46: ('Cherry Wax Black', 'Anh Đào Đen Sáp'),
    47: ('Limes', 'Chanh Xanh'), 48: ('Cantaloupe 2', 'Dưa Lưới 2'), 49: ('Apple Braeburn', 'Táo Braeburn'),
    50: ('Pear', 'Lê'), 51: ('Carambula', 'Khế'), 52: ('Tomato 3', 'Cà Chua 3'), 53: ('Onion White', 'Hành Trắng'),
    54: ('Cherry 1', 'Anh Đào 1'), 55: ('Strawberry', 'Dâu Tây'), 56: ('Lychee', 'Vải'),
    57: ('Redcurrant', 'Nho Đỏ'), 58: ('Rambutan', 'Chôm Chôm'), 59: ('Potato Red Washed', 'Khoai Tây Đỏ Rửa Sạch'),
    60: ('Tomato 4', 'Cà Chua 4'), 61: ('Hazelnut', 'Hạt Dẻ'), 62: ('Tomato Yellow', 'Cà Chua Vàng'),
    63: ('Plum 3', 'Mận 3'), 64: ('Grape White', 'Nho Trắng'), 65: ('Pineapple Mini', 'Dứa Mini'),
    66: ('Mulberry', 'Dâu Tằm'), 67: ('Grape Blue', 'Nho Xanh'), 68: ('Pear Abate', 'Lê Abate'),
    69: ('Melon Piel de Sapo', 'Dưa Piel de Sapo'), 70: ('Pepper Orange', 'Ớt Cam'),
    71: ('Cauliflower', 'Súp Lơ Trắng'), 72: ('Nectarine', 'Xuân Đào'), 73: ('Salak', 'Mắc Ca'),
    74: ('Cocos', 'Dừa'), 75: ('Chestnut', 'Hạt Dẻ'), 76: ('Blueberry', 'Việt Quất'),
    77: ('Apple Granny Smith', 'Táo Granny Smith'), 78: ('Banana Lady Finger', 'Chuối Ngón Tay'),
    79: ('Apricot', 'Mơ'), 80: ('Walnut', 'Óc Chó'), 81: ('Apple Crimson Snow', 'Táo Crimson Snow'),
    82: ('Grapefruit Pink', 'Bưởi Hồng'), 83: ('Tangelo', 'Quýt Tangelo'), 84: ('Peach Flat', 'Đào Dẹt'),
    85: ('Pear Forelle', 'Lê Forelle'), 86: ('Pepper Red', 'Ớt Đỏ'), 87: ('Tomato Cherry Red', 'Cà Chua Bi Đỏ'),
    88: ('Pear Williams', 'Lê Williams'), 89: ('Clementine', 'Quýt Clementine'), 90: ('Apple Golden 3', 'Táo Vàng 3'),
    91: ('Apple Red 1', 'Táo Đỏ 1'), 92: ('Pear 2', 'Lê 2'), 93: ('Plum 2', 'Mận 2'),
    94: ('Cantaloupe 1', 'Dưa Lưới 1'), 95: ('Lemon', 'Chanh'), 96: ('Physalis with Husk', 'Quả Lý Chua Có Vỏ'),
    97: ('Peach 2', 'Đào 2'), 98: ('Pepino', 'Dưa Pepino'), 99: ('Huckleberry', 'Việt Quất Huckleberry'),
    100: ('Potato White', 'Khoai Tây Trắng'), 101: ('Pitahaya Red', 'Thanh Long Đỏ'),
    129: ('Mango', 'Xoài'), 130: ('Tomato 2', 'Cà Chua 2')
}

# Hàm dự đoán và nhận diện đối tượng trong ảnh
def detect_and_classify(image_path):
    # Đọc ảnh
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        if w > 20 and h > 20:  # Loại bỏ các vùng quá nhỏ
            roi = image[y:y + h, x:x + w]
            roi = cv2.resize(roi, (100, 100))
            roi = roi.astype("float32") / 255.0
            roi = np.expand_dims(roi, axis=0)

            # Dự đoán lớp của đối tượng
            # Thực hiện dự đoán bằng mô hình SavedModel
            prediction = infer(tf.convert_to_tensor(roi))
            class_id = np.argmax(prediction["output_0"])
            label_en, label_vi = labels.get(class_id, ("Unknown", "Không xác định"))

            # Vẽ khung và nhãn lên ảnh
            cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(image, f"{label_en} - {label_vi}", (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # Hiển thị ảnh kết quả
    cv2.imshow("Detected Fruits", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

detect_and_classify("detection_test.jpg")
