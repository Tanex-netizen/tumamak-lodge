# Full-Stack Project Debugging Guide: Frontend-Backend Connectivity Issues

## 🔍 Project Structure Analysis

### Backend Structure
- **Server File:** `backend/server.js` (main entry point)
- **Routes:** `backend/routes/roomRoutes.js` defines `/api/rooms` endpoint
- **Controllers:** `backend/controllers/roomController.js` handles room data logic
- **Models:** `backend/models/Room.js` for database schema
- **CORS:** Configured in `server.js` with `origin: "*"` (allows all origins)

### Frontend Structure
- **API Client:** `frontend/src/lib/axios.js` configures base URL
- **Store:** `frontend/src/store/roomStore.js` manages room data state
- **Component:** `frontend/src/pages/RoomsPage.jsx` displays rooms
- **Environment:** Uses `VITE_API_URL` for backend connection

## 🚨 Critical Issue Identified

Your backend service is **NOT RUNNING** on Render. Both curl tests return 404 with "x-render-routing: no-server" header, indicating Render cannot find an active server to route requests to.

## 🔧 Step-by-Step Debugging & Fix

### Step 1: Verify Environment Variables
Your backend needs these environment variables in Render:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Random string for auth | `your-super-secret-jwt-key-here` |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |
| `NODE_ENV` | Environment | `production` |

### Step 2: Check Render Service Configuration

**Backend Service Settings:**
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** Node.js

### Step 3: Verify Package.json Scripts

Check `backend/package.json` has:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### Step 4: Test Local Backend

```bash
cd backend
npm install
npm start
# Should see: "Server is running on port 5000"
```

### Step 5: Check MongoDB Connection

Ensure your `MONGODB_URI` is correct and accessible from Render's IP ranges.

### Step 6: Redeploy on Render

After setting environment variables, trigger a manual redeploy in Render dashboard.

### Step 7: Verify Frontend Configuration

Frontend needs this environment variable:
- `VITE_API_URL=https://tumamak-backend.onrender.com`

## 📋 Current Status

- ✅ Code structure is correct
- ✅ Routes and controllers are properly defined
- ✅ CORS is configured to allow all origins
- ❌ **Backend service not running on Render**
- ❌ Environment variables likely missing

## 🎯 Next Steps

1. Set the required environment variables in Render backend service
2. Redeploy the backend
3. Test the `/` and `/api/rooms` endpoints
4. Verify frontend can connect once backend is live

## 📊 API Endpoint Flow

```
Frontend (RoomsPage.jsx)
    ↓ fetchRooms()
    ↓ axios.get('/rooms')
    ↓ baseURL: https://tumamak-backend.onrender.com/api
    ↓ https://tumamak-backend.onrender.com/api/rooms
    ↓ backend/routes/roomRoutes.js
    ↓ backend/controllers/roomController.js getRooms()
    ↓ Room.find() from MongoDB
    ↓ Return JSON response
```

The main issue is that your backend isn't starting on Render due to missing environment variables, particularly the MongoDB connection string.
