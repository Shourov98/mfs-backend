# 📱 Mobile Financial Service (MFS) Backend

This is the backend for a Mobile Financial Service (MFS) platform inspired by apps like **bKash** and **Nagad**. It is built using **Node.js**, **Express**, and **MongoDB** with **Mongoose**, and provides APIs for secure user/agent/admin account management and financial transactions.

---

## 🚀 Features

- 🔐 **Authentication** (JWT, hashed PIN, single-session login)
- 👥 **Role-based accounts**: User, Agent, Admin
- 💸 **Send Money**, **Cash In**, **Cash Out** with fee rules
- 📈 **Transaction History** (with transaction ID)
- 🧾 **Admin Approval** for agent registration, cash/withdraw requests
- ⛔ **User Blocking/Unblocking** by admin
- 📊 **Income tracking** for Agent/Admin
- 🧪 **API Documentation** via Swagger UI

---

## 📦 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT Authentication**
- **bcrypt** (PIN encryption)
- **Swagger UI** (API docs)
- **dotenv**, **cors**, **helmet**, **morgan** (security/middleware)

---

## 🔧 Project Setup

1. **Clone the repo**

git clone https://github.com/yourname/mfs-backend.git
cd mfs-backend


2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mfs
JWT_SECRET=your_jwt_secret
```

4. **Run the server**

```bash
npm run dev
```

Server will run at: `http://localhost:5000`

---

## 📚 API Documentation

* Swagger Docs: [`/docs`](http://localhost:5000/docs)
* Explore all endpoints, test requests, view schema and responses

---

## 🛠️ Directory Structure

```
mfs-backend/
├── controllers/
├── routes/
├── models/
├── middleware/
├── utils/
├── swagger/
├── .env
├── server.js
└── README.md
```

---

## 🧪 Test Users Setup

> 🛑 **There is only 1 Admin**, created manually.

* Register Users/Agents via `/api/register`
* Agent approval & cash/withdrawal handled by Admin panel/API

---

## ✨ Contributors

* **Your Name** — [`@yourhandle`](https://github.com/yourhandle)

---

## 📄 License

MIT License. Free to use and improve.

```

---

Let me know if you want:

**a.** The same for frontend (`mfs-frontend`) setup  
**b.** Add setup instructions for Swagger file or MongoDB Atlas connection?
```
