# 🏠 PGLink 

### Distance-Based & Location-Verified PG Accommodation Discovery System

---

## 📌 Overview

**PGLink** is a full-stack web application designed to help students easily find nearby PG (Paying Guest) accommodations based on their college location. The platform focuses on **distance-based search, verified listings, and accessibility**, especially for users in low-network areas.

---

## 🎯 Problem Statement

Students relocating to new cities often face challenges in finding suitable and affordable accommodation near their colleges. Existing platforms:

* Do not prioritize distance effectively
* Provide unverified or unreliable listings
* Are not accessible in low-connectivity areas

---

## 💡 Solution

PGLink solves these problems by:

* Allowing users to search PGs using **college name**
* Displaying results sorted by **distance (nearest first)**
* Verifying PG locations using **GPS-based validation**
* Enabling PG owners to list properties via **SMS in low-network regions**

---

## 🚀 Key Features

### 📍 Distance-Based Search

* Enter college name
* Get nearest PGs first

### ✅ Location Verification

* Ensures accurate and trusted listings
* Matches entered location with real coordinates

### 📱 SMS-Based Listing

* PG owners can list properties via SMS
* Useful for rural or low-connectivity areas

### 🔍 Smart Filtering

* Search and filter PGs easily
* User-friendly interface

### 👤 User Dashboard

* Manage personal listings
* Update and delete PG details

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* CSS

### Backend

* Node.js
* Express.js

### Database

* MySQL 

### Additional Technologies

* GPS Location Services
* Distance Calculation Algorithms
* SMS Gateway Integration

---

## ⚙️ System Architecture

User → Frontend (React) → Backend (Express API) → Database
↓
JSON Response → UI Update

---

## 🔄 Working Flow

1. User enters a **college name**
2. System fetches PG listings
3. Distance is calculated using location services
4. Results are displayed in **ascending order of distance**

---

## 📦 Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/PGLink.git
cd PGLink
```

---

### 2️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

### 3️⃣ Setup Backend

```bash
cd server
npm install
npm start
```

---

## 🌐 Deployment

* Frontend: Vercel
* Backend: Render 

---

## 📈 Future Enhancements

* 🗺️ Google Maps Integration
* ⭐ Reviews & Ratings System
* 🤖 AI-based PG Recommendations
* 💰 Advanced Filters (amenities, ratings)

---

## 👨‍💻 Contributors

* Divyansh

---

## 📜 License

This project is developed for academic and learning purposes.

---

## 🧠 Unique Contribution

PGLink uniquely combines:

* Distance-prioritized PG search
* SMS-based property listing
* Real-time location verification

This ensures a **reliable, accessible, and student-friendly accommodation discovery platform**.

---
