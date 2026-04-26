import React, { useState, useEffect } from 'react';
import StudentService from '../services/StudentService';
import { toast } from 'react-toastify';

const AddMarksComponent = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [semester, setSemester] = useState('');
    const [subject, setSubject] = useState('');
    const [internalMarks, setInternalMarks] = useState(0);
    const [externalMarks, setExternalMarks] = useState(0);
    const [extraPoints, setExtraPoints] = useState(0);

    useEffect(() => {
        StudentService.getStudents().then(res => setStudents(res.data));
    }, []);

    const saveMarks = (e) => {
        e.preventDefault();
        const marksData = { 
            semester, subject, internalMarks, externalMarks, 
            extraCurricularPoints: extraPoints 
        };

        // We'll add this method to StudentService.js in a moment
        StudentService.addStudentMarks(selectedStudentId, marksData).then(() => {
            toast.success("Marks & Activity Points saved successfully!");
            // Clear form
            setSubject(''); setInternalMarks(0); setExternalMarks(0); setExtraPoints(0);
        }).catch(err => toast.error("Error saving data"));
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-info text-white">
                    <h4 className="mb-0">Enter Academic & Extra-Curricular Data</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={saveMarks}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Select Student</label>
                                <select className="form-select" value={selectedStudentId} 
                                    onChange={(e) => setSelectedStudentId(e.target.value)} required>
                                    <option value="">-- Choose Student --</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.department})</option>)}
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Semester</label>
                                <input type="text" className="form-control" placeholder="e.g. Semester 8" 
                                    value={semester} onChange={(e) => setSemester(e.target.value)} required />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Subject</label>
                                <input type="text" className="form-control" value={subject} 
                                    onChange={(e) => setSubject(e.target.value)} required />
                            </div>
                            <div className="col-md-2 mb-3">
                                <label className="form-label">Internal (40)</label>
                                <input type="number" className="form-control" value={internalMarks} 
                                    onChange={(e) => setInternalMarks(e.target.value)} max="40" />
                            </div>
                            <div className="col-md-2 mb-3">
                                <label className="form-label">External (60)</label>
                                <input type="number" className="form-control" value={externalMarks} 
                                    onChange={(e) => setExternalMarks(e.target.value)} max="60" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-bold text-success">Extra-Curricular Points (0-100)</label>
                                <input type="number" className="form-control border-success" value={extraPoints} 
                                    onChange={(e) => setExtraPoints(e.target.value)} />
                                <small className="text-muted">Sports, Hackathons, Paper Presentations</small>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-info text-white w-100 mt-3">
                            Save Performance Data
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMarksComponent;