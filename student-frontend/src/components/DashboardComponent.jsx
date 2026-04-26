import React, { useState, useEffect } from 'react';
import StudentService from '../services/StudentService';

const DashboardComponent = () => {
    const [stats, setStats] = useState({ 
        total: 0, 
        itDept: 0, 
        presentToday: 0,
        attendancePercentage: 0 
    });

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Fetch both Students and Attendance in parallel
        Promise.all([
            StudentService.getStudents(),
            StudentService.getAttendanceReport(today)
        ]).then(([studentRes, attendanceRes]) => {
            const students = studentRes.data;
            const attendance = attendanceRes.data;

            const itCount = students.filter(s => s.department === "IT").length;
            const presentCount = attendance.filter(a => a.status === "Present").length;
            
            // Calculate Percentage
            const percentage = students.length > 0 
                ? ((presentCount / students.length) * 100).toFixed(1) 
                : 0;

            setStats({ 
                total: students.length, 
                itDept: itCount, 
                presentToday: presentCount,
                attendancePercentage: percentage
            });
        }).catch(err => console.error("Error loading dashboard stats", err));
    }, []);

    return (
        <div className="container-fluid mt-4">
            <h3 className="mb-4">Staff Overview Dashboard</h3>
            
            <div className="row g-3">
                {/* Total Students Card */}
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm bg-primary text-white h-100">
                        <div className="card-body">
                            <h6>Total Students</h6>
                            <h2 className="display-6 fw-bold">{stats.total}</h2>
                        </div>
                    </div>
                </div>

                {/* IT Dept Card */}
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm bg-info text-white h-100">
                        <div className="card-body">
                            <h6>IT Students</h6>
                            <h2 className="display-6 fw-bold">{stats.itDept}</h2>
                        </div>
                    </div>
                </div>

                {/* Attendance Count Card */}
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm bg-success text-white h-100">
                        <div className="card-body">
                            <h6>Present Today</h6>
                            <h2 className="display-6 fw-bold">{stats.presentToday}</h2>
                        </div>
                    </div>
                </div>

                {/* Attendance Percentage Card */}
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm bg-warning text-dark h-100">
                        <div className="card-body">
                            <h6>Attendance Rate</h6>
                            <h2 className="display-6 fw-bold">{stats.attendancePercentage}%</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Chart Section Placeholder */}
            <div className="row mt-4">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm p-4">
                        <h5>Recent Activity</h5>
                        <p className="text-muted small">System is up to date. Attendance for today has been recorded.</p>
                        {/* You could add a simple list of recently added students here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardComponent;