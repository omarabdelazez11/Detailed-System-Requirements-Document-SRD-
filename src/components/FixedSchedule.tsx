import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2, Edit3, BookOpen, Layers, X, Save, Search, MapPin, Calendar, Clock, User, PlusCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface CourseSession { day: string; time: string; room: string; }
interface CourseComponent { type: 'Lecture' | 'Lab' | 'Section'; frequency: number; sessions: CourseSession[]; }
interface MasterCourse { id: string; name: string; lecturer: string; components: CourseComponent[]; }

const FixedSchedule: React.FC = () => {
  const { rooms, slots } = useSettings();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const [courses, setCourses] = useState<MasterCourse[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Builder State
  const [currentCourse, setCurrentCourse] = useState({ name: '', lecturer: '' });
  const [components, setComponents] = useState<CourseComponent[]>([
    { type: 'Lecture', frequency: 1, sessions: [{ day: 'Sun', time: slots[0], room: rooms[0] }] }
  ]);

  const startEdit = (course: MasterCourse) => {
    setEditingId(course.id);
    setCurrentCourse({ name: course.name, lecturer: course.lecturer });
    setComponents(course.components.map(c => ({ ...c, sessions: [...c.sessions.map(s => ({...s}))] })));
    setIsBuilding(true);
  };

  const addComponent = () => {
    setComponents([...components, { type: 'Lab', frequency: 1, sessions: [{ day: 'Sun', time: slots[0], room: rooms[0] }] }]);
  };

  const removeComponent = (idx: number) => {
    setComponents(components.filter((_, i) => i !== idx));
  };

  const updateFrequency = (compIdx: number, freq: number) => {
    const updated = [...components];
    updated[compIdx].frequency = freq;
    const newSessions = [...updated[compIdx].sessions];
    while (newSessions.length < freq) newSessions.push({ day: 'Sun', time: slots[0], room: rooms[0] });
    updated[compIdx].sessions = newSessions.slice(0, freq);
    setComponents(updated);
  };

  const updateSession = (compIdx: number, sessIdx: number, field: keyof CourseSession, value: string) => {
    const updated = [...components];
    const updatedSessions = [...updated[compIdx].sessions];
    updatedSessions[sessIdx] = { ...updatedSessions[sessIdx], [field]: value };
    updated[compIdx].sessions = updatedSessions;
    setComponents(updated);
  };

  const handleSave = () => {
    if (!currentCourse.name) return;
    const newCourse: MasterCourse = {
      id: editingId || `C-${Date.now()}`,
      name: currentCourse.name,
      lecturer: currentCourse.lecturer,
      components: [...components]
    };

    if (editingId) {
      setCourses(courses.map(c => c.id === editingId ? newCourse : c));
    } else {
      setCourses([...courses, newCourse]);
    }
    closeBuilder();
  };

  const closeBuilder = () => {
    setIsBuilding(false);
    setEditingId(null);
    setCurrentCourse({ name: '', lecturer: '' });
    setComponents([{ type: 'Lecture', frequency: 1, sessions: [{ day: 'Sun', time: slots[0], room: rooms[0] }] }]);
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <ShieldCheck size={24} color="#3b82f6" /> Fixed Course Architect
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>Build and manage complex multi-session academic schedules.</p>
        </div>
        <button onClick={() => setIsBuilding(true)} style={newCourseBtn}><Plus size={18} /> New Course Architect</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {courses.map(course => (
          <div key={course.id} style={courseCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ background: '#3b82f611', padding: '10px', borderRadius: '12px' }}><BookOpen size={20} color="#3b82f6" /></div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => startEdit(course)} style={iconBtn}><Edit3 size={18} color="#3b82f6" /></button>
                <button onClick={() => setCourses(courses.filter(c => c.id !== course.id))} style={iconBtn}><Trash2 size={18} color="#ef4444" /></button>
              </div>
            </div>
            <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>{course.name}</h3>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.5rem' }}>{course.lecturer}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {course.components.map((comp, i) => (
                <div key={i} style={compRow}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={compBadge(comp.type)}>{comp.type}</span>
                    <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{comp.frequency}x Weekly</span>
                  </div>
                  {comp.sessions.map((sess, j) => (
                    <div key={j} style={sessDetail}>
                      <span style={{ color: 'white', fontWeight: 'bold' }}>{sess.day}</span>
                      <span style={{ color: '#3b82f6' }}>{sess.room}</span>
                      <span style={{ fontSize: '0.7rem' }}>{sess.time}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isBuilding && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3 style={{ color: 'white', margin: 0 }}>{editingId ? 'Edit Course Structure' : 'New Course Architecture'}</h3>
              <button onClick={closeBuilder} style={iconBtn}><X size={24} /></button>
            </div>

            <div style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: '1rem' }}>
              {/* CORE INFO */}
              <div style={formSection}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div><label style={labelStyle}>Course Name</label><input value={currentCourse.name} onChange={e => setCurrentCourse({...currentCourse, name: e.target.value})} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Lead Lecturer</label><input value={currentCourse.lecturer} onChange={e => setCurrentCourse({...currentCourse, lecturer: e.target.value})} style={inputStyle} /></div>
                </div>
              </div>

              {/* COMPONENTS BUILDER */}
              {components.map((comp, compIdx) => (
                <div key={compIdx} style={compBuilderCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                       <select value={comp.type} onChange={e => {
                         const updated = [...components];
                         updated[compIdx].type = e.target.value as any;
                         setComponents(updated);
                       }} style={{ ...inputStyle, width: 'auto' }}>
                         <option>Lecture</option>
                         <option>Lab</option>
                         <option>Section</option>
                       </select>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <label style={{ ...labelStyle, margin: 0 }}>Frequency:</label>
                          <input type="number" min="1" max="5" value={comp.frequency} onChange={e => updateFrequency(compIdx, parseInt(e.target.value))} style={{ ...inputStyle, width: '60px' }} />
                       </div>
                    </div>
                    <button onClick={() => removeComponent(compIdx)} style={iconBtn}><Trash2 size={16} color="#ef4444" /></button>
                  </div>

                  {/* SESSIONS FOR THIS FREQUENCY */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {comp.sessions.map((sess, sessIdx) => (
                      <div key={sessIdx} style={sessionGrid}>
                        <span style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 'bold' }}>Sess {sessIdx + 1}</span>
                        <select value={sess.day} onChange={e => updateSession(compIdx, sessIdx, 'day', e.target.value)} style={inputStyle}>
                          {daysOfWeek.map(d => <option key={d}>{d}</option>)}
                        </select>
                        <select value={sess.room} onChange={e => updateSession(compIdx, sessIdx, 'room', e.target.value)} style={inputStyle}>
                          {rooms.map(r => <option key={r}>{r}</option>)}
                        </select>
                        <select value={sess.time} onChange={e => updateSession(compIdx, sessIdx, 'time', e.target.value)} style={inputStyle}>
                          {slots.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button onClick={addComponent} style={addCompBtn}><PlusCircle size={18} /> Add Component (Lab/Section)</button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', borderTop: '1px solid #334155', paddingTop: '1.5rem' }}>
              <button onClick={handleSave} style={saveBtnStyle}>{editingId ? 'Update & Sync Schedule' : 'Finalize & Deploy'}</button>
              <button onClick={closeBuilder} style={cancelBtnStyle}>Discard Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const newCourseBtn = { background: '#3b82f6', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' };
const courseCard = { background: '#0f172a', padding: '1.5rem', borderRadius: '20px', border: '1px solid #1e293b' };
const compRow = { background: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155', marginBottom: '0.5rem' };
const sessDetail = { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', background: '#0f172a', padding: '4px 8px', borderRadius: '6px', marginTop: '4px' };
const compBadge = (type: string) => ({ background: type === 'Lecture' ? '#3b82f622' : '#a855f722', color: type === 'Lecture' ? '#3b82f6' : '#a855f7', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' });
const iconBtn = { background: 'transparent', border: 'none', cursor: 'pointer' };
const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 };
const modalContent: React.CSSProperties = { background: '#1e293b', padding: '2.5rem', borderRadius: '24px', border: '1px solid #334155', width: '95%', maxWidth: '800px' };
const formSection = { background: '#0f172a', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' };
const compBuilderCard = { background: '#0f172a', padding: '1.5rem', borderRadius: '16px', border: '1px solid #334155', marginBottom: '1rem' };
const sessionGrid = { display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1.5fr', gap: '0.75rem', alignItems: 'center' };
const inputStyle = { width: '100%', padding: '0.65rem', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '8px', fontSize: '0.85rem' };
const labelStyle = { color: '#64748b', fontSize: '0.7rem', marginBottom: '6px', display: 'block', textTransform: 'uppercase' };
const addCompBtn = { width: '100%', background: 'transparent', border: '2px dashed #334155', padding: '1rem', borderRadius: '12px', color: '#64748b', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
const saveBtnStyle = { flex: 1.5, background: '#22c55e', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const cancelBtnStyle = { flex: 1, background: '#334155', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };

export default FixedSchedule;
