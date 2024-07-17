# AlgoSprint

## Tech Stack
- React
- Vite
- TailwindCSS
- Node.js
- MongoDB
- Docker
- AWS

## Frontend
- Navigate to the frontend directory: `cd frontend`
- Install dependencies: `npm install`
- Run development server: `npm run dev`

## Backend
- Navigate to the backend directory: `cd backend`
- Install dependencies: `npm install`
- Run the server: `npm start`

## Compiler
- Navigate to the compiler directory: `cd compiler`
- Install dependencies: `npm install`
- Run the compiler using nodemon: `nodemon app.js`

### Endpoints
- **POST** `/run`: Runs code on our self-built compiler.
- **POST** `/:problemId/submit`: Evaluates a problem and gives a verdict.
- **POST** `/register/:referralId`: Registers a user.
- **POST** `/login`: Logs in a user.
- **GET** `/user/submissions`: Retrieves user submissions.
- **GET** `/problem/:problemId/submissions`: Retrieves submissions for a specific problem.
- **GET** `/user/statistics`: Retrieves user statistics such as streak and problems solved.
- **POST** `/addproblem`: Adds a new problem.
- **PUT** `/problem/:problemId/update`: Updates an existing problem.

## Video Demonstration
https://github.com/user-attachments/assets/07de766f-68ec-4ddc-b504-58fbc62bcb92
