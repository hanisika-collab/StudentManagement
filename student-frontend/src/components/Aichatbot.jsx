import React, { useState, useEffect, useRef, useCallback } from 'react';
import StudentService from '../services/StudentService';

/* ─────────────────────────────────────────────────────────
   STYLE INJECTION  (runs once, idempotent)
───────────────────────────────────────────────────────── */
const STYLE_ID = 'ace-chatbot-v2-styles';
function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

/* ── FAB toggle ── */
.acecb-fab {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(140deg, #4f46e5 0%, #7c3aed 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 24px rgba(79,70,229,.5), 0 1px 4px rgba(0,0,0,.4);
  z-index: 99999;
  transition: transform .2s, box-shadow .2s;
}
.acecb-fab:hover {
  transform: scale(1.09);
  box-shadow: 0 8px 36px rgba(79,70,229,.65), 0 1px 4px rgba(0,0,0,.4);
}
.acecb-fab-badge {
  position: absolute;
  top: -4px; right: -4px;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid #0d0d1a;
  font-size: 10px; font-weight: 700;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* ── chat window ── */
.acecb-window {
  position: fixed;
  bottom: 100px;
  right: 32px;
  width: 390px;
  height: 580px;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  z-index: 99998;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #0d0d1a;
  border: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 32px 80px rgba(0,0,0,.75), 0 0 0 .5px rgba(255,255,255,.05) inset;
  animation: acecb-rise .28s cubic-bezier(.16,1,.3,1);
}
@media (max-width: 520px) {
  .acecb-window { right: 12px; left: 12px; width: auto; height: 68vh; bottom: 82px; }
  .acecb-fab    { right: 16px; bottom: 20px; }
}
@keyframes acecb-rise {
  from { opacity:0; transform:translateY(14px) scale(.97); }
  to   { opacity:1; transform:translateY(0)     scale(1);  }
}

/* ── header ── */
.acecb-header {
  padding: 14px 18px;
  display: flex; align-items: center; gap: 12px;
  background: rgba(79,70,229,.1);
  border-bottom: 1px solid rgba(255,255,255,.07);
  flex-shrink: 0;
}
.acecb-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(140deg,#4f46e5,#7c3aed);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
  box-shadow: 0 0 10px rgba(124,58,237,.5);
}
.acecb-hname { font-size: 13px; font-weight: 700; color: #f1f5f9; margin: 0; }
.acecb-hsub  { font-size: 11px; color: rgba(148,163,184,.7); margin: 0; }
.acecb-pulse {
  width: 7px; height: 7px; border-radius: 50%;
  background: #22c55e; margin-left: auto; flex-shrink: 0;
  box-shadow: 0 0 6px #22c55e;
  animation: acecb-blink 2.2s ease infinite;
}
@keyframes acecb-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
.acecb-close {
  background: none; border: none;
  color: rgba(148,163,184,.5); font-size: 22px;
  cursor: pointer; line-height: 1; padding: 0 0 0 8px;
  transition: color .15s;
}
.acecb-close:hover { color: #f1f5f9; }

/* ── messages ── */
.acecb-msgs {
  flex: 1; overflow-y: auto; padding: 16px;
  display: flex; flex-direction: column; gap: 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(79,70,229,.3) transparent;
}
.acecb-msgs::-webkit-scrollbar       { width: 4px; }
.acecb-msgs::-webkit-scrollbar-thumb { background: rgba(79,70,229,.35); border-radius: 4px; }

.acecb-bubble-user {
  align-self: flex-end;
  background: linear-gradient(135deg,#4f46e5,#7c3aed);
  color: #fff; padding: 10px 14px;
  border-radius: 16px 16px 3px 16px;
  max-width: 78%; font-size: 13px; line-height: 1.55;
  box-shadow: 0 3px 10px rgba(79,70,229,.35);
}
.acecb-bubble-ai {
  align-self: flex-start;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  color: rgba(241,245,249,.88);
  padding: 10px 14px;
  border-radius: 16px 16px 16px 3px;
  max-width: 86%; font-size: 13px; line-height: 1.65;
}
.acecb-bubble-ai strong { color: #a78bfa; }
.acecb-bubble-ai em     { color: rgba(167,139,250,.75); }
.acecb-bubble-ai ul, .acecb-bubble-ai ol { padding-left: 17px; margin: 5px 0; }
.acecb-bubble-ai li     { margin: 3px 0; }
.acecb-bubble-ai code   {
  background: rgba(0,0,0,.4); padding: 1px 5px;
  border-radius: 4px; font-size: 12px;
  font-family: 'Courier New', monospace;
}
.acecb-time {
  font-size: 10px; color: rgba(255,255,255,.22);
  text-align: center; margin: 2px 0;
}

/* ── typing indicator ── */
.acecb-typing {
  align-self: flex-start;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.07);
  padding: 11px 15px;
  border-radius: 16px 16px 16px 3px;
  display: flex; gap: 5px; align-items: center;
}
.acecb-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(167,139,250,.7);
  animation: acecb-bounce 1.1s ease infinite;
}
.acecb-dot:nth-child(2) { animation-delay: .18s; }
.acecb-dot:nth-child(3) { animation-delay: .36s; }
@keyframes acecb-bounce {
  0%,60%,100%{ transform:translateY(0);  }
  30%        { transform:translateY(-6px); }
}

/* ── suggestion chips ── */
.acecb-chips {
  display: flex; flex-wrap: wrap; gap: 6px;
  padding: 0 16px 10px;
}
.acecb-chip {
  background: rgba(79,70,229,.13);
  border: 1px solid rgba(79,70,229,.3);
  color: rgba(167,139,250,.9);
  border-radius: 20px; padding: 5px 11px;
  font-size: 11px; font-weight: 500;
  cursor: pointer; transition: all .2s;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.acecb-chip:hover { background: rgba(79,70,229,.27); color: #c4b5fd; }

/* ── input row ── */
.acecb-input-row {
  padding: 12px 14px;
  border-top: 1px solid rgba(255,255,255,.06);
  background: rgba(0,0,0,.22);
  display: flex; gap: 9px; align-items: flex-end;
  flex-shrink: 0;
}
.acecb-textarea {
  flex: 1;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 11px;
  color: #f1f5f9; padding: 9px 13px;
  font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif;
  resize: none; outline: none; line-height: 1.5;
  max-height: 96px; transition: border-color .2s;
}
.acecb-textarea:focus       { border-color: rgba(79,70,229,.55); }
.acecb-textarea::placeholder { color: rgba(148,163,184,.38); }
.acecb-send {
  width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg,#4f46e5,#7c3aed);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: opacity .2s, transform .1s;
  box-shadow: 0 3px 10px rgba(79,70,229,.4);
}
.acecb-send:hover:not(:disabled) { opacity: .85; }
.acecb-send:active:not(:disabled){ transform: scale(.92); }
.acecb-send:disabled { opacity: .32; cursor: not-allowed; }
`;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────────────────
   MINI MARKDOWN → HTML
───────────────────────────────────────────────────────── */
function mdToHtml(txt) {
  return txt
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^### (.+)$/gm, '<strong style="display:block;margin:8px 0 2px;color:#c4b5fd">$1</strong>')
    .replace(/^## (.+)$/gm,  '<strong style="display:block;margin:10px 0 3px;color:#e2e8f0">$1</strong>')
    .replace(/^[-•] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)(?=<li>|$)/g, '<ul>$1</ul>')
    .replace(/\n{2,}/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

/* ─────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────── */
const AIChatbot = ({ studentId, studentName }) => {
  const [open,   setOpen]   = useState(false);
  const [msgs,   setMsgs]   = useState([]);
  const [input,  setInput]  = useState('');
  const [busy,   setBusy]   = useState(false);
  const [unread, setUnread] = useState(0);
  const [ctx,    setCtx]    = useState(null);

  const bottomRef = useRef(null);
  const taRef     = useRef(null);

  useEffect(() => { injectStyles(); }, []);

  /* ── load student context ── */
  useEffect(() => {
    if (!studentId) return;
    Promise.all([
      StudentService.getStudentById(studentId).catch(() => null),
      StudentService.getStudentMarks(studentId).catch(() => ({ data: [] })),
      StudentService.getAttendanceByStudent(studentId).catch(() => ({ data: [] })),
    ]).then(([sRes, mRes, aRes]) => {
      const s  = sRes?.data;
      const mk = mRes?.data ?? [];
      const at = aRes?.data ?? [];
      const present = at.filter(a => a.status === 'Present').length;
      const attPct  = at.length ? ((present / at.length) * 100).toFixed(1) : 'N/A';
      const avgInt  = mk.length ? (mk.reduce((a, m) => a + m.internalMarks,  0) / mk.length).toFixed(1) : 0;
      const avgExt  = mk.length ? (mk.reduce((a, m) => a + m.externalMarks, 0) / mk.length).toFixed(1) : 0;
      const subjects = mk.map(m =>
        `${m.subject}(${m.semester}): int=${m.internalMarks}/40 ext=${m.externalMarks}/60 extra=${m.extraCurricularPoints}pts`
      ).join('; ') || 'none recorded yet';
      setCtx({
        name: s?.name ?? studentName ?? 'Student',
        dept: s?.department ?? '',
        goal: s?.currentGoal ?? 'not set',
        attPct, avgInt, avgExt, subjects,
        total: mk.length,
      });
    });
  }, [studentId, studentName]);

  /* ── welcome message ── */
  const addAI = useCallback((text) => {
    setMsgs(prev => [...prev, { role: 'assistant', text, t: now() }]);
  }, []);

  useEffect(() => {
    if (open && msgs.length === 0 && ctx) {
      addAI(
        `Hi ${ctx.name}! 👋 I'm your **ACE AI Study Assistant**.\n\n` +
        `I've loaded your academic profile — **${ctx.total} subjects** tracked, ` +
        `attendance at **${ctx.attPct}%**, goal: *"${ctx.goal}"*.\n\n` +
        `Ask me anything — study plans, subject doubts, career guidance, or performance insights!`
      );
    }
    if (open) setUnread(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ctx]);

  /* ── scroll ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, busy]);

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  /* ── system prompt ── */
  const systemPrompt = () => {
    if (!ctx) return 'You are a helpful academic assistant.';
    return `You are ACE AI, a concise, warm, and empathetic academic advisor at ACE Engineering College.

STUDENT PROFILE (use this to personalise every answer):
- Name: ${ctx.name}  |  Department: ${ctx.dept}
- Goal: ${ctx.goal}
- Attendance: ${ctx.attPct}%
- Avg Internal Marks: ${ctx.avgInt}/40  |  Avg External Marks: ${ctx.avgExt}/60
- Subjects recorded: ${ctx.subjects}

BEHAVIOURAL RULES:
1. Always personalise — never give generic answers.
2. Flag weak areas: internal < 20 → push assignments/tests; external < 30 → past-exam strategy; attendance < 75 → attendance warning.
3. Keep responses under 180 words unless a detailed step-by-step is necessary.
4. Use bullet points for multi-step advice. Use **bold** for key terms.
5. Celebrate strengths as well as flagging weaknesses.
6. For career/placement queries, align to their goal ("${ctx.goal}") and department ("${ctx.dept}").`;
  };

  /* ── send message ── */
  const send = async (text = input) => {
    const q = text.trim();
    if (!q || busy) return;
    setInput('');
    const history = [...msgs, { role: 'user', text: q, t: now() }];
    setMsgs(history);
    setBusy(true);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt(),
          messages: history.map(m => ({ role: m.role, content: m.text })),
        }),
      });
      const data  = await res.json();
      const reply = data.content?.find(b => b.type === 'text')?.text
                 ?? 'Sorry, I could not generate a response right now.';
      addAI(reply);
      if (!open) setUnread(u => u + 1);
    } catch {
      addAI('⚠️ Network error — please check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const onKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const CHIPS = ['How am I doing overall?', 'Plan for weak subjects', 'Career tips', 'Improve attendance'];

  /* ─────── render ─────── */
  return (
    <>
      {/* ─── Chat window ─── */}
      {open && (
        <div className="acecb-window">
          {/* Header */}
          <div className="acecb-header">
            <div className="acecb-avatar">🤖</div>
            <div>
              <p className="acecb-hname">ACE AI Assistant</p>
              <p className="acecb-hsub">Personalised for {ctx?.name ?? studentName ?? 'you'}</p>
            </div>
            <div className="acecb-pulse" />
            <button className="acecb-close" onClick={() => setOpen(false)}>×</button>
          </div>

          {/* Messages */}
          <div className="acecb-msgs">
            {msgs.map((m, i) => (
              <React.Fragment key={i}>
                {(i === 0 || msgs[i - 1].t !== m.t) && (
                  <div className="acecb-time">{m.t}</div>
                )}
                {m.role === 'user'
                  ? <div className="acecb-bubble-user">{m.text}</div>
                  : <div className="acecb-bubble-ai"
                         dangerouslySetInnerHTML={{ __html: mdToHtml(m.text) }} />
                }
              </React.Fragment>
            ))}
            {busy && (
              <div className="acecb-typing">
                <div className="acecb-dot" />
                <div className="acecb-dot" />
                <div className="acecb-dot" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick chips — first turn only */}
          {msgs.length <= 1 && (
            <div className="acecb-chips">
              {CHIPS.map(c => (
                <button key={c} className="acecb-chip" onClick={() => send(c)}>{c}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="acecb-input-row">
            <textarea
              ref={taRef}
              className="acecb-textarea"
              rows={1}
              placeholder="Ask anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
            />
            <button
              className="acecb-send"
              onClick={() => send()}
              disabled={!input.trim() || busy}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13"      stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ─── FAB ─── */}
      <button
        className="acecb-fab"
        onClick={() => { setOpen(o => !o); setUnread(0); }}
        title="Chat with ACE AI"
      >
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M21 15C21 15.53 20.79 16.04 20.41 16.41C20.04 16.79 19.53 17 19 17H7L3 21V5C3 4.47 3.21 3.96 3.59 3.59C3.96 3.21 4.47 3 5 3H19C19.53 3 20.04 3.21 20.41 3.59C20.79 3.96 21 4.47 21 5V15Z"
                    stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        }
        {unread > 0 && !open && (
          <span className="acecb-fab-badge">{unread}</span>
        )}
      </button>
    </>
  );
};

export default AIChatbot;