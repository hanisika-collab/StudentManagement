import React, { useState } from 'react';
import StudentService from '../services/StudentService';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AttendanceReportComponent = () => {
    const [date, setDate] = useState('');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReport = () => {
        if (!date) {
            toast.warn("Please select a date first!");
            return;
        }

        setLoading(true);
        // Note: Your backend controller for "Report" should handle fetching by DATE.
        // We ensure the service call matches:
        StudentService.getAttendanceByDate(date).then((res) => {
            setRecords(res.data);
            setLoading(false);
            if (res.data.length === 0) {
                toast.info("No records found for this date.");
            }
        }).catch(err => {
            setLoading(false);
            toast.error("Failed to fetch report. Ensure the date-based endpoint exists.");
        });
    };

    const exportPDF = () => {
        const doc = new jsPDF();

        // PDF Header Section
        doc.setFontSize(18);
        doc.text("Student Attendance Report", 14, 20);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Report Date: ${date}`, 14, 30);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 36);

        // Prepare Table Data - Using the alphanumeric student.id (e.g., AC22UIT001)
        const tableColumn = ["Register No", "Student Name", "Department", "Status"];
        const tableRows = records.map(record => [
            record.student.id,
            record.student.name,
            record.student.department,
            record.status
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'striped',
            headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        doc.save(`Attendance_Report_${date}.pdf`);
        toast.success("PDF Downloaded Successfully!");
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">History & Report Exports</h4>
                    {records.length > 0 && <span className="badge bg-info">{records.length} Students Found</span>}
                </div>
                <div className="card-body">
                    <div className="row mb-4 align-items-end g-2">
                        <div className="col-md-4">
                            <label className="form-label fw-bold small text-uppercase">Select Attendance Date:</label>
                            <input 
                                type="date" 
                                className="form-control shadow-sm" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                            />
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-primary w-100 shadow-sm fw-bold" onClick={fetchReport} disabled={loading}>
                                <i className={`bi ${loading ? 'spinner-border spinner-border-sm' : 'bi-search'} me-2`}></i>
                                {loading ? 'Fetching...' : 'View Report'}
                            </button>
                        </div>
                        <div className="col-md-3">
                            <button 
                                className="btn btn-success w-100 shadow-sm fw-bold" 
                                onClick={exportPDF} 
                                disabled={records.length === 0}
                            >
                                <i className="bi bi-file-earmark-pdf me-2"></i> Export PDF
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive rounded shadow-sm">
                        <table className="table table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Register No</th>
                                    <th>Student Name</th>
                                    <th>Department</th>
                                    <th className="text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.length > 0 ? (
                                    records.map((record) => (
                                        <tr key={record.id}>
                                            <td className="fw-bold text-secondary">{record.student.id}</td>
                                            <td>{record.student.name}</td>
                                            <td><span className="badge bg-light text-dark border">{record.student.department}</span></td>
                                            <td className="text-center">
                                                <span className={`badge rounded-pill ${record.status === 'Present' ? 'bg-success' : 'bg-danger'}`} style={{width: '80px'}}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted py-5">
                                            {loading ? (
                                                <div className="spinner-border text-primary" role="status"></div>
                                            ) : (
                                                <>
                                                    <i className="bi bi-calendar2-x display-4 d-block mb-3"></i>
                                                    No records found. Please select a date to load attendance data.
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReportComponent;