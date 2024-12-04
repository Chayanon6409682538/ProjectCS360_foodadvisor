# เลือก base image
FROM node:16

# ตั้ง working directory
WORKDIR /app

# คัดลอกไฟล์ package.json และ yarn.lock
COPY package.json yarn.lock ./

# ติดตั้ง dependencies
RUN yarn install

# คัดลอกไฟล์ทั้งหมด
COPY . .

# เปิดพอร์ตที่ Strapi ใช้งาน
EXPOSE 1337

# คำสั่งเริ่มต้นเมื่อ container ทำงาน
CMD ["yarn", "develop"]
