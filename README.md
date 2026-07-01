# FWD Marketplace

An educational marketplace designed to connect FWD (Forward) graduates with companies that post professional opportunities and projects.

## 📂 Project Structure

This repository is organized as a workspace containing both the frontend and backend applications:

```text
Backend/   # RESTful API built with Node.js, Express, Sequelize, and PostgreSQL
Frontend/  # SPA frontend built with React, Vite, and Tailwind CSS
```

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19, Vite
- **Routing**: React Router
- **Styling**: Tailwind CSS v4
- **Data Fetching**: Axios
- **Icons**: lucide-react

### Backend
- **Core**: Node.js, Express
- **Database ORM**: Sequelize, PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) with secure HTTP-only cookies
- **File Uploads**: Multer, AWS S3
- **Documentation**: Swagger UI

## 🚀 Installation

You need to install the dependencies for both the frontend and backend. You can either do this separately or from the root folder.

**From the root directory:**
```bash
npm run install-all
```

**Or separately:**
```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

## ⚙️ Environment Variables

### Backend
The backend requires environment variables to configure the database connection, JWT secrets, CORS, and AWS credentials. 
Create a `.env` file in the `Backend/` directory (you can use `.env.example` as a template) and provide the values for your local environment.

### Frontend
The frontend uses Vite's proxy feature to forward requests from `/api` to `http://localhost:3000`. You generally do not need a `.env` file for local development unless adding specific frontend-only secrets.

## 🏃‍♂️ Running the Application

From the root directory, you can run both projects concurrently:

```bash
npm run dev    # Runs both the backend and frontend development servers concurrently
npm start      # Starts the backend in production mode and frontend in development
```

### Individual Scripts

**Backend (from `/Backend`):**
```bash
npm run dev    # Starts the development server with nodemon
npm start      # Starts the server using node
```

**Frontend (from `/Frontend`):**
```bash
npm run dev    # Starts the Vite development server
npm run build  # Builds the application for production
npm run lint   # Runs ESLint to check for code issues
```

## ✅ Verification

To verify that the code compiles and passes checks:

```bash
# Verify backend configuration
cd Backend
node --check app.js

# Verify frontend code
cd ../Frontend
npm run lint
npm run build
```

## 📚 Additional Documentation

You can find supplementary documentation in the `Backend/Notes` and `Frontend/notes` directories. These folders contain information about the architecture, user flows, branding, and integrations. 

> **Note**: Please keep these documentation files synchronized with the codebase whenever you update endpoints, add new features, or change UI screens.
