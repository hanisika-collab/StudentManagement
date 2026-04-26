import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentService from '../services/StudentService';
import { toast } from 'react-toastify';

const ListStudentComponent = () => {
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllStudents();
    }, []);

    const getAllStudents = () => {
        StudentService.getStudents().then((response) => {
            setStudents(response.data);
        }).catch(error => {
            console.log(error);
        });
    };

    const deleteStudent = (studentId) => {
        if(window.confirm("Are you sure you want to delete this student?")) {
            StudentService.deleteStudent(studentId).then(() => {
                toast.success("Student deleted successfully");
                getAllStudents();
            }).catch(error => {
                toast.error("Error deleting student");
            });
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary">Student Records</h2>
                <button className="btn btn-primary shadow-sm" onClick={() => navigate('/add-student')}>
                    <i className="bi bi-person-plus-fill me-2"></i> Register New Student
                </button>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Reg No</th>
                                <th>Full Name</th>
                                <th>Department</th>
                                <th>DOB (Password)</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td><strong>{student.id}</strong></td>
                                    <td>{student.name}</td>
                                    <td><span className="badge bg-info text-dark">{student.department}</span></td>
                                    <td><code>{student.dateOfBirth}</code></td>
                                    <td className="text-center">
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteStudent(student.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListStudentComponent;