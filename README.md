# Library Management System (MERN)

This project is a MERN stack library management system inspired by the YouTube tutorial: `Create Full Stack Library Management System Using Node, Express, React, MongoDB`.

## Features

- Add, edit, and delete books
- Add, edit, and delete members
- Checkout and return books with member tracking
- Issue history log for checkouts and returns
- Book status updates automatically
- REST API with Node, Express and MongoDB
- React frontend with Vite and Axios

## Setup

1. Open the project folder in VS Code.
2. Install dependencies from the root:

```bash
npm install
```

3. Create a `backend/.env` file, or use the default MongoDB URI:

```env
MONGO_URI=mongodb://127.0.0.1:27017/library-management
PORT=5000
```

4. Run the app from the root:

```bash
npm start
```

5. Open the frontend in the browser:

- React app: `http://localhost:3000`
- Backend API: `http://localhost:5000/api/books`

## Notes

- If you don't have MongoDB installed locally, install it first or update `MONGO_URI` to point to your MongoDB Atlas cluster.
- Backend runs on port `5000` and frontend runs on port `3000`.

## Project structure

- `backend/` — Express API and Mongoose models
- `frontend/` — React/Vite user interface
