import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, NavLink } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './store/auth.js';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import StudentDashboard from './pages/dashboards/StudentDashboard.jsx';
import InstructorDashboard from './pages/dashboards/InstructorDashboard.jsx';
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';
import ExamList from './pages/Exams/ExamList.jsx';
import CreateExam from './pages/Exams/CreateExam.jsx';
import AddQuestions from './pages/Exams/AddQuestions.jsx';
import AttemptExam from './pages/Exams/AttemptExam.jsx';
import ResultPage from './pages/Results/ResultPage.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Home from './pages/public/Home.jsx';
import About from './pages/public/About.jsx';
import Contact from './pages/public/Contact.jsx';
import Study from './pages/public/Study.jsx';
import StudyLanguage from './pages/public/StudyLanguage.jsx';
import { Toaster } from 'react-hot-toast';
import Profile from './pages/account/Profile.jsx';
import Settings from './pages/account/Settings.jsx';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const profileRef = useRef(null);
  const langs = [
    { id: 'javascript', title: 'JavaScript' },
    { id: 'typescript', title: 'TypeScript' },
    { id: 'python', title: 'Python' },
    { id: 'java', title: 'Java' },
    { id: 'cpp', title: 'C++' },
    { id: 'csharp', title: 'C#' },
    { id: 'go', title: 'Go' },
    { id: 'ruby', title: 'Ruby' },
    { id: 'php', title: 'PHP' },
    { id: 'rust', title: 'Rust' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved ? saved === 'dark' : false;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  // Close profile dropdown on outside click or Escape
  useEffect(() => {
    const onClick = (e) => {
      if (!profileOpen) return;
      const el = profileRef.current;
      if (el && !el.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [profileOpen]);

  const dashboardPath = user?.role === 'admin' ? '/admin' : user?.role === 'instructor' ? '/instructor' : '/student';

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Left: Brand */}
          <div className="shrink-0">
            <Link className="text-xl font-semibold text-brand-700 dark:text-brand-100" to="/">Exam System</Link>
          </div>
          {/* Mobile toggle */}
          <button
            className="md:hidden ml-auto p-2 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
            aria-label="Toggle navigation"
            onClick={() => setOpen(o => !o)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          </button>
          {/* Center: Primary nav */}
          <nav className="mx-auto hidden md:flex items-center gap-6 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) => isActive ? 'text-brand-700 dark:text-brand-200 font-semibold border-b-2 border-brand-600 pb-1' : 'text-gray-600 dark:text-gray-300 hover:text-brand-700 dark:hover:text-brand-200'}
            >Home</NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => isActive ? 'text-brand-700 dark:text-brand-200 font-semibold border-b-2 border-brand-600 pb-1' : 'text-gray-600 dark:text-gray-300 hover:text-brand-700 dark:hover:text-brand-200'}
            >About Us</NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => isActive ? 'text-brand-700 dark:text-brand-200 font-semibold border-b-2 border-brand-600 pb-1' : 'text-gray-600 dark:text-gray-300 hover:text-brand-700 dark:hover:text-brand-200'}
            >Contact Us</NavLink>
            <div className="relative group">
              <NavLink
                to="/study"
                className={({ isActive }) =>
                  (isActive ? 'text-brand-700 dark:text-brand-200 font-semibold border-b-2 border-brand-600 pb-1' : 'text-gray-600 dark:text-gray-300 hover:text-brand-700 dark:hover:text-brand-200') + ' inline-flex items-center gap-1'}
              >
                Study
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.207l3.71-2.976a.75.75 0 111.06 1.06l-4.24 3.4a.75.75 0 01-.94 0l-4.24-3.4a.75.75 0 01-.02-1.06z" clipRule="evenodd" /></svg>
              </NavLink>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute left-0 mt-2 w-56 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-2 grid grid-cols-1 gap-1 z-50">
                {langs.map(l => (
                  <Link key={l.id} className="px-2 py-1.5 rounded text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800" to={`/study/${l.id}`}>{l.title}</Link>
                ))}
              </div>
            </div>
          </nav>
          {/* Right: Auth controls */}
          <div className="ml-auto hidden md:flex items-center gap-3">
            <button title="Toggle theme" onClick={toggleTheme} className="p-2 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
              {dark ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M21.64 13A9 9 0 1111 2.36 7 7 0 0021.64 13z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 18a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm0-14a1 1 0 011-1V1a1 1 0 10-2 0v2a1 1 0 011 1zm8 7a1 1 0 011 1h2a1 1 0 100-2h-2a1 1 0 01-1 1zM3 12a1 1 0 01-1-1H0a1 1 0 100 2h2a1 1 0 011-1zm13.657 6.243a1 1 0 011.414 0l1.414 1.414a1 1 0 01-1.414 1.414L16.657 19.657a1 1 0 010-1.414zM4.929 5.757a1 1 0 010-1.414L3.515 2.929A1 1 0 112.1 4.343l1.414 1.414a1 1 0 011.414 0zm12.728-2.828a1 1 0 011.414 0l1.414 1.414A1 1 0 0119.071 5.757L17.657 4.343a1 1 0 010-1.414zM5.757 19.071a1 1 0 010 1.414L4.343 21.9A1 1 0 112.929 20.485l1.414-1.414a1 1 0 011.414 0z"/></svg>
              )}
            </button>
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  aria-label="Account menu"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen(o=>!o)}
                  className="flex items-center gap-2 p-1 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold">
                    {(user.name || user.email || '?').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-600 dark:text-gray-300"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.21l3.71-2.98a.75.75 0 111.06 1.14l-4.24 3.4a.75.75 0 01-.94 0l-4.24-3.4a.75.75 0 01-.02-1.16z" clipRule="evenodd"/></svg>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-50">
                    <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800">
                      <div className="font-medium truncate">{user.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</div>
                    </div>
                    <Link
                      to={dashboardPath}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                      <span>My Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 9a7 7 0 0114 0H5z"/></svg>
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.14,12.94a7.43,7.43,0,0,0,.06-1,7.43,7.43,0,0,0-.06-1l2.11-1.65a.5.5,0,0,0,.12-.65l-2-3.46a.5.5,0,0,0-.6-.22l-2.49,1a7.26,7.26,0,0,0-1.73-1l-.38-2.65A.5.5,0,0,0,13,1H11a.5.5,0,0,0-.5.42L10.12,4.07a7.26,7.26,0,0,0-1.73,1l-2.49-1a.5.5,0,0,0-.6.22l-2,3.46a.5.5,0,0,0,.12.65L5.6,10a7.43,7.43,0,0,0-.06,1,7.43,7.43,0,0,0,.06,1L3.49,13.65a.5.5,0,0,0-.12.65l2,3.46a.5.5,0,0,0,.6.22l2.49-1a7.26,7.26,0,0,0,1.73,1l.38,2.65A.5.5,0,0,0,11,23h2a.5.5,0,0,0,.5-.42l.38-2.65a7.26,7.26,0,0,0,1.73-1l2.49,1a.5.5,0,0,0,.6-.22l2-3.46a.5.5,0,0,0-.12-.65ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
                      <span>Settings</span>
                    </Link>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => { setProfileOpen(false); setShowLogout(true); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9z"/><path d="M20 3h-8a1 1 0 00-1 1v3h2V5h7v14h-7v-2h-2v3a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1z"/></svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link className="link" to="/login">Login</Link>
                <Link className="btn btn-primary" to="/signup">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t bg-white dark:bg-gray-900 transition-opacity duration-200 ease-out">
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
            <nav className="flex flex-col gap-2 text-sm">
              <NavLink
                to="/"
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) => isActive ? 'text-brand-700 dark:text-brand-200 font-semibold' : 'text-gray-700 dark:text-gray-200'}
              >Home</NavLink>
              <NavLink
                to="/about"
                onClick={() => setOpen(false)}
                className={({ isActive }) => isActive ? 'text-brand-700 dark:text-brand-200 font-semibold' : 'text-gray-700 dark:text-gray-200'}
              >About Us</NavLink>
              <NavLink
                to="/contact"
                onClick={() => setOpen(false)}
                className={({ isActive }) => isActive ? 'text-brand-700 dark:text-brand-200 font-semibold' : 'text-gray-700 dark:text-gray-200'}
              >Contact Us</NavLink>
              <NavLink
                to="/study"
                onClick={() => setOpen(false)}
                className={({ isActive }) => isActive ? 'text-brand-700 dark:text-brand-200 font-semibold' : 'text-gray-700 dark:text-gray-200'}
              >Study</NavLink>
              {/* Mobile language list */}
              <div className="pl-3 grid grid-cols-2 gap-2">
                {langs.map(l => (
                  <Link key={l.id} to={`/study/${l.id}`} onClick={() => setOpen(false)} className="px-2 py-1 rounded text-xs border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">{l.title}</Link>
                ))}
              </div>
            </nav>
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{user.name} · {user.role}</div>
                  <button className="btn btn-primary" onClick={() => { setOpen(false); setShowLogout(true); }}>Logout</button>
                </>
              ) : (
                <>
                  <Link className="btn btn-primary" to="/login" onClick={() => setOpen(false)}>Login</Link>
                  <Link className="btn" to="/signup" onClick={() => setOpen(false)}>Sign up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLogout(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Logout?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">You will be signed out of your session.</p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button className="btn" onClick={() => setShowLogout(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setShowLogout(false); logout(); navigate('/'); }}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/study" element={<Study />} />
          <Route path="/study/:id" element={<StudyLanguage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Student */}
          <Route element={<ProtectedRoute roles={["student","admin"]} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/exams" element={<ExamList />} />
            <Route path="/exams/:id/attempt" element={<AttemptExam />} />
            <Route path="/exams/:id/results/:studentId" element={<ResultPage />} />
            <Route path="/exams/:id/leaderboard" element={<Leaderboard />} />
          </Route>

          {/* Instructor */}
          <Route element={<ProtectedRoute roles={['instructor','admin']} />}> 
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/instructor/exams/create" element={<CreateExam />} />
            <Route path="/instructor/exams/:id/questions" element={<AddQuestions />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute roles={['admin']} />}> 
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Account */}
          <Route element={<ProtectedRoute roles={['student','instructor','admin']} />}> 
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<div className="text-center text-gray-600">Not Found</div>} />
        </Routes>
      </main>
      <footer className="border-t bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 text-sm">
            <div className="col-span-1 lg:col-span-2">
              <div className="text-xl font-semibold text-brand-700 dark:text-brand-200">Exam System</div>
              <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md">
                A modern platform to create, schedule, and take exams with ease. Built for students, instructors, and admins.
              </p>
              <div className="mt-4 flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <a className="hover:text-brand-700" href="#" aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22 5.75a8.38 8.38 0 01-2.36.65 4.12 4.12 0 001.81-2.27 8.22 8.22 0 01-2.61 1 4.1 4.1 0 00-7 3.74 11.65 11.65 0 01-8.46-4.29 4.1 4.1 0 001.27 5.48 4.05 4.05 0 01-1.86-.52v.05a4.1 4.1 0 003.29 4 4.11 4.11 0 01-1.85.07 4.1 4.1 0 003.83 2.85A8.23 8.23 0 012 18.07a11.62 11.62 0 006.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.54A8.18 8.18 0 0022 5.75z"/></svg>
                </a>
                <a className="hover:text-brand-700" href="#" aria-label="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.17-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0112 7.08c.85 0 1.71.12 2.5.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.95-2.33 4.81-4.55 5.07.36.32.69.95.69 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.03 10.03 0 0022 12.26C22 6.58 17.52 2 12 2z" clipRule="evenodd"/></svg>
                </a>
                <a className="hover:text-brand-700" href="#" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.1c.5-1 1.8-2.2 3.8-2.2 4.1 0 4.9 2.7 4.9 6.2V24h-4v-7.1c0-1.7 0-3.8-2.3-3.8-2.3 0-2.6 1.8-2.6 3.7V24h-4V8z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">Quick Links</div>
              <nav className="mt-3 grid gap-2 text-gray-600 dark:text-gray-300">
                <NavLink to="/" end className={({isActive})=> isActive? 'text-brand-700 font-semibold' : 'hover:text-brand-700'}>Home</NavLink>
                <NavLink to="/study" className={({isActive})=> isActive? 'text-brand-700 font-semibold' : 'hover:text-brand-700'}>Study</NavLink>
                <NavLink to="/about" className={({isActive})=> isActive? 'text-brand-700 font-semibold' : 'hover:text-brand-700'}>About</NavLink>
                <NavLink to="/contact" className={({isActive})=> isActive? 'text-brand-700 font-semibold' : 'hover:text-brand-700'}>Contact</NavLink>
              </nav>
            </div>

            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">Resources</div>
              <ul className="mt-3 grid gap-2 text-gray-600 dark:text-gray-300">
                <li><a className="hover:text-brand-700" href="#">Docs</a></li>
                <li><a className="hover:text-brand-700" href="#">API</a></li>
                <li><a className="hover:text-brand-700" href="#">Guides</a></li>
                <li><a className="hover:text-brand-700" href="#">Blog</a></li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">Support</div>
              <ul className="mt-3 grid gap-2 text-gray-600 dark:text-gray-300">
                <li><a className="hover:text-brand-700" href="#">Help Center</a></li>
                <li><a className="hover:text-brand-700" href="#">Status</a></li>
                <li><a className="hover:text-brand-700" href="#">Privacy</a></li>
                <li><a className="hover:text-brand-700" href="#">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>© {new Date().getFullYear()} Exam System. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-brand-700">Privacy</a>
              <a href="#" className="hover:text-brand-700">Terms</a>
              <a href="#" className="hover:text-brand-700">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
