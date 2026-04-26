import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentService from '../services/StudentService';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [isStudent, setIsStudent] = useState(true);
    const [credentials, setCredentials] = useState({ id: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        if (isStudent) {
            // Student Login Logic
            StudentService.getStudentById(credentials.id).then(res => {
                if (res.data.dateOfBirth === credentials.password) {
                    localStorage.setItem('userRole', 'student');
                    localStorage.setItem('studentId', res.data.id);
                    toast.success("Welcome to Student Portal");
                    navigate('/portal');
                    window.location.reload();
                } else {
                    toast.error("Invalid DOB format (DDMMYYYY)");
                }
            }).catch(() => toast.error("Student Register Number not found"));
        } else {
            // Staff Login Logic (Mocked for now - or connect to your StaffController)
// Inside handleLogin for Staff
            StudentService.staffLogin(credentials.id, credentials.password)
                 .then(res => {
                    localStorage.setItem('userRole', 'staff');
                    localStorage.setItem('staffId', res.data.id);
                    navigate('/students');
                    window.location.reload();
                    })
                    .catch(() => toast.error("Staff record not found in database"));
                        }
};

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 border-0 rounded-4" style={{ width: '400px' }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold">{isStudent ? 'Student Login' : 'Staff Login'}</h2>
                    <p className="text-muted">Access the ACE Smart Portal</p>
                </div>

                <div className="btn-group w-100 mb-4 shadow-sm">
                    <button className={`btn ${isStudent ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setIsStudent(true)}>Student</button>
                    <button className={`btn ${!isStudent ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setIsStudent(false)}>Staff</button>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">{isStudent ? 'Register Number' : 'Staff Username'}</label>
                        <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            placeholder={isStudent ? 'AC22UIT001' : 'Username'}
                            onChange={(e) => setCredentials({...credentials, id: e.target.value.toUpperCase()})}
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small fw-bold">{isStudent ? 'DOB (DDMMYYYY)' : 'Password'}</label>
                        <input 
                            type="password" 
                            className="form-control form-control-lg" 
                            placeholder={isStudent ? '25042004' : '••••••••'}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-dark w-100 py-2 shadow">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;