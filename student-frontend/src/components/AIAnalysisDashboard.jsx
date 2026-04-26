import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import StudentService from '../services/StudentService';
import { toast } from 'react-toastify';

const AIAnalysisDashboard = () => {
    const [students, setStudents] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        StudentService.getStudents().then(res => setStudents(res.data));
    }, []);

    const runAIAnalysis = (id) => {
        if (!id) {
            setAnalysis(null);
            return;
        }
        setSelectedId(id);
        setLoading(true);

        StudentService.getStudentMarks(id).then(res => {
            const marks = res.data;
            if (marks.length === 0) {
                toast.info("No marks data found for this student yet.");
                setAnalysis(null);
                setLoading(false);
                return;
            }

            // Calculate Averages for the Radar Chart
            const avgInternal = marks.reduce((acc, m) => acc + m.internalMarks, 0) / marks.length;
            const avgExternal = marks.reduce((acc, m) => acc + m.externalMarks, 0) / marks.length;
            const avgExtra = marks.reduce((acc, m) => acc + m.extraCurricularPoints, 0) / marks.length;
            
            // Note: In a real app, you'd fetch real attendance % here
            const mockAttendance = 85; 

            setChartData([
                { subject: 'Internals', A: (avgInternal / 40) * 100 },
                { subject: 'Externals', A: (avgExternal / 60) * 100 },
                { subject: 'Extra-Curricular', A: avgExtra },
                { subject: 'Attendance', A: mockAttendance },
            ]);

            // AI Logic: Detect the lowest performing area and suggest a goal
            let suggestedGoal = "";
            let category = "";

            if (avgInternal < 20) {
                suggestedGoal = "Improve Internal scores by attending remedial sessions and submitting assignments on time.";
                category = "Academic Support Required";
            } else if (avgExtra < 40) {
                suggestedGoal = "Boost your profile by participating in upcoming Hackathons or Paper Presentations.";
                category = "Skill Development Needed";
            } else if (avgExternal < 30) {
                suggestedGoal = "Focus on previous year question papers to improve Semester Exam performance.";
                category = "Exam Preparation Focus";
            } else {
                suggestedGoal = "Maintain consistency and start preparing for Aptitude/Technical interviews.";
                category = "Placement Ready";
            }

            setAnalysis({ avgInternal, avgExternal, avgExtra, suggestedGoal, category });
            setLoading(false);
        }).catch(err => {
            toast.error("Error fetching student performance data");
            setLoading(false);
        });
    };

    const handleActivateGoal = () => {
        if (!selectedId || !analysis.suggestedGoal) return;

        StudentService.updateStudentGoal(selectedId, analysis.suggestedGoal)
            .then(() => {
                toast.success("AI Goal has been saved to Student Profile! 🎯");
            })
            .catch(err => {
                console.error(err);
                toast.error("Failed to save goal. Check backend connection.");
            });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>AI Performance Analytics</h3>
                <span className="badge bg-secondary">AI Model: v1.0 (Heuristic)</span>
            </div>
            
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <label className="form-label fw-bold">Select Student for AI Review:</label>
                    <select className="form-select" onChange={(e) => runAIAnalysis(e.target.value)}>
                        <option value="">-- Choose a Student --</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.department})</option>)}
                    </select>
                </div>
            </div>

            {loading && <div className="text-center"><h4>Analyzing data...</h4></div>}

            {analysis && !loading && (
                <div className="row">
                    {/* Visual Analytics */}
                    <div className="col-md-7">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header bg-white">
                                <h5 className="mb-0">Performance Radar</h5>
                            </div>
                            <div className="card-body">
                                <div style={{ width: '100%', height: 350 }}>
                                    <ResponsiveContainer>
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="subject" />
                                            <Radar name="Student" dataKey="A" stroke="#4e73df" fill="#4e73df" fillOpacity={0.6} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-center mt-3">
                                    <small className="text-muted">Comparing standardized scores across 4 key metrics</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Insight Card */}
                    <div className="col-md-5">
                        <div className="card shadow-sm border-0 bg-dark text-white h-100">
                            <div className="card-body d-flex flex-column">
                                <div className="mb-3">
                                    <span className="badge bg-warning text-dark mb-2">AI INSIGHT</span>
                                    <h4>{analysis.category}</h4>
                                </div>
                                <hr className="bg-light" />
                                <div className="flex-grow-1">
                                    <p className="text-info mb-1">Recommended Goal:</p>
                                    <p className="fs-5 italic" style={{ borderLeft: "4px solid #ffc107", paddingLeft: "15px" }}>
                                        "{analysis.suggestedGoal}"
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <button className="btn btn-warning w-100 py-2 fw-bold" onClick={handleActivateGoal}>
                                        <i className="bi bi-bullseye me-2"></i> SET AS ACTIVE GOAL
                                    </button>
                                    <p className="text-center small mt-2 text-muted">Clicking this notifies the student</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAnalysisDashboard;