import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentService from '../services/StudentService';
import { toast } from 'react-toastify';

const CreateStudentComponent = () => {
    const [student, setStudent] = useState({
        id: '', // Register Number
        name: '',
        department: '',
        dateOfBirth: ''
    });

    const navigate = useNavigate();

    const saveStudent = (e) => {
        e.preventDefault();

        // Basic Validation
        if(!student.id || !student.name || !student.dateOfBirth) {
            toast.warning("Please fill all mandatory fields");
            return;
        }

        StudentService.saveStudent(student).then((response) => {
            toast.success("Student " + student.id + " registered successfully!");
            navigate('/students');
        }).catch(error => {
            console.error(error);
            toast.error("Failed to register student. Check if Reg No already exists.");
        });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow border-0 p-4">
                        <h3 className="text-center mb-4 text-primary">Student Registration</h3>
                        <form onSubmit={saveStudent}>
                            
                           
                        <div className="mb-3">
                        <label className="form-label fw-bold text-dark">University Register Number</label>
                        <input
                            type="text" // Allows 'AC22UIT001'
                            placeholder="Enter Reg No (e.g., AC22UIT001)"
                            className="form-control"
                            value={student.id}
                            onChange={(e) => setStudent({...student, id: e.target.value.toUpperCase()})} // Auto-capitalize
                            required
                        />
                        </div>
                                                <div className="mb-3">
                                <label className="form-label fw-bold">Student Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Full Name"
                                    className="form-control"
                                    value={student.name}
                                    onChange={(e) => setStudent({...student, name: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Department</label>
                                <select 
                                    className="form-select"
                                    value={student.department}
                                    onChange={(e) => setStudent({...student, department: e.target.value})}
                                    required
                                >
                                    <option value="">-- Select Department --</option>
                                    <option value="IT">Information Technology</option>
                                    <option value="CSE">Computer Science</option>
                                    <option value="ECE">Electronics & Comm</option>
                                    <option value="EEE">Electrical Electronics Engineering</option>
                                    <option value="CIVIL">Civil Engineering</option>
                                    <option value="BME">Bio Medical Engineering</option>
                                    <option value="BIO-TECH">Bio Technology  Engineering</option>
                                    <option value="MECH">Mechanical Engineering</option>
                                    <option value="AERO">Aeronautical Engineering</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold text-danger">Date of Birth (Password)</label>
                                <input
                                    type="text"
                                    placeholder="DDMMYYYY (e.g., 25042004)"
                                    className="form-control"
                                    value={student.dateOfBirth}
                                    onChange={(e) => setStudent({...student, dateOfBirth: e.target.value})}
                                    required
                                />
                                <div className="form-text">Students will use this as their password to login.</div>
                            </div>

                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-primary btn-lg">Save Record</button>
                                <button type="button" className="btn btn-light" onClick={() => navigate('/students')}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateStudentComponent;