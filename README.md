# 🍕 Pizza Radar MVP

A lightweight, secure, and production-ready Minimum Viable Product (MVP) designed to find the closest pizza joints in real-time. Built with a decoupled architecture featuring a vanilla HTML/JS frontend dashboard and a secure Node.js backend proxy that routes data safely through the Google Places API via JSON.

---

## 🚀 Live Demo & Deployment
* **Frontend:** Hosted locally / deployable to any static host.
* **Backend Web Service:** Prepped for [Render](https://render.com).

---

## 🏗️ Architecture & How It Works

To protect API budgets and prevent client-side security leaks, this application utilizes a backend proxy architecture.


```

[ Frontend Dashboard ]          [ Backend Proxy ]         [ Google Maps API ]
(Browser UI / HTML)  <----->   (Node.js Server)  <----->    (Places JSON)

```

1. **User Request:** The frontend requests precise device coordinates using the browser's `navigator.geolocation` API.
2. **Secure Handshake:** Coordinates are passed to the Node.js backend proxy.
3. **API Interaction:** The backend server securely injects the `GOOGLE_API_KEY` environment variable and fetches a 2km radius circle of pizza restaurants from Google Places.
4. **Data Hydration:** The server returns a sanitized JSON array to the client UI, which dynamically renders responsive, XSS-protected pizza location cards.

---

## ✨ Features (MoSCoW Alignment)

### Must Haves (Core MVP)
* 📍 **Automated Location Detection:** Real-time user coordinate retrieval via browser Geolocation.
* 🛡️ **Secure Backend Proxy:** Hidden API key integration to prevent reverse-engineering bills.
* ⏱️ **Rate Limiting:** IP-throttling to prevent intentional or accidental spamming of the Google API.
* 🚨 **Robust Error Handling:** Explicit fallback states for user location rejections, Google timeouts, or empty JSON payloads.

---

## 🛠️ Tech Stack

* **Frontend:** Vanilla HTML5, CSS3 (Flexbox/Variables), Native JavaScript (ES6 Fetch).
* **Backend:** Node.js, Express.js, Axios (HTTP Client).
* **Security & Middleware:** `cors`, `dotenv`, `express-rate-limit`.

---

## ⚙️ Local Setup Instructions

### 1. Clone & Install Backend Dependencies
```bash
git clone [https://github.com/YOUR_USERNAME/pizza-radar.git](https://github.com/YOUR_USERNAME/pizza-radar.git)
cd pizza-radar
npm install

```

### 2. Configure Environment Variables

Create a `.env` file in the root directory of your backend project:

```env
PORT=3000
GOOGLE_API_KEY=your_actual_google_places_api_key_here

```

> ⚠️ **Note:** The `.env` file is explicitly included in the `.gitignore` to protect production credentials.

### 3. Run the Server

```bash
node server.js

```

The terminal will display: `🚀 Pizza Radar Proxy Web Service online on port 3000`

### 4. Launch the Dashboard

Simply double-click or serve the `index.html` file in your browser, allow location access, and click **"Find Pizza Near Me"**.

---

## 🌐 Render Deployment Notes

When deploying the backend as a **Web Service** on Render:

1. Connect your GitHub repository to Render.
2. Under the service **Environment** settings, add the key-value pair:
* Key: `GOOGLE_API_KEY`
* Value: `[Your Secret Google API Key]`


3. Render will automatically catch updates pushed to your `main` branch and redeploy using the designated `/health` check route for uptime verification.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

```

```
