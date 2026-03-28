'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setStatus('success');
    // Clear form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">Contact</h1>
      <p className="text-accent mb-12 text-lg">
        Have a question or want to work together? Feel free to reach out.
      </p>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-accent mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="w-full px-4 py-3 rounded-lg border border-border-custom bg-border-custom/10 focus:ring-2 focus:ring-action outline-none transition"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-accent mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-border-custom bg-border-custom/10 focus:ring-2 focus:ring-action outline-none transition"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-accent mb-2">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-border-custom bg-border-custom/10 focus:ring-2 focus:ring-action outline-none transition"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-action text-background rounded-lg font-bold hover:opacity-90 transition shadow-lg active:scale-[0.98]"
          >
            Send Message
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-8 p-4 bg-action/10 text-accent rounded-lg border border-action/20">
            Thank you! Your message has been sent successfully (simulated).
          </div>
        )}
      </div>
    </main>
  );
}