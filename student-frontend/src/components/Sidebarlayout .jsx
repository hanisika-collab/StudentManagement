import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/* ── inject once ─────────────────────────────────────────── */
const STYLE_ID = 'ace-sidebar-styles';
function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

/* ── reset / base ── */
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  background: #070b14;
  font-family: 'Outfit', sans-serif;
  color: #e2e8f0;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── ambient background ── */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 50% at 15% 0%,   rgba(99,102,241,.13) 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 90% 100%, rgba(20,184,166,.08) 0%, transparent 50%),
    radial-gradient(ellipse 40% 60% at 80% 20%,  rgba(139,92,246,.07) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* ── layout shell ── */
.ace-shell {
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* ── sidebar ── */
.ace-sidebar {
  width: 240px;
  flex-shrink: 0;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  display: flex;
  flex-direction: column;
  background: rgba(8,12,24,.75);
  backdrop-filter: blur(24px) saturate(1.5);
  -webkit-backdrop-filter: blur(24px) saturate(1.5);
  border-right: 1px solid rgba(255,255,255,.07);
  z-index: 200;
  transition: transform .3s cubic-bezier(.16,1,.3,1);
  overflow: hidden;
}

/* subtle inner glow on right edge */
.ace-sidebar::after {
  content: '';
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(180deg,
    transparent 0%,
    rgba(99,102,241,.5) 30%,
    rgba(20,184,166,.4) 70%,
    transparent 100%
  );
}

/* ── logo ── */
.ace-logo {
  padding: 28px 24px 24px;
  border-bottom: 1px solid rgba(255,255,255,.06);
  flex-shrink: 0;
}
.ace-logo-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.ace-logo-icon {
  width: 34px; height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1 0%, #14b8a6 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  box-shadow: 0 4px 16px rgba(99,102,241,.4);
  flex-shrink: 0;
}
.ace-logo-text {
  font-size: 15px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -.01em;
  line-height: 1.2;
}
.ace-logo-sub {
  font-size: 10px;
  color: rgba(148,163,184,.6);
  font-weight: 400;
  font-family: 'DM Mono', monospace;
  letter-spacing: .04em;
}

/* ── user chip ── */
.ace-user-chip {
  margin: 16px 16px 0;
  padding: 10px 14px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.ace-user-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
  color: #fff; flex-shrink: 0;
}
.ace-user-name  { font-size: 12px; font-weight: 600; color: #e2e8f0; margin: 0; }
.ace-user-role  { font-size: 10px; color: rgba(148,163,184,.6); margin: 0;
                  font-family: 'DM Mono', monospace; }

/* ── nav section ── */
.ace-nav {
  flex: 1;
  padding: 20px 12px;
  overflow-y: auto;
  scrollbar-width: none;
}
.ace-nav::-webkit-scrollbar { display: none; }

.ace-nav-section-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: rgba(148,163,184,.45);
  padding: 0 12px;
  margin: 16px 0 6px;
  font-family: 'DM Mono', monospace;
}
.ace-nav-section-label:first-child { margin-top: 0; }

/* nav link */
.ace-nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: rgba(148,163,184,.8);
  font-size: 13.5px;
  font-weight: 500;
  transition: all .18s ease;
  position: relative;
  margin-bottom: 2px;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
}
.ace-nav-link:hover {
  background: rgba(255,255,255,.05);
  color: #e2e8f0;
}
.ace-nav-link.active {
  background: rgba(99,102,241,.15);
  color: #a5b4fc;
  border: 1px solid rgba(99,102,241,.25);
}
.ace-nav-link.active .ace-nav-icon { color: #818cf8; }
.ace-nav-link.active::before {
  content: '';
  position: absolute;
  left: 0; top: 25%; bottom: 25%;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(180deg, #6366f1, #14b8a6);
}
.ace-nav-icon {
  width: 16px; height: 16px;
  flex-shrink: 0;
  opacity: .8;
}
.ace-nav-badge {
  margin-left: auto;
  background: rgba(99,102,241,.25);
  color: #a5b4fc;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 20px;
  font-family: 'DM Mono', monospace;
}

/* ── logout button ── */
.ace-sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255,255,255,.06);
  flex-shrink: 0;
}
.ace-logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  border-radius: 10px;
  background: rgba(239,68,68,.08);
  border: 1px solid rgba(239,68,68,.15);
  color: rgba(252,165,165,.8);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all .18s;
  font-family: 'Outfit', sans-serif;
}
.ace-logout-btn:hover {
  background: rgba(239,68,68,.15);
  color: #fca5a5;
  border-color: rgba(239,68,68,.3);
}

/* ── main content ── */
.ace-main {
  margin-left: 240px;
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  padding: 32px 36px 80px;
  position: relative;
}

/* ── mobile: sidebar collapses ── */
@media (max-width: 768px) {
  .ace-sidebar {
    transform: translateX(-100%);
  }
  .ace-sidebar.open {
    transform: translateX(0);
  }
  .ace-main {
    margin-left: 0;
    padding: 16px 16px 80px;
  }
  .ace-mobile-toggle {
    display: flex !important;
  }
}

.ace-mobile-toggle {
  display: none;
  position: fixed;
  top: 16px; left: 16px;
  z-index: 300;
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(8,12,24,.9);
  border: 1px solid rgba(255,255,255,.1);
  align-items: center; justify-content: center;
  cursor: pointer;
  color: #e2e8f0;
}

/* ── mobile overlay ── */
.ace-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  z-index: 199;
  backdrop-filter: blur(4px);
}
.ace-overlay.visible { display: block; }

/* ── scrollbar for main content ── */
.ace-main::-webkit-scrollbar { width: 6px; }
.ace-main::-webkit-scrollbar-track { background: transparent; }
.ace-main::-webkit-scrollbar-thumb {
  background: rgba(99,102,241,.25);
  border-radius: 3px;
}

/* ── page title area ── */
.ace-page-header {
  margin-bottom: 28px;
}
.ace-page-title {
  font-size: 22px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 4px;
  letter-spacing: -.02em;
}
.ace-page-sub {
  font-size: 13px;
  color: rgba(148,163,184,.65);
  margin: 0;
  font-family: 'DM Mono', monospace;
}

/* ── glass card base (reusable across pages) ── */
.glass-card {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: border-color .2s;
}
.glass-card:hover { border-color: rgba(99,102,241,.2); }

/* ── stat card ── */
.stat-card {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 14px;
  padding: 20px;
  transition: transform .2s, border-color .2s;
}
.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(99,102,241,.25);
}
.stat-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .07em;
  text-transform: uppercase;
  color: rgba(148,163,184,.6);
  font-family: 'DM Mono', monospace;
  margin: 0 0 10px;
}
.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  letter-spacing: -.02em;
  line-height: 1;
}
.stat-sub {
  font-size: 11px;
  margin: 6px 0 0;
  color: rgba(148,163,184,.5);
}
`;
  document.head.appendChild(s);
}

/* ── SVG icons ────────────────────────────────────────────── */
const Icon = ({ d, size = 16, stroke = 'currentColor', fill = 'none', strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

/* ── nav items config ─────────────────────────────────────── */
const STAFF_NAV = [
  {
    section: 'Overview',
    items: [
      { to: '/dashboard',     label: 'Dashboard',       icon: ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'M9 22V12h6v10'] },
      { to: '/staff-profile', label: 'Staff Profile',   icon: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2', 'M12 11a4 4 0 100-8 4 4 0 000 8z'] },
    ],
  },
  {
    section: 'Students',
    items: [
      { to: '/students',   label: 'Manage Students', icon: ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', 'M23 21v-2a4 4 0 00-3-3.87', 'M16 3.13a4 4 0 010 7.75'] },
      { to: '/attendance', label: 'Mark Attendance',  icon: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11'] },
      { to: '/reports',    label: 'Reports & Export', icon: ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'] },
    ],
  },
];

const STUDENT_NAV = [
  {
    section: 'My Portal',
    items: [
      { to: '/portal', label: 'My Dashboard',      icon: ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'M9 22V12h6v10'] },
      { to: '/portal', label: 'Academic Profile',  icon: ['M22 10v6M2 10l10-5 10 5-10 5z', 'M6 12v5c3 3 9 3 12 0v-5'] },
    ],
  },
];

/* ── Component ────────────────────────────────────────────── */
export default function SidebarLayout({ children, role }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate  = useNavigate();

  useEffect(() => { injectStyles(); }, []);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const navGroups = role === 'staff' ? STAFF_NAV : STUDENT_NAV;

  const userId   = localStorage.getItem('studentId') || localStorage.getItem('staffId') || '—';
  const initials = userId.slice(0, 2).toUpperCase();
  const roleLabel = role === 'staff' ? 'Staff Member' : 'Student';

  return (
    <div className="ace-shell">
      {/* ── mobile toggle ── */}
      <button className="ace-mobile-toggle" onClick={() => setMobileOpen(o => !o)}>
        <Icon d="M3 12h18M3 6h18M3 18h18" size={18} />
      </button>

      {/* ── mobile overlay ── */}
      <div
        className={`ace-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── sidebar ── */}
      <aside className={`ace-sidebar ${mobileOpen ? 'open' : ''}`}>

        {/* Logo */}
        <div className="ace-logo">
          <Link to="/" className="ace-logo-inner">
            <div className="ace-logo-icon">🎓</div>
            <div>
              <div className="ace-logo-text">ACE Portal</div>
              <div className="ace-logo-sub">Smart Academic System</div>
            </div>
          </Link>
        </div>

        {/* User chip */}
        <div className="ace-user-chip">
          <div className="ace-user-avatar">{initials}</div>
          <div>
            <p className="ace-user-name">{userId}</p>
            <p className="ace-user-role">{roleLabel}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="ace-nav">
          {navGroups.map(group => (
            <div key={group.section}>
              <div className="ace-nav-section-label">{group.section}</div>
              {group.items.map(item => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`ace-nav-link ${location.pathname === item.to ? 'active' : ''}`}
                >
                  <span className="ace-nav-icon">
                    <Icon d={item.icon} size={16} strokeWidth={1.8} />
                  </span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="ace-sidebar-footer">
          <button className="ace-logout-btn" onClick={handleLogout}>
            <Icon d={['M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4', 'M16 17l5-5-5-5', 'M21 12H9']} size={15} strokeWidth={1.8} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── main content ── */}
      <main className="ace-main">
        {children}
      </main>
    </div>
  );
}