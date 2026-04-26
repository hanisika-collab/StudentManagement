import React, { useState, useEffect } from 'react';
import StudentService from '../services/StudentService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RadarArea } from 'recharts';
import AIInsightCard from './AIInsightCard';
import { toast } from 'react-toastify';

const StudentPortalComponent = () => {
    const [searchId, setSearchId] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [rawMarks, setRawMarks] = useState([]);
    const [newGoal, setNewGoal] = useState(''); // State for editing goal
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const savedId = localStorage.getItem('studentId');
        if (savedId) fetchStudentDetails(savedId);
    }, []);

    const fetchStudentDetails = (id) => {
        StudentService.getStudentById(id).then(res => {
            setStudentData(res.data);
            setNewGoal(res.data.currentGoal || '');
            localStorage.setItem('studentId', id);
            
            StudentService.getStudentMarks(id).then(markRes => {
                setRawMarks(markRes.data);
                prepareChartData(markRes.data);
            });
        }).catch(() => setError("Invalid Register Number."));
    };

    const prepareChartData = (marks) => {
        if (marks.length === 0) return;
        const avgInternal = marks.reduce((acc, m) => acc + m.internalMarks, 0) / marks.length;
        const avgExternal = marks.reduce((acc, m) => acc + m.externalMarks, 0) / marks.length;
        setChartData([
            { subject: 'Internals', A: (avgInternal / 40) * 100 },
            { subject: 'Externals', A: (avgExternal / 60) * 100 },
            { subject: 'Activities', A: 70 },
            { subject: 'Attendance', A: 85 },
        ]);
    };

    const handleSaveGoal = () => {
        StudentService.updateStudentGoal(studentData.id, newGoal)
            .then(res => {
                setStudentData(res.data);
                setIsEditingGoal(false);
                toast.success("Goal Updated Successfully!");
            })
            .catch(() => toast.error("Failed to save goal. Check backend connection."));
    };

    return (
        <div className="container mt-4">
            {!studentData ? (
                <div className="row justify-content-center mt-5">
                    <div className="col-md-4 card p-4 shadow border-0">
                        <h3 className="text-center mb-3">Student Login</h3>
                        <input type="text" className="form-control mb-3" placeholder="Reg No (e.g. AC22UIT001)" 
                               value={searchId} onChange={(e) => setSearchId(e.target.value.toUpperCase())} />
                        <button className="btn btn-primary w-100" onClick={() => fetchStudentDetails(searchId)}>Login</button>
                        {error && <p className="text-danger mt-2 small">{error}</p>}
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-12 card bg-dark text-white p-4 rounded-4 shadow">
                        <div className="d-flex justify-content-between">
                            <h4>Welcome, {studentData.name}</h4>
                            <button className="btn btn-outline-light btn-sm" onClick={() => {localStorage.clear(); window.location.reload();}}>Logout</button>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm p-3 mb-4 rounded-4">
                            <h6 className="fw-bold text-muted text-uppercase">AI Career Goal</h6>
                            {isEditingGoal ? (
                                <>
                                    <textarea className="form-control mb-2" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} />
                                    <button className="btn btn-success btn-sm w-100" onClick={handleSaveGoal}>Save Goal</button>
                                </>
                            ) : (
                                <>
                                    <p className="fst-italic">"{studentData.currentGoal || "No goal set."}"</p>
                                    <button className="btn btn-link btn-sm p-0" onClick={() => setIsEditingGoal(true)}>Edit Goal</button>
                                </>
                            )}
                        </div>
                        <AIInsightCard marks={rawMarks} />
                    </div>

                    <div className="col-md-8 card shadow-sm p-4 rounded-4">
                        <h5 className="fw-bold mb-4">Performance Radar</h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <RadarArea name="Me" dataKey="A" stroke="#0d6efd" fill="#0d6efd" fillOpacity={0.6} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentPortalComponent;