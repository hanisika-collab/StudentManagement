import React, { useState, useEffect } from 'react';
import StudentService from '../services/StudentService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import AIInsightCard from './AIInsightCard';
import AIChatbot from './Aichatbot';
import { toast } from 'react-toastify';

// ─── Inject fonts & keyframes once ─────────────────────────────────────────────
const injectPortalStyles = () => {
  if (document.getElementById('ace-portal-styles')) return;
  const el = document.createElement('style');
  el.id = 'ace-portal-styles';
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');

    .ace-portal * { box-sizing: border-box; }

    .ace-portal {
      min-height: 100vh;
      background: #080c14;
      background-image:
        radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 60%),
        radial-gradient(ellipse 40% 30% at 85% 80%, rgba(139,92,246,0.1) 0%, transparent 50%);
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
      padding: 0 0 80px;
    }

    /* ── Hero Banner ── */
    .ace-hero {
      padding: 40px 32px 36px;
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      margin-bottom: 32px;
    }
    .ace-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 100%);
      z-index: 0;
    }
    .ace-hero-content { position: relative; z-index: 1; }
    .ace-hero-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(99,102,241,0.15);
      border: 1px solid rgba(99,102,241,0.35);
      color: #a78bfa;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 14px;
    }
    .ace-hero-name {
      font-family: 'Syne', sans-serif;
      font-size: clamp(26px, 4vw, 36px);
      font-weight: 800;
      color: #fff;
      margin: 0 0 6px;
      letter-spacing: -0.02em;
    }
    .ace-hero-sub {
      color: rgba(148,163,184,0.8);
      font-size: 14px;
      margin: 0;
    }
    .ace-hero-stats {
      display: flex;
      gap: 24px;
      margin-top: 24px;
      flex-wrap: wrap;
    }
    .ace-stat-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 8px 16px;
    }
    .ace-stat-pill-icon {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    .ace-stat-pill-label { font-size: 11px; color: rgba(148,163,184,0.7); margin-bottom: 1px; }
    .ace-stat-pill-value { font-size: 14px; font-weight: 600; color: #e2e8f0; }

    /* ── Grid Layout ── */
    .ace-grid {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 20px;
      padding: 0 32px;
    }
    @media (max-width: 900px) {
      .ace-grid { grid-template-columns: 1fr; padding: 0 16px; }
      .ace-hero { padding: 24px 16px; }
    }

    /* ── Cards ── */
    .ace-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px;
      overflow: hidden;
      transition: border-color 0.2s;
    }
    .ace-card:hover { border-color: rgba(99,102,241,0.25); }
    .ace-card-header {
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .ace-card-title {
      font-family: 'Syne', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: rgba(148,163,184,0.9);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin: 0;
    }
    .ace-card-body { padding: 20px; }

    /* ── Goal Card ── */
    .ace-goal-text {
      font-size: 15px;
      font-style: italic;
      color: rgba(226,232,240,0.85);
      line-height: 1.6;
      border-left: 3px solid #6366f1;
      padding-left: 14px;
      margin: 0 0 16px;
    }
    .ace-edit-btn {
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.3);
      color: #a78bfa;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .ace-edit-btn:hover { background: rgba(99,102,241,0.25); }
    .ace-goal-textarea {
      width: 100%;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(99,102,241,0.4);
      border-radius: 10px;
      color: #e2e8f0;
      padding: 10px 14px;
      font-size: 14px;
      font-family: 'DM Sans', sans-serif;
      resize: vertical;
      outline: none;
      margin-bottom: 10px;
    }
    .ace-save-btn {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none;
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 20px;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
      transition: opacity 0.2s;
    }
    .ace-save-btn:hover { opacity: 0.9; }

    /* ── Subject Table ── */
    .ace-subject-table {
      width: 100%;
      border-collapse: collapse;
    }
    .ace-subject-table th {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: rgba(148,163,184,0.6);
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .ace-subject-table td {
      padding: 12px;
      font-size: 13px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .ace-subject-table tr:last-child td { border-bottom: none; }
    .ace-subject-table tr:hover td { background: rgba(255,255,255,0.02); }
    .ace-score-bar-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ace-score-bar {
      flex: 1;
      height: 4px;
      background: rgba(255,255,255,0.08);
      border-radius: 2px;
      overflow: hidden;
    }
    .ace-score-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .ace-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 6px;
    }

    /* ── Radar Card ── */
    .ace-radar-wrap {
      height: 280px;
    }
    .recharts-polar-angle-axis-tick text {
      fill: rgba(148,163,184,0.7) !important;
      font-size: 12px !important;
      font-family: 'DM Sans', sans-serif !important;
    }
    .recharts-polar-grid-concentric-polygon { stroke: rgba(255,255,255,0.06) !important; }

    /* ── Attendance summary ── */
    .ace-attend-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .ace-attend-row:last-child { border-bottom: none; }

    /* ── Login screen ── */
    .ace-login-wrap {
      min-height: 100vh;
      background: #080c14;
      background-image: radial-gradient(ellipse 80% 50% at 50% 30%, rgba(99,102,241,0.2) 0%, transparent 60%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'DM Sans', sans-serif;
    }
    .ace-login-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 40px;
      width: 380px;
      backdrop-filter: blur(20px);
    }
    .ace-login-title {
      font-family: 'Syne', sans-serif;
      font-size: 28px;
      font-weight: 800;
      color: #fff;
      margin: 0 0 6px;
    }
    .ace-login-sub { color: rgba(148,163,184,0.7); font-size: 14px; margin: 0 0 28px; }
    .ace-input {
      width: 100%;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      color: #e2e8f0;
      padding: 12px 16px;
      font-size: 15px;
      font-family: 'DM Sans', sans-serif;
      outline: none;
      transition: border-color 0.2s;
      margin-bottom: 14px;
    }
    .ace-input:focus { border-color: rgba(99,102,241,0.6); }
    .ace-input::placeholder { color: rgba(148,163,184,0.4); }
    .ace-login-btn {
      width: 100%;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border: none;
      border-radius: 10px;
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      padding: 13px;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: opacity 0.2s, transform 0.1s;
      box-shadow: 0 8px 24px rgba(99,102,241,0.35);
    }
    .ace-login-btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .ace-error { color: #f87171; font-size: 13px; margin-top: 10px; }

    /* ── Logout btn ── */
    .ace-logout-btn {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(226,232,240,0.7);
      font-size: 13px;
      padding: 7px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'DM Sans', sans-serif;
    }
    .ace-logout-btn:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); color: #fca5a5; }

    /* ── Section titles ── */
    .ace-section-title {
      font-family: 'Syne', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #e2e8f0;
      margin: 0 0 4px;
    }
    .ace-section-sub { font-size: 13px; color: rgba(148,163,184,0.6); margin: 0; }

    /* ── Insight highlight ── */
    .ace-insight-highlight {
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 16px;
    }
    .ace-insight-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #818cf8; margin-bottom: 6px; }
    .ace-insight-text { font-size: 14px; color: rgba(226,232,240,0.85); line-height: 1.5; }
  `;
  document.head.appendChild(el);
};

// ─── Helpers ────────────────────────────────────────────────────────────────────
const getScoreColor = (val, max) => {
  const pct = (val / max) * 100;
  if (pct >= 70) return '#22c55e';
  if (pct >= 45) return '#f59e0b';
  return '#ef4444';
};

const getBadgeStyle = (val, max) => {
  const pct = (val / max) * 100;
  if (pct >= 70) return { background: 'rgba(34,197,94,0.15)', color: '#4ade80' };
  if (pct >= 45) return { background: 'rgba(245,158,11,0.15)', color: '#fbbf24' };
  return { background: 'rgba(239,68,68,0.15)', color: '#f87171' };
};

// ─── Main Component ─────────────────────────────────────────────────────────────
const StudentPortalComponent = () => {
  const [searchId, setSearchId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [rawMarks, setRawMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    injectPortalStyles();
    const savedId = localStorage.getItem('studentId');
    if (savedId) fetchStudentDetails(savedId);
  }, []);

  const fetchStudentDetails = (id) => {
    setLoading(true);
    setError('');
    StudentService.getStudentById(id).then(res => {
      setStudentData(res.data);
      setNewGoal(res.data.currentGoal || '');
      localStorage.setItem('studentId', id);

      Promise.all([
        StudentService.getStudentMarks(id),
        StudentService.getAttendanceByStudent(id),
      ]).then(([markRes, attendRes]) => {
        setRawMarks(markRes.data);
        setAttendance(attendRes.data);
        prepareChartData(markRes.data, attendRes.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }).catch(() => {
      setError('Register number not found. Please check and try again.');
      setLoading(false);
    });
  };

  const prepareChartData = (marks, attend) => {
    if (marks.length === 0) return;
    const avgInternal = marks.reduce((a, m) => a + m.internalMarks, 0) / marks.length;
    const avgExternal = marks.reduce((a, m) => a + m.externalMarks, 0) / marks.length;
    const avgExtra = marks.reduce((a, m) => a + m.extraCurricularPoints, 0) / marks.length;
    const presentPct = attend.length > 0
      ? (attend.filter(a => a.status === 'Present').length / attend.length) * 100 : 0;

    setChartData([
      { subject: 'Internals', A: Math.round((avgInternal / 40) * 100) },
      { subject: 'Externals', A: Math.round((avgExternal / 60) * 100) },
      { subject: 'Activities', A: Math.round(avgExtra) },
      { subject: 'Attendance', A: Math.round(presentPct) },
    ]);
  };

  const handleSaveGoal = () => {
    StudentService.updateStudentGoal(studentData.id, newGoal)
      .then(res => {
        setStudentData(res.data);
        setIsEditingGoal(false);
        toast.success('Goal updated!');
      })
      .catch(() => toast.error('Failed to save goal.'));
  };

  const attendancePct = attendance.length > 0
    ? ((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100).toFixed(1)
    : null;

  // ── Login Screen ────────────────────────────────────────────────────────────
  if (!studentData) {
    return (
      <div className="ace-login-wrap">
        <div className="ace-login-card">
          <div style={{ marginBottom: '28px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎓</div>
            <p className="ace-login-title">Student Portal</p>
            <p className="ace-login-sub">ACE Smart Academic System</p>
          </div>
          <input
            type="text"
            className="ace-input"
            placeholder="Register No (e.g. AC22UIT001)"
            value={searchId}
            onChange={e => setSearchId(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && fetchStudentDetails(searchId)}
          />
          <button
            className="ace-login-btn"
            onClick={() => fetchStudentDetails(searchId)}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Access My Portal →'}
          </button>
          {error && <p className="ace-error">{error}</p>}
        </div>
      </div>
    );
  }

  // ── Portal Dashboard ────────────────────────────────────────────────────────
  const semesterGroups = rawMarks.reduce((acc, m) => {
    acc[m.semester] = acc[m.semester] || [];
    acc[m.semester].push(m);
    return acc;
  }, {});

  return (
    <div className="ace-portal">
      {/* Hero */}
      <div className="ace-hero">
        <div className="ace-hero-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div className="ace-hero-tag">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                Student Dashboard
              </div>
              <h1 className="ace-hero-name">Welcome back, {studentData.name.split(' ')[0]} 👋</h1>
              <p className="ace-hero-sub">{studentData.department} · Reg. {studentData.id}</p>
            </div>
            <button
              className="ace-logout-btn"
              onClick={() => { localStorage.clear(); window.location.reload(); }}
            >
              Sign Out
            </button>
          </div>

          <div className="ace-hero-stats">
            <div className="ace-stat-pill">
              <div className="ace-stat-pill-icon" style={{ background: 'rgba(99,102,241,0.2)' }}>📚</div>
              <div>
                <div className="ace-stat-pill-label">Subjects Tracked</div>
                <div className="ace-stat-pill-value">{rawMarks.length}</div>
              </div>
            </div>
            {attendancePct && (
              <div className="ace-stat-pill">
                <div className="ace-stat-pill-icon" style={{ background: parseFloat(attendancePct) >= 75 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)' }}>📅</div>
                <div>
                  <div className="ace-stat-pill-label">Attendance</div>
                  <div className="ace-stat-pill-value" style={{ color: parseFloat(attendancePct) >= 75 ? '#4ade80' : '#f87171' }}>{attendancePct}%</div>
                </div>
              </div>
            )}
            <div className="ace-stat-pill">
              <div className="ace-stat-pill-icon" style={{ background: 'rgba(245,158,11,0.2)' }}>🎯</div>
              <div>
                <div className="ace-stat-pill-label">Active Goal</div>
                <div className="ace-stat-pill-value" style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {studentData.currentGoal ? studentData.currentGoal.slice(0, 30) + (studentData.currentGoal.length > 30 ? '…' : '') : 'Not set'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="ace-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Goal Card */}
          <div className="ace-card">
            <div className="ace-card-header">
              <span className="ace-card-title">🎯 Career Goal</span>
              {!isEditingGoal && (
                <button className="ace-edit-btn" onClick={() => setIsEditingGoal(true)}>Edit</button>
              )}
            </div>
            <div className="ace-card-body">
              {isEditingGoal ? (
                <>
                  <textarea
                    className="ace-goal-textarea"
                    rows={4}
                    value={newGoal}
                    onChange={e => setNewGoal(e.target.value)}
                    placeholder="Write your career goal..."
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="ace-save-btn" onClick={handleSaveGoal}>Save Goal</button>
                    <button
                      onClick={() => setIsEditingGoal(false)}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(148,163,184,0.7)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}
                    >Cancel</button>
                  </div>
                </>
              ) : (
                <p className="ace-goal-text">
                  {studentData.currentGoal || 'No goal set yet. Click Edit to add one.'}
                </p>
              )}
            </div>
          </div>

          {/* AI Insight */}
          <div className="ace-card">
            <div className="ace-card-header">
              <span className="ace-card-title">🤖 AI Insights</span>
            </div>
            <div className="ace-card-body" style={{ padding: '16px' }}>
              <AIInsightCard marks={rawMarks} />
            </div>
          </div>

          {/* Attendance Summary */}
          {attendance.length > 0 && (
            <div className="ace-card">
              <div className="ace-card-header">
                <span className="ace-card-title">📅 Attendance</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: parseFloat(attendancePct) >= 75 ? '#4ade80' : '#f87171' }}>
                  {attendancePct}%
                </span>
              </div>
              <div className="ace-card-body">
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(148,163,184,0.7)', marginBottom: '6px' }}>
                    <span>Overall Progress</span>
                    <span>{attendance.filter(a => a.status === 'Present').length}/{attendance.length} days</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${attendancePct}%`,
                      background: parseFloat(attendancePct) >= 75
                        ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                        : 'linear-gradient(90deg, #ef4444, #f87171)',
                      borderRadius: '3px',
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
                {parseFloat(attendancePct) < 75 && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#fca5a5' }}>
                    ⚠️ Below 75% threshold. You need {Math.ceil((0.75 * attendance.length - attendance.filter(a => a.status === 'Present').length) / 0.25)} more present days.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Performance Radar */}
          {chartData.length > 0 && (
            <div className="ace-card">
              <div className="ace-card-header">
                <div>
                  <span className="ace-card-title">📊 Performance Radar</span>
                </div>
                <span style={{ fontSize: '11px', color: 'rgba(148,163,184,0.5)' }}>Normalized 0–100</span>
              </div>
              <div className="ace-card-body">
                <div className="ace-radar-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                      <PolarGrid stroke="rgba(255,255,255,0.06)" />
                      <PolarAngleAxis dataKey="subject" />
                      <Radar
                        name="Performance"
                        dataKey="A"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {chartData.map(d => (
                    <div key={d.subject} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: d.A >= 70 ? '#4ade80' : d.A >= 45 ? '#fbbf24' : '#f87171' }}>{d.A}%</div>
                      <div style={{ fontSize: '11px', color: 'rgba(148,163,184,0.6)' }}>{d.subject}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Marks by Semester */}
          {Object.entries(semesterGroups).map(([sem, subjects]) => (
            <div key={sem} className="ace-card">
              <div className="ace-card-header">
                <span className="ace-card-title">📋 {sem}</span>
                <span style={{ fontSize: '12px', color: 'rgba(148,163,184,0.5)' }}>{subjects.length} subject{subjects.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="ace-card-body" style={{ padding: '0' }}>
                <table className="ace-subject-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Internal</th>
                      <th>External</th>
                      <th>Activities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((m, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500, color: '#e2e8f0' }}>{m.subject}</td>
                        <td>
                          <div className="ace-score-bar-wrap">
                            <div className="ace-score-bar">
                              <div className="ace-score-fill" style={{ width: `${(m.internalMarks / 40) * 100}%`, background: getScoreColor(m.internalMarks, 40) }} />
                            </div>
                            <span className="ace-badge" style={{ ...getBadgeStyle(m.internalMarks, 40), minWidth: '36px', textAlign: 'center' }}>
                              {m.internalMarks}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="ace-score-bar-wrap">
                            <div className="ace-score-bar">
                              <div className="ace-score-fill" style={{ width: `${(m.externalMarks / 60) * 100}%`, background: getScoreColor(m.externalMarks, 60) }} />
                            </div>
                            <span className="ace-badge" style={{ ...getBadgeStyle(m.externalMarks, 60), minWidth: '36px', textAlign: 'center' }}>
                              {m.externalMarks}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="ace-badge" style={{ background: 'rgba(99,102,241,0.15)', color: '#a78bfa' }}>
                            {m.extraCurricularPoints}pts
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {rawMarks.length === 0 && (
            <div className="ace-card">
              <div className="ace-card-body" style={{ textAlign: 'center', padding: '48px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: '14px', margin: 0 }}>
                  No academic data recorded yet.<br />Your marks will appear here once entered by staff.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot studentId={studentData?.id} studentName={studentData?.name} />
    </div>
  );
};

export default StudentPortalComponent;