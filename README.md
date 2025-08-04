# Easy Saving

Easy Saving is a full-stack financial tracker I developed to deepen my expertise in building secure REST APIs, implementing JWT authentication flows, and creating responsive UIs with React. The system enables users to monitor spending patterns through an intuitive interface.

## Project Structure 

```
easy-saving/
├── client/
│   ├── src/     
│       ├── assets/                     # Static assets (images, fonts)
│       ├── components/                 # Reusable UI components
│       ├── pages/                      # Page components
│       ├── services/                   # API service handlers
│       ├── api.js                      # Axios instance configuration
│       ├── App.jsx                     # Root component
│       ├── index.css                   # Global styles
│       ├── main.jsx                    # Application entry point 
│   ├── index.html                      # Main HTML template
│   ├── package-lock.json               # Dependency lockfile
│   ├── package.json                    # frontend dependencies 
│   ├── postcss.config.js               # PostCSS configuration
│   ├── tailwind.config.js              # Tailwind CSS configuration
│   ├── vite.config.js                  # Vite build configuration
├── server/
│   ├── config/                         # Configuration files               
│   ├── controllers/                    # Business logic      
|   ├── middlewares/                    # Express middleware
|   ├── models/                         # Database models
|   ├── routes/                         # API route definitions
|   ├── utils/                          # Utility functions       
│   ├── app.js                          # Express application           
│   ├── package-lock.js                 # Dependency lockfile          
│   ├── package.js                      # Backend dependencies         
```

## Features

- **User Authentication:** JWT-based authentication with HTTP-only cookies for secure session management
- **Expense Tracking:** Add, categorize, and analyze expenses
- **Dashboard**: Visualize financial data with interactive charts (Chart.js)
- **UI/UX:** Responsive Tailwind CSS components
- **API Services:** Well-structured backend API with Express

## Technologies Used

**Frontend:** React · JavaScript · Tailwind CSS  

**Backend:** Node.js · Express · Sequelize 

**Database:** PostgreSQL  

## How to run 

1. Clone the repository: git clone [https://github.com/broeringlucas/easy-saving.git](https://github.com/broeringlucas/easy-saving)
2. Navigate to the client directory: cd client
3. Install frontend dependencies: npm install
4. Start frontend:  npm run dev
5. Navigate to the server directory: cd server
6. Create a .env file in server's directory
    <details>
    <summary>.env example</summary>
    
    ```
    DB_HOST=
    DB_USER=
    DB_PASS=
    DB_NAME=
    DB_PORT=
    PORT=
    JWT_EXPIRATION =
    JWT_SECRET =
    ```
    </details>  
7. Install backend dependencies: npm install
8. Start backend:  npm run dev

## Deployment

The application is deployed and accessible at: [https://easy-saving.lucasbroering.dev](https://easy-saving.lucasbroering.dev)

## Screenshots 
<details>
<summary>Screenshot 1</summary>
![s1](https://github.com/user-attachments/assets/a66def33-cf22-4d58-a1b4-318e5f325acb)
</details>

<details>
<summary>Screenshot 2</summary>
![s2](https://github.com/user-attachments/assets/7f25870a-56a2-4c00-9a21-f8159d5d5407)
</details>

<details>
<summary>Screenshot 3</summary>
![s3](https://github.com/user-attachments/assets/fdb12767-2064-412f-9baa-74d48577f732)
</details>

<details>
<summary>Screenshot 4</summary>
![s4](https://github.com/user-attachments/assets/b26886ce-f5f1-43ee-8e1f-8e56e828757e)
</details>
