from PIL import Image, ImageDraw, ImageFont
import os

BASE = "/Users/pange/Codes/genfee/worker-bee-atomic-service/entry/src/main/resources/base/media"

# 1) zzrz.png —— “正在热招”标签：白底圆角矩形 + 深红文字，保证白底对比度 >3:1
w1, h1 = 177, 24
img1 = Image.new("RGBA", (w1, h1), (255, 255, 255, 0))
d1 = ImageDraw.Draw(img1)
d1.rounded_rectangle([0, 0, w1 - 1, h1 - 1], radius=12, fill=(255, 255, 255, 255))

try:
    font1 = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 14)
except Exception:
    font1 = ImageFont.load_default()
bbox = d1.textbbox((0, 0), "正在热招", font=font1)
tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
x = (w1 - tw) / 2
y = (h1 - th) / 2 - 1
d1.text((x, y), "正在热招", font=font1, fill=(181, 32, 32, 255))
img1.save(os.path.join(BASE, "zzrz.png"), "PNG")

# 2) address.png —— 地址定位图标：深灰色，在白色卡片上对比度充足
w2, h2 = 16, 16
img2 = Image.new("RGBA", (w2, h2), (255, 255, 255, 0))
d2 = ImageDraw.Draw(img2)
# 画一个定位针形状
pin_color = (89, 89, 89, 255)  # #595959
# 圆头
d2.ellipse([(5, 2), (11, 8)], fill=pin_color)
# 尖端
d2.polygon([(8, 8), (4, 14), (12, 14)], fill=pin_color)
# 内部白点
d2.ellipse([(7, 4), (9, 6)], fill=(255, 255, 255, 255))
img2.save(os.path.join(BASE, "address.png"), "PNG")

print("icons updated")
