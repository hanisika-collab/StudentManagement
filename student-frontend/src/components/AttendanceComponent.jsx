import React, { useState, useEffect } from 'react';
import StudentService from '../services/StudentService';
import { toast } from 'react-toastify';

const AttendanceComponent = () => {
    const [students, setStudents] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);

    useEffect(() => {
        // Fetch all students to list them for attendance
        StudentService.getStudents().then((res) => {
            setStudents(res.data);
            // Initialize everyone as "Present" by default
            const initialAttendance = res.data.map(student => ({
                studentId: student.id,
                name: student.name,
                status: 'Present'
            }));
            setAttendanceList(initialAttendance);
        });
    }, []);

    const handleStatusChange = (studentId, newStatus) => {
        const updatedList = attendanceList.map(item => 
            item.studentId === studentId ? { ...item, status: newStatus } : item
        );
        setAttendanceList(updatedList);
    };

    const submitAttendance = () => {
        // Filter out unnecessary fields (like name) before sending to API
        const payload = attendanceList.map(({ studentId, status }) => ({ studentId, status }));
        
        StudentService.markAttendance(payload).then((res) => {
            toast.success("Attendance marked for " + new Date().toLocaleDateString());
        }).catch(err => {
            toast.error("Error marking attendance");
            console.error(err);
        });
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Mark Daily Attendance</h4>
                    <span>Date: {new Date().toLocaleDateString()}</span>
                </div>
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Department</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceList.map((item, index) => (
                                <tr key={item.studentId}>
                                    <td>{item.name}</td>
                                    <td>{students[index]?.department}</td>
                                    <td className="text-center">
                                        <div className="btn-group" role="group">
                                            <button 
                                                className={`btn btn-sm ${item.status === 'Present' ? 'btn-success' : 'btn-outline-success'}`}
                                                onClick={() => handleStatusChange(item.studentId, 'Present')}
                                            >
                                                Present
                                            </button>
                                            <button 
                                                className={`btn btn-sm ${item.status === 'Absent' ? 'btn-danger' : 'btn-outline-danger'}`}
                                                onClick={() => handleStatusChange(item.studentId, 'Absent')}
                                            >
                                                Absent
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="btn btn-primary w-100 mt-3" onClick={submitAttendance}>
                        Submit Attendance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceComponent;