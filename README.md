📈 TradeApp – Mini Financial Trading App
https://trading-app-pam4.vercel.app/

A full-stack mini trading app built with MERN stack (MongoDB, Express.js, React, Node.js).
Implements authentication, KYC verification, product listings, portfolio management, transactions, and a personal watchlist.

✨ Features

🔐 Authentication & KYC

Signup & Login with JWT-based authentication

KYC form: name, email, PAN number & dummy ID upload

📊 Products

View list of seeded investment products (stocks, mutual funds)

Product detail page with description, metrics, and live price chart

💰 Transactions & Portfolio

Virtual wallet (₹100,000 seeded)

Buy/Sell products with real-time price updates (via Socket.io)

Portfolio dashboard:

Wallet Balance

Total Invested

Current Value

Returns (PnL)

Holdings Table with live prices

⭐ Watchlist

Add/Remove products from a personal watchlist

Quick access to favorite stocks

🛠️ Tech Stack

Frontend: React, TailwindCSS, Chart.js, Recharts, Socket.io-client

Backend: Node.js, Express.js, MongoDB (Mongoose), JWT Authentication

Database: MongoDB Atlas

Real-time: Socket.io for live price updates

📦 Installation & Setup
1️⃣ Clone Repo
git clone https://github.com/your-username/tradeapp.git
cd tradeapp

2️⃣ Backend Setup
cd backend
npm install


Create a .env file in backend/:

PORT=5000
JWT_SECRET=supersecretjwt
MONGO_URI=your-mongodb-uri


Run server:

npm start

3️⃣ Frontend Setup
cd frontend
npm install


Run React app:

npm start

🚀 Usage

Sign up with KYC details (PAN & dummy ID file).

Browse available investment products.

Buy a product → wallet balance decreases, portfolio updates.

Check Portfolio Dashboard → live values & returns.

Add/remove products in your Watchlist.

Sell holdings → wallet balance increases.

📷 Screenshots

Signup with KYC

Product Listing

Product Details + Live Price Chart

Portfolio Dashboard

Watchlist

🎥 Demo Video

👉 https://drive.google.com/file/d/1JvGd2PU0dlWbKXeu1ybLRm-qjflZP4nc/view?usp=sharing

✨ Bonus Features (Optional)

Redis caching for products

Role-based login (Admin vs User)

Deployment (Frontend: Netlify/Vercel, Backend: Render/Railway)

👨‍💻 Author

Developed by Sourav
