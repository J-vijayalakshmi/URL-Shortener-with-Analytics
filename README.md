# 🔗 URL Shortener with Analytics

A full-stack URL shortener application with real-time analytics tracking. Built with Node.js, Express, and MongoDB.

## ✨ Features

- ✅ Shorten long URLs to compact links
- 📊 Track click analytics (IP, timestamp, user agent, referer)
- 🎨 Beautiful, modern UI
- 🚀 Fast and efficient
- 💾 MongoDB database storage

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: HTML, CSS, JavaScript
- **Libraries**: Mongoose, ShortID, Valid-URL

## 📋 Prerequisites

Before running this project, make sure you have:

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud): [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

## 🚀 Installation & Setup

### Step 1: Install Dependencies

Open terminal in the project folder and run:

```bash
npm install
```

### Step 2: Configure Environment Variables

The `.env` file is already created with default values:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/url-shortener
BASE_URL=http://localhost:3000
```

**If using MongoDB Atlas (cloud database):**
- Replace `MONGODB_URI` with your connection string from MongoDB Atlas
- Example format: `MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/url-shortener`
- Get your connection string from: MongoDB Atlas → Clusters → Connect → Connect your application

### Step 3: Start MongoDB (if using local)

**Windows:**
```bash
# If MongoDB is installed as a service, it should start automatically
# Otherwise, run:
mongod
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### Step 4: Run the Application

```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

### Step 5: Open in Browser

Navigate to: **http://localhost:3000**

## 📖 How to Use

### 1. Shorten a URL
- Enter a long URL in the input field
- Click "Shorten URL"
- Copy your shortened URL

### 2. View Analytics
- After shortening a URL, click "View Analytics"
- See total clicks, creation date, and detailed click information

### 3. Use the Short URL
- Share the shortened URL
- When someone clicks it, they're redirected to the original URL
- Analytics are tracked automatically

## 🔌 API Endpoints

### Create Short URL
```http
POST /api/shorten
Content-Type: application/json

{
  "originalUrl": "https://example.com/very-long-url"
}
```

**Response:**
```json
{
  "originalUrl": "https://example.com/very-long-url",
  "shortUrl": "http://localhost:3000/aBc123",
  "shortCode": "aBc123"
}
```

### Get Analytics
```http
GET /api/analytics/:shortCode
```

**Response:**
```json
{
  "originalUrl": "https://example.com",
  "shortCode": "aBc123",
  "clicks": 5,
  "createdAt": "2026-02-21T10:00:00.000Z",
  "clickDetails": [
    {
      "timestamp": "2026-02-21T10:05:00.000Z",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "referer": "Direct"
    }
  ]
}
```

### Redirect to Original URL
```http
GET /:shortCode
```

Redirects to the original URL and tracks analytics.

## 📁 Project Structure

```
url-shortener/
├── models/
│   └── Url.js              # MongoDB schema for URLs
├── routes/
│   └── url.js              # API routes
├── public/
│   └── index.html          # Frontend UI
├── server.js               # Main server file
├── package.json            # Dependencies
├── .env                    # Environment variables
└── README.md              # Documentation
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check if the connection string in `.env` is correct
- For MongoDB Atlas, whitelist your IP address

### Port Already in Use
- Change the `PORT` in `.env` file
- Or stop the process using port 3000

### Dependencies Not Installing
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

## 🎯 Future Enhancements

- [ ] Custom short codes
- [ ] QR code generation
- [ ] User authentication
- [ ] Link expiration
- [ ] Detailed analytics graphs
- [ ] Export analytics data

## 📝 Notes

- Short codes are generated using the `shortid` library
- Analytics data includes IP, user agent, and referrer information
- URLs are validated before shortening
- Duplicate URLs return the existing short code

## 🤝 Contributing

Feel free to fork this project and submit pull requests!

## 📄 License

ISC License - feel free to use this project for learning and personal projects.
