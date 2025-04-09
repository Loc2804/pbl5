import os
from gtts import gTTS
from pydub import AudioSegment

# Danh sách từ vựng
words = ["Apple", "Banana", "Beetroot", "Bell_Pepper", "Cabbage", "Capsicum", "Carrot",
    "Cauliflower", "Chilli_Pepper", "Corn", "Cucumber", "Durian", "Eggplant",
    "Garlic", "Ginger", "Grapes", "Jalapeno", "Kiwi", "Lemon", "Lettuce", "Mango",
    "Onion", "Orange", "Paprika", "Pear", "Peas", "Pineapple", "Pomegranate",
    "Potato", "Radish", "Soy_Beans", "Spinach", "Sweetcorn", "Sweetpotato",
    "Tomato", "Turnip", "Watermelon"]

# Thư mục lưu file audio
output_dir = "Audio"
os.makedirs(output_dir, exist_ok=True)

for word in words:
    # Bước 1: Tạo file MP3 bằng gTTS
    mp3_path = os.path.join(output_dir, f"{word}.mp3")
    tts = gTTS(word, lang='en', tld='com')
    tts.save(mp3_path)
    print(f"Đã lưu MP3: {mp3_path}")

