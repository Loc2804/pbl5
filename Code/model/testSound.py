import os
import time
import pygame
import uuid
from gtts import gTTS

# Khởi tạo pygame để phát âm thanh
pygame.mixer.init()

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

# Ví dụ sử dụng:
speak("Quả táo - Apple")
