import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import ListStudentComponent from './components/ListStudentComponent';
import CreateStudentComponent from './components/CreateStudentComponent';
import StudentPortalComponent from './components/StudentPortalComponent';
import AttendanceReportComponent from './components/AttendanceReportComponent';
import MarkAttendanceComponent from './components/AttendanceComponent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    // Get role from storage to protect routes
    const role = localStorage.getItem('userRole');

    return (
        <div className="App bg-light min-vh-100">
            <Router>
                <Navbar />
                <div className="container py-4">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<LoginPage />} />

                        {/* Staff Protected Routes */}
                        <Route 
                            path="/students" 
                            element={role === 'staff' ? <ListStudentComponent /> : <Navigate to="/login" />} 
                        />
                        <Route 
                            path="/add-student/:id" 
                            element={role === 'staff' ? <CreateStudentComponent /> : <Navigate to="/login" />} 
                        />
                        <Route 
                            path="/attendance" 
                            element={role === 'staff' ? <MarkAttendanceComponent /> : <Navigate to="/login" />} 
                        />
                        <Route 
                            path="/reports" 
                            element={role === 'staff' ? <AttendanceReportComponent /> : <Navigate to="/login" />} 
                        />

                        {/* Student Protected Routes */}
                        <Route 
                            path="/portal" 
                            element={role === 'student' ? <StudentPortalComponent /> : <Navigate to="/login" />} 
                        />
                    </Routes>
                </div>
                <ToastContainer position="bottom-right" />
            </Router>
        </div>
    );
}

export default App;