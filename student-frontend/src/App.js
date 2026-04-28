import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SidebarLayout from './components/Sidebarlayout ';
import LoginPage from './components/LoginPage';
import ListStudentComponent from './components/ListStudentComponent';
import CreateStudentComponent from './components/CreateStudentComponent';
import StudentPortalComponent from './components/StudentPortalComponent';
import AttendanceReportComponent from './components/AttendanceReportComponent';
import MarkAttendanceComponent from './components/AttendanceComponent';
import DashboardComponent from './components/DashboardComponent';
// import StaffProfileComponent from './components/StaffProfileComponent';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const role = localStorage.getItem('userRole');

  // Login page: no sidebar, full-screen
  if (!role) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
        <ToastContainer position="bottom-right" theme="dark" />
      </Router>
    );
  }

  return (
    // ⚠️  NO "container" wrapper here — SidebarLayout handles full-width layout
    <Router>
      <SidebarLayout role={role}>
        <Routes>
          {/* Redirect root based on role */}
          <Route
            path="/"
            element={<Navigate to={role === 'staff' ? '/dashboard' : '/portal'} />}
          />
          <Route path="/login" element={<Navigate to="/" />} />

          {/* ── Staff routes ── */}
          {role === 'staff' && (
            <>
              <Route path="/dashboard"    element={<DashboardComponent />} />
              <Route path="/students"     element={<ListStudentComponent />} />
              <Route path="/add-student"  element={<CreateStudentComponent />} />
              <Route path="/add-student/:id" element={<CreateStudentComponent />} />
              <Route path="/attendance"   element={<MarkAttendanceComponent />} />
              <Route path="/reports"      element={<AttendanceReportComponent />} />
              {/* <Route path="/staff-profile" element={<StaffProfileComponent />} /> */}
            </>
          )}

          {/* ── Student routes ── */}
          {role === 'student' && (
            <>
              <Route path="/portal" element={<StudentPortalComponent />} />
            </>
          )}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </SidebarLayout>
      <ToastContainer position="bottom-right" theme="dark" />
    </Router>
  );
}

export default App;