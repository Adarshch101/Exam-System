import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../../components/Reveal.jsx';

export default function Home() {
  const reviews = useMemo(() => ([
    { name: 'Aarav Sharma', rating: 4.5, text: 'Clean UI and smooth exam experience. The timer and autosave gave me confidence.' },
    { name: 'Priya Desai', rating: 5, text: 'Loved the instant results and detailed answers. Helped me identify weak areas quickly.' },
    { name: 'Rahul Verma', rating: 4, text: 'Creating exams was straightforward. Adding MCQs was quick and intuitive.' },
  ]), []);
  const [idx, setIdx] = useState(0);
  const [previewRole, setPreviewRole] = useState('Student');
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [reviews.length]);

  return (
    <div className="space-y-14">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-indigo-600 to-sky-600 text-white z-0 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-0">
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-15 z-0">
          <img
            src="https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?q=80&w=2400&auto=format&fit=crop"
            alt="Study background"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Soft angle overlay to add color variation */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/10 z-0" />
        {/* Radial glow accents */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl z-0" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl z-0" />
        <div className="relative z-10 px-6 md:px-12 py-16 grid md:grid-cols-2 gap-8 items-center">
          <Reveal>
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/90">
                <span className="h-2 w-2 rounded-full bg-emerald-300" /> New • Smarter Exams
              </div>
              {/* Gradient heading with 4+ colors */}
              <h1
                className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight gradient-text-moving drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
              >
                Master Exams with Confidence
              </h1>
              <p className="mt-4 text-brand-100 max-w-xl">Create, attempt, and analyze exams in a delightful, streamlined experience. Role-based dashboards for Students, Instructors, and Admins.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login" className="btn btn-primary">Get Started</Link>
                <Link to="/study" className="btn bg-white/90 text-brand-700">Explore Study</Link>
              </div>
            </div>
          </Reveal>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                {['Student','Instructor','Admin'].map(r => (
                  <button
                    key={r}
                    onClick={()=>setPreviewRole(r)}
                    className={`px-3 py-1 rounded-full text-xs border ${previewRole===r ? 'bg-white text-brand-700 border-white' : 'bg-white/10 text-white border-white/30'}`}
                  >{r}</button>
                ))}
              </div>
              {/* Mini dashboard preview card */}
              <div className="rounded-lg overflow-hidden bg-white text-gray-900 shadow-2xl">
                <div className="px-4 py-3 border-b bg-gradient-to-r from-indigo-600 to-sky-600 text-white">
                  <div className="text-sm opacity-90">{previewRole} Dashboard</div>
                  <div className="text-lg font-semibold">Quick Overview</div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-md p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl">
                    <div className="text-gray-500 text-xs">Exams</div>
                    <div className="text-xl dark:text-white font-bold">12</div>
                  </div>
                  <div className="rounded-md p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl">
                    <div className="text-gray-500 text-xs">Attempts</div>
                    <div className="text-xl dark:text-white font-bold">37</div>
                  </div>
                  <div className="rounded-md p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl">
                    <div className="text-gray-500 text-xs">Avg. Score</div>
                    <div className="text-xl dark:text-white font-bold">78%</div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  {previewRole === 'Student' && (
                    <ul className="text-sm divide-y">
                      <li className="py-2 flex justify-between"><span>Algebra Basics</span><span className="text-gray-500">Due today</span></li>
                      <li className="py-2 flex justify-between"><span>Physics MCQ</span><span className="text-gray-500">Opens 6pm</span></li>
                      <li className="py-2 flex justify-between"><span>Chemistry Quiz</span><span className="text-gray-500">Completed</span></li>
                    </ul>
                  )}
                  {previewRole === 'Instructor' && (
                    <ul className="text-sm divide-y">
                      <li className="py-2 flex justify-between"><span>Create New Exam</span><span className="text-gray-500">Action</span></li>
                      <li className="py-2 flex justify-between"><span>Results: Midterm</span><span className="text-gray-500">View</span></li>
                      <li className="py-2 flex justify-between"><span>Add Questions</span><span className="text-gray-500">Pending</span></li>
                    </ul>
                  )}
                  {previewRole === 'Admin' && (
                    <ul className="text-sm divide-y">
                      <li className="py-2 flex justify-between"><span>Users</span><span className="text-gray-500">1,248</span></li>
                      <li className="py-2 flex justify-between"><span>Active Exams</span><span className="text-gray-500">34</span></li>
                      <li className="py-2 flex justify-between"><span>Submissions (24h)</span><span className="text-gray-500">512</span></li>
                    </ul>
                  )}
                </div>
              </div>
              <div className="mt-3 text-xs text-white/80">Preview only · Sign in to access your full dashboard</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6">
        {/* Students - gradient feature */}
        <Reveal>
        <Link to="/study" className="block relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br from-brand-600 to-brand-700 shadow-2xl cursor-pointer" title="Explore Study">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M11.7 2.04a1 1 0 01.6 0l8 2.5a1 1 0 010 1.92l-8 2.5a1 1 0 01-.6 0l-8-2.5a1 1 0 010-1.92l8-2.5zM3 9.25l7.7 2.4v4.26A7.01 7.01 0 017 21H5a1 1 0 01-1-1V9.25zm18 0V20a1 1 0 01-1 1h-2a7.01 7.01 0 01-3.7-5.09v-4.26L21 9.25z"/>
              </svg>
            </span>
            <div className="font-semibold text-white/90">Students</div>
          </div>
          <h3 className="text-lg font-semibold mt-3">Timed Exams & Instant Results</h3>
          <p className="text-white/80 mt-2 text-sm">Attempt exams with autosave, timer, and detailed feedback after submission.</p>
        </Link>
        </Reveal>

        {/* Instructors - gradient card */}
        <Reveal delay={120}>
        <Link to="/instructor/exams/create" className="block relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl cursor-pointer" title="Create Exam">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4 4h11a1 1 0 011 1v2H3V5a1 1 0 011-1zm-1 6h16v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9zm9 2H8a1 1 0 100 2h4a1 1 0 100-2z"/></svg>
            </span>
            <div className="font-semibold text-white/90">Instructors</div>
          </div>
          <h3 className="text-lg font-semibold mt-3">Create Exams & Add Questions</h3>
          <p className="text-sm text-white/80 mt-2">Design MCQ exams, schedule sessions, and analyze performance trends.</p>
        </Link>
        </Reveal>

        {/* Admins - gradient card */}
        <Reveal delay={240}>
        <Link to="/admin" className="block relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br from-rose-500 to-pink-600 shadow-2xl cursor-pointer" title="Admin Dashboard">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2l7 4v6c0 5-3.5 9.74-7 10-3.5-.26-7-5-7-10V6l7-4zm0 6a2 2 0 100 4 2 2 0 000-4z"/></svg>
            </span>
            <div className="font-semibold text-white/90">Admins</div>
          </div>
          <h3 className="text-lg font-semibold mt-3">Manage Users & Governance</h3>
          <p className="text-sm text-white/80 mt-2">Oversee users and exams with role-based controls and visibility.</p>
        </Link>
        </Reveal>
      </section>

      {/* Vision & Mission */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 shadow-2xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5V17h-2v-1.5H8.5V14H11v-2H9v-1.5h2V9h2v1.5h2V12h-2v2h2.5v1.5H13z"/></svg>
            </span>
            <h3
              className="text-lg font-extrabold gradient-text-moving drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]"
            >
              Our Vision
            </h3>
          </div>
          <p className="mt-2 text-white/90 text-sm">To empower learners and educators with an intuitive platform that makes assessments fair, fast, and insightful.</p>
          <ul className="mt-3 text-white/90 text-sm space-y-1 list-disc pl-5">
            <li>Accessible assessments for every learner</li>
            <li>Insightful analytics to improve outcomes</li>
            <li>Reliable, fast, and secure at scale</li>
          </ul>
          <div className="mt-3">
            <Link to="/about" className="inline-flex items-center gap-1 text-sm bg-white/20 px-3 py-1.5 rounded-md">Learn more <span>→</span></Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 shadow-2xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3 12l7-9 2 3 9 12H3z"/></svg>
            </span>
            <h3
              className="text-lg font-extrabold gradient-text-moving drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]"
            >
              Our Mission
            </h3>
          </div>
          <p className="mt-2 text-white/90 text-sm">To deliver a delightful exam experience with robust tools for creating, attempting, and analyzing results across roles.</p>
          <ul className="mt-3 text-white/90 text-sm space-y-1 list-disc pl-5">
            <li>Delightful UX for students, instructors, and admins</li>
            <li>Powerful creation tools and question management</li>
            <li>Instant results with transparent feedback</li>
          </ul>
          <div className="mt-3">
            <Link to="/contact" className="inline-flex items-center gap-1 text-sm bg-white/20 px-3 py-1.5 rounded-md">Work with us <span>→</span></Link>
          </div>
        </div>
      </section>

      {/* Reviews Slider */}
      <section className="card shadow-2xl">
        <Reveal>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">What students say</h2>
          <div className="flex gap-2">
            <button aria-label="Previous review" className="btn" onClick={() => setIdx((i)=> (i-1+reviews.length)%reviews.length)}>&larr;</button>
            <button aria-label="Next review" className="btn" onClick={() => setIdx((i)=> (i+1)%reviews.length)}>&rarr;</button>
          </div>
        </div>
        </Reveal>
        {(() => {
          const r = reviews[idx];
          const full = Math.floor(r.rating);
          const half = r.rating % 1 >= 0.5;
          const stars = Array.from({ length: 5 }).map((_, i) => {
            const filled = i < full;
            const isHalf = !filled && i === full && half;
            return (
              <span key={i} className="text-yellow-500">
                {filled ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10.95 13.9a1 1 0 00-1.175 0l-2.435 1.683c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.705 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ) : isHalf ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><defs><linearGradient id="half"><stop offset="50%" stopColor="currentColor"/><stop offset="50%" stopColor="transparent"/></linearGradient></defs><path fill="url(#half)" stroke="currentColor" d="M11.48 3.499a.75.75 0 011.04.42l1.26 3.58a.75.75 0 00.71.5h3.77a.75.75 0 01.44 1.36l-3.05 2.27a.75.75 0 00-.27.84l1.16 3.6a.75.75 0 01-1.13.86l-3.17-2.17a.75.75 0 00-.85 0l-3.17 2.17a.75.75 0 01-1.13-.86l1.16-3.6a.75.75 0 00-.27-.84l-3.05-2.27a.75.75 0 01.44-1.36h3.77a.75.75 0 00.71-.5l1.26-3.58z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-gray-300 dark:text-gray-600"><path d="M11.48 3.499a.75.75 0 011.04.42l1.26 3.58a.75.75 0 00.71.5h3.77a.75.75 0 01.44 1.36l-3.05 2.27a.75.75 0 00-.27.84l1.16 3.6a.75.75 0 01-1.13.86l-3.17-2.17a.75.75 0 00-.85 0l-3.17 2.17a.75.75 0 01-1.13-.86l1.16-3.6a.75.75 0 00-.27-.84l-3.05-2.27a.75.75 0 01.44-1.36h3.77a.75.75 0 00.71-.5l1.26-3.58z"/></svg>
                )}
              </span>
            );
          });
          return (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold">
                  {r.name.split(' ').map(s=>s[0]).slice(0,2).join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{r.name}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex">{stars}</div>
                    <span className="text-gray-700 dark:text-gray-300">{r.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{r.text}</p>
            </div>
          );
        })()}
        <div className="mt-4 flex gap-2">
          {reviews.map((_, i) => (
            <button key={i} aria-label={`Go to review ${i+1}`} onClick={()=>setIdx(i)} className={`h-2 w-2 rounded-full ${i===idx? 'bg-brand-600':'bg-gray-300 dark:bg-gray-700'}`}></button>
          ))}
        </div>
      </section>

      {/* Our Founding Story */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600 shadow-2xl md:col-span-3">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.6L12 16.9 7.1 18.3l.9-5.6-4-3.9 5.5-.8L12 3z"/></svg>
            </span>
            <h3 className="text-lg font-extrabold gradient-text-moving drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">Our Founding Story</h3>
          </div>
          <p className="mt-2 text-white/90 text-sm">Born from classroom challenges and real exam pain points, we set out to build assessments that feel empowering—not stressful.</p>
          <ul className="mt-3 text-white/90 text-sm space-y-1 list-disc pl-5">
            <li>Started as a simple timer + autosave tool</li>
            <li>Shaped by feedback from teachers and students</li>
            <li>Grew into an end-to-end assessment platform</li>
          </ul>
          <div className="mt-3">
            <Link to="/about" className="inline-flex items-center gap-1 text-sm bg-white/20 px-3 py-1.5 rounded-md">Read our story <span>→</span></Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="card shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">How it works</h2>
        <ol className="mt-4 grid md:grid-cols-3 gap-6">
          <Reveal>
          <li className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl">
            <div className="text-sm text-gray-500 dark:text-gray-400">Step 1</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">Sign up & choose a role</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Create an account as Student, Instructor, or Admin.</p>
          </li>
          </Reveal>
          <Reveal delay={120}>
          <li className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl">
            <div className="text-sm text-gray-500 dark:text-gray-400">Step 2</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">Create or attempt exams</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Instructors build exams; students attempt with a live timer.</p>
          </li>
          </Reveal>
          <Reveal delay={240}>
          <li className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl">
            <div className="text-sm text-gray-500 dark:text-gray-400">Step 3</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">View results & leaderboard</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Get instant scores, detailed answers, and rankings.</p>
          </li>
          </Reveal>
        </ol>
      </section>

      {/* CTA Band */}
      <Reveal>
      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 p-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Start your journey today</h3>
          <p className="text-gray-600 dark:text-gray-300">Join now and explore study material or jump straight into exams.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/signup" className="btn btn-primary">Create Account</Link>
          <Link to="/study" className="btn">Browse Study</Link>
        </div>
      </section>
      </Reveal>
    </div>
  );
}
