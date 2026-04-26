# StudentManagement
AI-Powered Student Performance Tracking System with Spring Boot, React, and MySQL. Features include alphanumeric student ID management, real-time academic analytics (Radar Charts), and automated attendance PDF report generation.

# ACE Smart Portal: AI-Powered Student Management System 🎓

An advanced Student Management System designed for Adhiyamaan College of Engineering. This platform bridges the gap between Staff and Students by providing real-time academic insights, automated attendance tracking, and performance analysis.

## 🚀 Key Features

- **Dual-Actor Portal:** Separate dashboards for Staff and Students.
- **Alphanumeric ID Support:** Handles unique university register numbers (e.g., AC22UIT001).
- **AI Performance Radar:** Interactive skill analysis using Recharts.
- **Automated Reporting:** Generates downloadable PDF attendance reports using jsPDF.
- **Career Goal Tracking:** AI-driven goal monitoring to align academic progress with career targets.
- **Secure Authentication:** Role-based access control (RBAC) for data privacy.

## 🛠️ Tech Stack

**Frontend:**
- React.js (Hooks & Router)
- Recharts (Data Visualization)
- Bootstrap 5 (Responsive UI)
- Axios (API Integration)

**Backend:**
- Spring Boot (Java 17+)
- Spring Data JPA
- MySQL (Persistence)
- REST API

---

## 📂 Project Structure

```text
├── studentApi/         # Spring Boot Application
│   ├── src/main/java/       # Models, Controllers, Services, Repos
│   └── src/main/resources/  # application.properties
└── student-frontend/        # React Application
    ├── src/components/      # UI Components (Portal, Charts, Reports)
    └── src/services/        # API Service Layer

⚙️ Setup Instructions
1. Database Configuration
Create a database named student_db in MySQL and update the application.properties:

Properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_db
spring.datasource.username=your_username
spring.datasource.password=your_password
2. Run Backend
Bash
cd student-backend
mvn spring-boot:run
3. Run Frontend
Bash
cd student-frontend
npm install
npm start
📊 Sample Visuals
Student Dashboard: View of the Performance Radar Chart and AI Insights.

Staff Portal: Management of students and attendance reporting.

👨‍💻 Developed By
Hanisika Sivakumar Final Year B.Tech IT | Adhiyamaan College of Engineering


---

### 3. Essential `.gitignore`
Before you upload, make sure you have a `.gitignore` file so you don't upload unnecessary files (like `node_modules` or your database passwords).

**In your root folder, create a file named `.gitignore`:**
```text
# Node
node_modules/
npm-debug.log

# Java/Maven
target/
.mvn/
*.class

# Env
.env
4. Commands to Upload
Open your terminal in the project folder and run:

git init

git add .

git commit -m "Initial commit: ACE Smart Portal with AI Analytics"

git branch -M main

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

git push -u origin main
