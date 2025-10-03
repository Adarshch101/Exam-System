import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    // Placeholder submit. Wire to backend/Email API if needed.
    alert('Thanks for reaching out! We will get back to you soon.');
    setName(''); setEmail(''); setMessage('');
  };

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">About Us</h1>

      {/* Gradient quote */}
      <section className="rounded-2xl p-8 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl">
        <blockquote className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text gradient-text-moving">
          “Assessment should enlighten learning, not interrupt it.”
        </blockquote>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Our platform is built to reduce friction and increase insight for every role.</p>
      </section>

      {/* Vision, Mission, Founding Story */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 shadow-2xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5V17h-2v-1.5H8.5V14H11v-2H9v-1.5h2V9h2v1.5h2V12h-2v2h2.5v1.5H13z"/></svg>
            </span>
            <h3 className="text-lg font-extrabold gradient-text-moving drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">Our Vision</h3>
          </div>
          <p className="mt-2 text-white/90 text-sm">Empower learners and educators with fair, fast, and insightful assessments.</p>
          <ul className="mt-3 text-white/90 text-sm space-y-1 list-disc pl-5">
            <li>Accessible assessments for everyone</li>
            <li>Insightful analytics to improve outcomes</li>
            <li>Reliable, fast, and secure at scale</li>
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 shadow-2xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3 12l7-9 2 3 9 12H3z"/></svg>
            </span>
            <h3 className="text-lg font-extrabold gradient-text-moving drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">Our Mission</h3>
          </div>
          <p className="mt-2 text-white/90 text-sm">Deliver a delightful exam experience with powerful creation, attempt, and analytics tools.</p>
          <ul className="mt-3 text-white/90 text-sm space-y-1 list-disc pl-5">
            <li>Delightful UX for students, instructors, and admins</li>
            <li>Powerful creation tools and question management</li>
            <li>Instant results with transparent feedback</li>
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600 shadow-2xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.6L12 16.9 7.1 18.3l.9-5.6-4-3.9 5.5-.8L12 3z"/></svg>
            </span>
            <h3 className="text-lg font-extrabold gradient-text-moving drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">Our Founding Story</h3>
          </div>
          <p className="mt-2 text-white/90 text-sm">Born from classroom challenges, we set out to build assessments that empower, not stress.</p>
          <ul className="mt-3 text-white/90 text-sm space-y-1 list-disc pl-5">
            <li>Started as a simple timer + autosave tool</li>
            <li>Shaped by feedback from teachers and students</li>
            <li>Grew into an end-to-end assessment platform</li>
          </ul>
        </div>
      </section>

      {/* Get in touch form */}
      <section className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl">
        <div className="grid md:grid-cols-2">
          {/* Info panel */}
          <div className="relative p-8 md:p-10 text-white bg-gradient-to-br from-brand-600 via-indigo-600 to-purple-600">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <h2 className="text-xl font-bold">Get in touch with us</h2>
            <p className="mt-2 text-white/90 text-sm">We’d love to hear from you. Tell us about your use case, questions, or feedback.</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><span className="h-6 w-6 rounded bg-white/20 inline-flex items-center justify-center">📧</span> support@example.com</li>
              <li className="flex items-center gap-2"><span className="h-6 w-6 rounded bg-white/20 inline-flex items-center justify-center">💬</span> Typical response within 24 hours</li>
              <li className="flex items-center gap-2"><span className="h-6 w-6 rounded bg-white/20 inline-flex items-center justify-center">🔒</span> Your info is kept private</li>
            </ul>
            <div className="mt-5">
              <Link to="/faq" className="inline-flex items-center gap-1 text-sm bg-white/20 hover:bg-white/25 px-3 py-1.5 rounded-md">View FAQs →</Link>
            </div>
          </div>

          {/* Form panel */}
          <div className="p-8 md:p-10 bg-white dark:bg-gray-900">
            <form onSubmit={onSubmit} className="grid gap-4">
              <div>
                <label className="label">Name</label>
                <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" required />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="input min-h-[140px]" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Tell us how we can help" required />
              </div>
              <div>
                <button className="btn btn-primary w-full">Send Message</button>
              </div>
            </form>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">Prefer email? Reach us at <a className="link" href="mailto:support@example.com">support@example.com</a>.</p>
          </div>
        </div>
      </section>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Looking for more details? Visit our <Link className="link" to="/contact">Contact</Link> or <Link className="link" to="/about">About</Link> pages.
      </div>
    </div>
  );
}
