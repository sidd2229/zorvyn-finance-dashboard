# 💰 Zorvyn Finance Dashboard

A modern and interactive **Finance Dashboard UI** built using React and Vite.
This project helps users track financial activities, analyze spending patterns, and manage transactions efficiently.

---

## 🚀 Live Demo

👉 https://zorvyn-finance-dashboard-ews1-five.vercel.app/

---

## 📌 Features

### 📊 Dashboard Overview

* Total Balance, Income, and Expenses summary
* Clean financial overview cards
* Time-based and category-based visualizations

### 💳 Transactions

* View all transactions with:

  * Date
  * Amount
  * Category
  * Type (Income/Expense)
* Search, filter, and sort functionality
* Add, edit, and delete transactions (Admin role)

### 🔐 Role-Based UI

* **Admin**:

  * Add/Edit/Delete transactions
* **Viewer**:

  * Read-only access

### 📈 Insights

* Highest spending category
* Monthly comparison
* Useful financial observations

### ⚙️ State Management

* Managed using React Context API
* Handles:

  * Transactions
  * Filters
  * Role switching

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite)
* **Styling**: CSS
* **State Management**: Context API
* **Data**: Mock Data (local)

---

## 📁 Project Structure

```
zorvyn-finance-dashboard/
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## ▶️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sidd2229/zorvyn-finance-dashboard.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the project

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

---

## 🎨 UI/UX Highlights

* Clean and modern dark-themed interface
* Responsive design for different screen sizes
* Smooth navigation and intuitive layout
* Color indicators for income (green) and expenses (red)

---

## ⚠️ Edge Case Handling

* Handles empty transaction states gracefully
* Input validation for adding/editing transactions
* Real-time UI updates after operations

---

## 🚀 Future Enhancements

* Local storage persistence
* Dark mode toggle
* Backend/API integration
* Advanced analytics and filtering

---

## 👨‍💻 Author

Siddharth Rai
