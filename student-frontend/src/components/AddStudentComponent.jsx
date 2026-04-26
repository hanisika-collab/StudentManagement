import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import StudentService from '../services/StudentService';
import { toast } from 'react-toastify';
const AddStudentComponent = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    
    // New state to hold validation errors from backend
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        department: ''
    });

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            StudentService.getStudentById(id).then((response) => {
                setName(response.data.name);
                setEmail(response.data.email);
                setDepartment(response.data.department);
            }).catch(error => console.log(error));
        }
    }, [id]);

    const saveOrUpdateStudent = (e) => {
        e.preventDefault();
        const student = { name, email, department };

        const handleSuccess = () => navigate('/');
        
        const handleError = (error) => {
            if (error.response && error.response.status === 400) {
                // This grabs the Map<String, String> from your GlobalExceptionHandler
                setErrors(error.response.data);
            } else {
                console.log("An unexpected error occurred:", error);
            }
        };

        if (id) {
        StudentService.updateStudent(id, student).then(() => {
        toast.success("Student updated successfully! ✨");
        navigate('/');
        }).catch(handleError);
        } else {
        StudentService.createStudent(student).then(() => {
        toast.success("New student added! ✅");
        navigate('/');
        }).catch(handleError);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card col-md-6 offset-md-3">
                <h2 className="text-center mt-3">{id ? "Update Student" : "Add Student"}</h2>
                <div className="card-body">
                    <form>
                        <div className="form-group mb-3">
                            <label className="form-label">Name:</label>
                            <input 
                                type="text" 
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label">Email:</label>
                            <input 
                                type="email" 
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label">Department:</label>
                            <input 
                                type="text" 
                                className={`form-control ${errors.department ? 'is-invalid' : ''}`} 
                                value={department} 
                                onChange={(e) => setDepartment(e.target.value)} 
                            />
                            {errors.department && <div className="invalid-feedback">{errors.department}</div>}
                        </div>

                        <button className="btn btn-success" onClick={(e) => saveOrUpdateStudent(e)}>Submit</button>
                        <Link to="/" className="btn btn-danger" style={{ marginLeft: "10px" }}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddStudentComponent;