## ⚙️ Setup Instructions

## 1️⃣  Clone the Repository
git clone https://github.com/Abhijeet231/MERN_Int.git
cd MERN_Int

## 2️⃣ Setup Backend
cd backend
npm install


Create a .env file inside the backend folder:

PORT=8000
CORS_ORIGIN=http://localhost:5173
MONGODB_URL=your_mongodb_connection_string_here
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=5d
NODE_ENV=development

## ⚠️ Note: You need to create your own MongoDB Atlas database and update the .env file with your connection URI and JWT secrets.

## 3️⃣ Setup Frontend
cd ../frontend
npm install


Create a .env file inside the frontend folder:

VITE_APP_BASE_URL=http://localhost:8000/api/v1


## 🚀 Execution Instructions

## 1️⃣ Run Backend
cd backend
npm run dev


The backend will start on
👉 http://localhost:8000

## 2️⃣ Run Frontend
cd ../frontend
npm run dev


The frontend will start on
👉 http://localhost:5173
 
## ✅ Open the App

Visit http://localhost:5173
 in your browser.

## 🎥 Demonstration Video

👉 Google Drive Demo Link:
🔗 https://drive.google.com/file/d/1UN7e2uh8SqTtPmFIO26t9sAXeyyCJr2d/view?usp=sharing





## 📧 Author

##   Abhijeet Ghosh

##   💼 GitHub: Abhijeet231 (https://github.com/Abhijeet231)

##  📩 Email: ghoshabhijeet778@gmail.com
