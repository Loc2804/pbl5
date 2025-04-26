import librosa
import numpy as np
import speech_recognition as sr
from difflib import SequenceMatcher


def extract_mfcc(file_path):
    """Trích xuất MFCC từ file âm thanh"""
    try:
        y, sr = librosa.load(file_path, sr=16000)
        if len(y) == 0:
            raise ValueError("File âm thanh không có dữ liệu hoặc bị lỗi.")
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        return mfcc
    except Exception as e:
        print(f"Lỗi khi xử lý {file_path}: {e}")
        return None


def transcribe_audio(file_path):
    """Chuyển file âm thanh thành văn bản"""
    recognizer = sr.Recognizer()
    with sr.AudioFile(file_path) as source:
        audio = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio)
            return text
        except sr.UnknownValueError:
            return "Không nhận diện được giọng nói"
        except sr.RequestError:
            return "Lỗi kết nối đến API nhận diện giọng nói"


def compare_words(reference, user_speech):
    """So sánh từ chuẩn với từ người dùng phát âm"""
    ref_words = reference.lower().split()
    user_words = user_speech.lower().split()

    word_mapping = SequenceMatcher(None, ref_words, user_words).get_opcodes()
    errors = []

    for tag, i1, i2, j1, j2 in word_mapping:
        if tag != "equal":
            errors.append(ref_words[i1:i2])  # Lấy từ phát âm sai

    return errors


# Tệp âm thanh chuẩn và của người dùng
# target_audio = "./testsound.wav"  # File chứa phát âm đúng
user_audio = "file gửi về từ người dùng.wav"  # File của người dùng

# # Trích xuất MFCC
# mfcc_target = extract_mfcc(target_audio)
# mfcc_input = extract_mfcc(user_audio)

# Chuyển đổi âm thanh thành văn bản
text_target = "i will hear some talks given by a single speaker"  # Văn bản chuẩn
text_input = transcribe_audio(user_audio)  # Văn bản người dùng nói

# So sánh từ vựng
if text_input != "Không nhận diện được giọng nói":
    print(f"Người dùng đã nói: {text_input}")
    errors = compare_words(text_target, text_input)
    if errors:
        print(f"Phát âm không tốt ở các từ: {', '.join(sum(errors, []))}")
    else:
        print("Phát âm tốt toàn bộ câu!")
