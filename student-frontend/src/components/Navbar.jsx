import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole'); // 'staff' or 'student'
    const userId = localStorage.getItem('studentId'); // Alphanumeric ID

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    <i className="bi bi-cpu-fill me-2 text-info"></i>
                    ACE Smart Portal
                </Link>
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {/* --- COMMON LINKS --- */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>

                        {/* --- STAFF ONLY LINKS --- */}
                        {role === 'staff' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/students">Manage Students</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/attendance">Mark Attendance</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/reports">History Reports</Link>
                                </li>
                            </>
                        )}

                        {/* --- STUDENT ONLY LINKS --- */}
                        {role === 'student' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to={`/portal`}>My Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/my-marks">Academic Profile</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* --- AUTH BUTTONS --- */}
                    <div className="d-flex align-items-center">
                        {role ? (
                            <div className="dropdown">
                                <button className="btn btn-outline-info dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    <i className="bi bi-person-circle me-1"></i> {userId || 'Staff'}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                                </ul>
                            </div>
                        ) : (
                            <Link className="btn btn-primary btn-sm px-4" to="/login">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;