## Installation & Setup

1. **Clone & Navigate**
  git clone [https://github.com/edkariuki/task-management-technical-assessment]
cd task-management-technical-assessment

2. **Backend Setup**
   - cd backend
   - copy .env below
   ```
   PORT=4000
   DATABASE_URL=postgresql://postgres@localhost:5432/taskmanager
   JWT_SECRET=super_secret_jwt_key

   ```
   JWT_SECRET is as is just for testing.
   - npm install
   - npm run dev

3. **Frontend Setup**
   - cd ../frontend
   - copy .env below
   ```
   VITE_API_BASE_URL=http://localhost:4000/api

   ```
   - npm install
   - npm run dev

4. **Navigate to App**
   - Visit http://localhost:5173 in your browser.

5. **Testing Credentials (Optional)**
   - Email: ed@yahooo.com
   - Password: P@ssw0rd

## Shortcomings
- Pagination
- Form validation (email)

