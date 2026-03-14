# ඉතාමත් සැහැල්ලු Node.js 20 Alpine image එක පාවිච්චි කිරීම
FROM node:20-alpine

# App එක තියෙන folder එක සෙට් කිරීම
WORKDIR /app

# Dependency files කොපි කිරීම
COPY package*.json ./

# Dependencies install කිරීම (සැහැල්ලු නිසා ඉක්මන් වේ)
RUN npm install --production

# ඉතිරි code එක කොපි කිරීම
COPY . .

# Gateway එක run වන පෝට් එක (අපි 8080 පාවිච්චි කරමු)
EXPOSE 8080

# App එක ආරම්භ කිරීම
CMD ["node", "index.js"]