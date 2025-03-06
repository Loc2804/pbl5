import numpy as np
import scipy.stats as stats
import matplotlib.pyplot as plt
import seaborn as sns

# 1. Tạo dữ liệu mẫu giả định (tuổi thọ bóng đèn)
np.random.seed(42)  # Để kết quả ổn định
n = 30  # Số lượng mẫu
mu_real = 980  # Giả sử tuổi thọ trung bình thực tế là 980 giờ
sigma = 50  # Độ lệch chuẩn giả định

# Tạo ngẫu nhiên 30 giá trị tuổi thọ bóng đèn theo phân phối chuẩn
sample_data = np.random.normal(loc=mu_real, scale=sigma, size=n)

# 2. Hiển thị dữ liệu mẫu
print("Dữ liệu tuổi thọ bóng đèn thu thập được:")
print(sample_data)

# 3. Tính toán thông số thống kê của mẫu
sample_mean = np.mean(sample_data)  # Trung bình mẫu
sample_std = np.std(sample_data, ddof=1)  # Độ lệch chuẩn mẫu (ddof=1 để dùng ước lượng không chệch)

print(f"\nTrung bình mẫu: {sample_mean:.2f} giờ")
print(f"Độ lệch chuẩn mẫu: {sample_std:.2f} giờ")
print(f"Kích thước mẫu: {n}")

# 4. Thông số kiểm định
mu_0 = 1000  # Giá trị trung bình giả thuyết
alpha = 0.05  # Mức ý nghĩa 5%

# 5. Thực hiện kiểm định t-test
t_stat, p_value = stats.ttest_1samp(sample_data, mu_0)

print(f"\nGiá trị t-statistic: {t_stat:.4f}")
print(f"Giá trị p-value: {p_value:.4f}")

# 6. So sánh với mức ý nghĩa alpha để đưa ra kết luận
if p_value < alpha:
    print("\nKết luận: Bác bỏ giả thuyết H0. Tuổi thọ bóng đèn khác 1000 giờ.")
else:
    print("\nKết luận: Không đủ bằng chứng để bác bỏ H0. Tuổi thọ bóng đèn có thể vẫn là 1000 giờ.")

# 7. Vẽ biểu đồ phân phối mẫu
plt.figure(figsize=(8, 5))
sns.histplot(sample_data, kde=True, color="blue", bins=10)
plt.axvline(mu_0, color='red', linestyle='dashed', linewidth=2, label="Giá trị giả thuyết (1000 giờ)")
plt.axvline(sample_mean, color='green', linestyle='dashed', linewidth=2, label=f"Trung bình mẫu ({sample_mean:.2f} giờ)")
plt.title("Biểu đồ phân bố tuổi thọ bóng đèn")
plt.xlabel("Tuổi thọ (giờ)")
plt.ylabel("Tần suất")
plt.legend()
plt.show()
