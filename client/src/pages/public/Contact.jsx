import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    toast.success('Thanks for reaching out! We will get back to you soon.');
    setName(''); setEmail(''); setMessage('');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Contact Us</h1>

      <section className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl">
        <div className="grid md:grid-cols-2">
          {/* Info panel */}
          <div className="relative p-8 md:p-10 text-white bg-gradient-to-br from-brand-600 via-indigo-600 to-purple-600">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <h2 className="text-xl font-bold">We're here to help</h2>
            <p className="mt-2 text-white/90 text-sm">Questions, feedback, partnerships—drop us a line and we’ll reply shortly.</p>

            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex items-center gap-2"><span className="h-6 w-6 rounded bg-white/20 inline-flex items-center justify-center">📧</span> support@example.com</div>
              <div className="flex items-center gap-2"><span className="h-6 w-6 rounded bg-white/20 inline-flex items-center justify-center">📍</span> 123 Learning Ave, Knowledge City</div>
              <div className="flex items-center gap-2"><span className="h-6 w-6 rounded bg-white/20 inline-flex items-center justify-center">⏰</span> Mon–Fri, 9:00–18:00</div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm">
              <a href="#" className="px-3 py-1.5 rounded bg-white/20 hover:bg-white/25">Twitter</a>
              <a href="#" className="px-3 py-1.5 rounded bg-white/20 hover:bg-white/25">LinkedIn</a>
              <a href="#" className="px-3 py-1.5 rounded bg-white/20 hover:bg-white/25">GitHub</a>
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
                <input type="email" className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="input min-h-[140px]" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="How can we help?" required />
              </div>
              <div>
                <button className="btn btn-primary w-full">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
