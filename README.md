# 📊 FinBoard – Financial Dashboard

![finboard-cover](/client/docs/image2.png)

FinBoard is a customizable financial dashboard built with a **Next js** stack. It supports **real-time widgets** (charts, tables, and stats) powered by APIs like **Coinbase, Finnhub, and Alpha Vantage**.


---

## 🚀 How to run this project

### 🔹 For Frontend (React + Vite)

1.  Clone or unzip the project folder.
2.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
3.  Create a `.env.local` file in the `frontend` root directory (same level as `package.json`) and add your API keys:
    ```env
    VITE_ALPHA_VANTAGE_KEY="your_alpha_vantage_api_key"
    VITE_FINNHUB_KEY="your_finnhub_api_key"
    VITE_COINBASE_KEY="optional_if_needed"
    ```
    🔑 Get free API keys from [Alpha Vantage](https://www.alphavantage.co/support/#api-key), [Finnhub](https://finnhub.io/register), and [Coinbase](https://www.coinbase.com/cloud).

4.  Install dependencies:
    ```bash
    npm install
    ```
5.  Run the frontend:
    ```bash
    npm run dev
    ```

### 🔹 For Backend (Node + Express + PostgreSQL)

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Create a `.env` file in the `backend` root directory (same level as `package.json`) and add your JWT secret and database connection string:
  BASE_URL="postgresql://user:password@host:dummy/mydb"
    
    > ⚡ **Important:** Make sure you have PostgreSQL installed and running. You must replace `user`, `password`, `host`, and `mydb` with your actual database credentials.

3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Run the backend server:
    ```bash
    npm run start:dev
    ```

---

## 📌 Features

✅ Add, edit, and remove widgets (chart, table, Bitcoin/Ethereum rates, etc.)  
✅ Fetch real-time data from multiple financial APIs  
✅ Interactive line charts using Recharts  
✅ Search + pagination support in tables  
✅ Redux-powered state management  
✅ Auto-refresh data at custom intervals  
✅ Persistent data storage with PostgreSQL

---

## 🛠 Tech Stack

-   **Frontend:** React (Vite), Redux Toolkit, TailwindCSS, Recharts
-   **Backend:** Node.js, Express.js, PostgreSQL
-   **APIs Integrated:** Coinbase, Finnhub, Alpha Vantage

---

## 📷 Screenshots

**Dashboard Preview**

![Dashboard Screenshot 1](/client/docs/image1.png)
![Dashboard Screenshot 2](/client/docs/image.png)
![Dashboard Screenshot 3](/client/docs/image3.png)
![Dashboard Screenshot 4](/client/docs/image4.png)
![Dashboard Screenshot 5](/client/docs/image5.png)

---

## ⚡ Notes

-   Make sure to configure your API keys properly in `.env.local` for the frontend to work.
-   The default refresh interval is 30 seconds, which can be customized per widget.
-   This project works best with Node.js v18+.


