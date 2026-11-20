import { useState } from 'react';

export default function ContactPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setDraft(`Subject: ${subject.trim()}\n\n${message.trim()}`);
    setStatus('Draft ready to copy.');
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus('Draft copied.');
    } catch {
      setStatus('Select and copy the draft.');
    }
  }

  return (
    <main id="contact" className="inner-page">
      <section className="chapter inner-chapter inner-intro" aria-labelledby="contact-title">
        <img className="inner-art" src="/contact-kundli.webp" width="950" height="633" alt="Open notebook and bronze pen on a desk" />
        <div className="wrap inner-heading">
          <div className="inner-intro-copy">
            <div className="inner-brand"><img className="shri-logo" src="/shri-aaum-logo.webp" width="99" height="128" alt="" /><span>Shri Aaum</span></div>
            <h1 id="contact-title" tabIndex={-1}>Contact Kundli</h1>
            <p>Prepare a question about the birth form or report, then copy your draft to share.</p>
          </div>
        </div>
      </section>
      <section className="chapter inner-chapter inner-content" aria-labelledby="contact-form-title">
        <div className="wrap inner-grid">
          <div>
            <h2 id="contact-form-title">Write a message</h2>
            <p>This is a client-only app with no backend, so this page prepares a draft here rather than sending it.</p>
            <a className="button outline" href="#faq">Read the FAQs <span aria-hidden="true">→</span></a>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>Subject
              <input name="subject" maxLength={120} required value={subject} onChange={e => setSubject(e.target.value)} />
            </label>
            <label>Message
              <textarea name="message" rows={5} maxLength={1500} required value={message} onChange={e => setMessage(e.target.value)} />
            </label>
            <button className="button primary" type="submit">Prepare Draft</button>
            {draft && (
              <div className="contact-draft">
                <label>Message draft
                  <textarea rows={5} readOnly value={draft} />
                </label>
                <button className="button outline" type="button" onClick={copyDraft}>Copy draft</button>
              </div>
            )}
            <p className="contact-status" role="status">{status}</p>
          </form>
        </div>
      </section>
    </main>
  );
}
