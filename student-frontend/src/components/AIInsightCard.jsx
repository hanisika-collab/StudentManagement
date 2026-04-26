import React from 'react';

const AIInsightCard = ({ marks }) => {
    if (!marks || marks.length === 0) return null;

    // Logic: Calculate average and check for risks
    const latestMarks = marks[marks.length - 1]; // Analyze most recent semester
    const total = latestMarks.internalMarks + latestMarks.externalMarks;
    const isAtRisk = latestMarks.internalMarks < 20; // Assuming 50 is max internal
    const needsSoftSkills = latestMarks.extraCurricularPoints < 5;

    return (
        <div className={`card shadow-sm border-0 ${isAtRisk ? 'border-start border-danger border-4' : 'border-start border-success border-4'}`}>
            <div className="card-body">
                <h5 className="card-title text-primary">
                    <i className="bi bi-cpu-fill me-2"></i> AI Performance Insights
                </h5>
                <hr />
                
                <div className="mb-3">
                    <h6 className="fw-bold">Academic Status:</h6>
                    <p className="mb-1">
                        Current Score: <span className="badge bg-primary">{total}%</span>
                    </p>
                    {isAtRisk ? (
                        <p className="text-danger small"><i className="bi bi-exclamation-triangle-fill"></i> Warning: Your internal marks are low. Focus on upcoming assignments.</p>
                    ) : (
                        <p className="text-success small"><i className="bi bi-check-circle-fill"></i> Great job! You are maintaining a strong academic record.</p>
                    )}
                </div>

                <div>
                    <h6 className="fw-bold">Recommendation:</h6>
                    <ul className="small text-muted ps-3">
                        {needsSoftSkills && <li>Participate in more technical workshops to improve your profile.</li>}
                        {total > 80 && <li>Excellent! You are eligible for the Peer-Tutor program.</li>}
                        <li>Focus on "{latestMarks.subject}" to maintain your GPA.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AIInsightCard;