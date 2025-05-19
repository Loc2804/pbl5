from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import requests
import os
import time
from PIL import Image
import io

flower_names = [
    'hoa hồng', 'hoa tulip', 'hoa hướng dương', 'hoa cúc', 'hoa lan', 'hoa oải hương', 'hoa mẫu đơn', 'hoa loa kèn', 'hoa dâm bụt', 'hoa sen',
    'hoa anh đào', 'hoa thủy tiên', 'hoa vạn thọ', 'hoa nhài', 'hoa anh túc', 'hoa cẩm chướng', 'hoa bìm bìm', 'hoa diên vĩ', 'hoa violet', 'hoa huệ tây',
    'hoa trà', 'hoa xuân', 'hoa cúc zinnia', 'hoa thu hải đường', 'hoa lan dạ hương', 'hoa thược dược', 'hoa cẩm tú cầu', 'hoa dành dành', 'hoa dạ yên thảo', 'hoa mõm sói',
    'hoa chuông xanh', 'hoa sao nháy', 'hoa pansy', 'hoa phong lữ', 'hoa mộc lan', 'hoa calla lily', 'hoa lay ơn', 'hoa anh thảo', 'hoa đậu thơm', 'hoa đỗ quyên',
    'hoa mao địa hoàng', 'hoa tử đằng', 'hoa thạch thảo', 'hoa đồng tiền', 'hoa lưu ly', 'hoa thạch nam', 'hoa clematis', 'hoa mao lương', 'hoa giọt tuyết', 'hoa ngải cứu'
]


base_dir = "flowers"
if not os.path.exists(base_dir):
    os.makedirs(base_dir)

target_images = 100
min_width = 200
min_height = 200

# Thiết lập Selenium (mở trình duyệt để dễ debug)
options = webdriver.ChromeOptions()
# options.add_argument("--headless")  # Tạm thời tắt headless để kiểm tra
options.add_argument("--disable-gpu")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def check_image_size(image_data):
    try:
        with Image.open(io.BytesIO(image_data)) as img:
            width, height = img.size
            return width >= min_width and height >= min_height
    except Exception as e:
        print(f"Lỗi khi kiểm tra kích thước: {e}")
        return False

try:
    for appliance in flower_names:
        query = appliance.replace(" ", "+")
        url = f"https://www.google.com/search?tbm=isch&q={query}"

        save_dir = os.path.join(base_dir, appliance.replace(" ", "_"))
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)

        downloaded_images = 0
        print(f"Bắt đầu crawl hình ảnh cho: {appliance}")
        driver.get(url)

        # Cuộn trang để load thêm ảnh
        for _ in range(5):  # cuộn 5 lần
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)

        soup = BeautifulSoup(driver.page_source, "html.parser")
        img_tags = soup.find_all("img")
        print(f"Tìm thấy {len(img_tags)} ảnh")

        for i, img in enumerate(img_tags):
            if downloaded_images >= target_images:
                break

            img_url = img.get("src")
            if not img_url:
                img_url = img.get("data-src")
            if img_url and ("http" in img_url):
                try:
                    headers = {"User-Agent": "Mozilla/5.0"}
                    response = requests.get(img_url, headers=headers, timeout=10)
                    response.raise_for_status()
                    img_data = response.content

                    if check_image_size(img_data):
                        img_name = f"{appliance.replace(' ', '_')}_{downloaded_images}.jpg"
                        img_path = os.path.join(save_dir, img_name)
                        with open(img_path, "wb") as f:
                            f.write(img_data)
                        print(f"Đã lưu: {img_name}")
                        downloaded_images += 1
                    else:
                        print(f"Bỏ qua ảnh vì quá nhỏ: {img_url}")

                except Exception as e:
                    print(f"Lỗi tải {img_url}: {e}")
                    continue

        print(f"Đã tải {downloaded_images} ảnh cho {appliance} vào thư mục: {save_dir}")

finally:
    driver.quit()

print("Hoàn tất crawl tất cả các loại thiết bị gia dụng!")