'use client';

import { useState } from 'react';
import { sendContactMessage } from '@/app/actions/engagement';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('email', formData.email);
    fd.append('message', formData.message);

    const res = await sendContactMessage(fd);
    
    if (res.success) {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } else {
      setStatus('error');
      setErrorMessage(res.error || 'Something went wrong');
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <section className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 shadow-sm max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Contact</h1>
        <p className="text-accent text-sm leading-relaxed max-w-xl">
          Have a question or want to work together? Feel free to reach out.
        </p>
      </section>

      <div className="max-w-xl bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-[10px] font-bold text-accent uppercase mb-2 tracking-widest">
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="w-full px-3 py-2 rounded-lg border border-border-custom bg-background/50 focus:border-action outline-none transition-all text-xs"
              placeholder="YOUR_NAME"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-[10px] font-bold text-accent uppercase mb-2 tracking-widest">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-3 py-2 rounded-lg border border-border-custom bg-background/50 focus:border-action outline-none transition-all text-xs"
              placeholder="EMAIL_ADDRESS"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-[10px] font-bold text-accent uppercase mb-2 tracking-widest">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border-custom bg-background/50 focus:border-action outline-none transition-all text-xs resize-none"
              placeholder="HOW_CAN_I_HELP"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 bg-action text-background rounded-lg font-bold hover:opacity-90 transition-all shadow-lg active:scale-[0.98] text-[10px] uppercase tracking-widest disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message _'}
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-6 p-3 bg-action/10 text-action rounded-lg border border-action/20 text-[9px] font-bold uppercase tracking-widest text-center">
            Message Sent Successfully _
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 p-3 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 text-[9px] font-bold uppercase tracking-widest text-center">
            Error: {errorMessage} _
          </div>
        )}
      </div>
    </main>
  );
}