import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import TerminalWindow from '@/components/TerminalWindow';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '', // Anti-spam field
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Honeypot check
    if (formData.honeypot) {
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Message sent successfully! I\'ll get back to you soon.',
        });
        setFormData({ name: '', email: '', message: '', honeypot: '' });
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Contact - Paul Madu</title>
        <meta name="description" content="Get in touch with Paul Madu" />
      </Head>

      <div className="contact-container">
        <header className="page-header">
          <h1 className="page-title">
            <span className="prompt">$</span> ./contact.sh
          </h1>
          <p className="page-description">
            Let's connect and build something great together
          </p>
        </header>

        <div className="contact-content">
          <div className="contact-form-section">
            <TerminalWindow title="contact-form">
              <form onSubmit={handleSubmit} className="contact-form">
                {/* Honeypot field - hidden from users */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                  tabIndex="-1"
                  autoComplete="off"
                />

                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    <span className="prompt">$</span> Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <span className="prompt">$</span> Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    <span className="prompt">$</span> Message:
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="form-textarea"
                    placeholder="Your message here..."
                  />
                </div>

                {status.message && (
                  <div className={`form-status status-${status.type}`}>
                    {status.type === 'success' ? '✓' : '✗'} {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="form-submit"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            </TerminalWindow>
          </div>

          <div className="contact-info-section">
            <TerminalWindow title="contact-info.txt" showControls={false}>
              <div className="contact-info">
                <h3 className="info-title">Connect With Me</h3>
                
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <a href="mailto:obinnap350@gmail.com" className="info-link">
                    obinnap350@gmail.com
                  </a>
                </div>

                <div className="info-item">
                  <span className="info-label">GitHub:</span>
                  <a 
                    href="https://github.com/paulphysio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="info-link"
                  >
                    github.com/paulphysio
                  </a>
                </div>

                <div className="info-item">
                  <span className="info-label">LinkedIn:</span>
                  <a 
                    href="https://www.linkedin.com/in/paul-madu-a69235222" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="info-link"
                  >
                    linkedin.com/in/paul-madu
                  </a>
                </div>

                <div className="info-item">
                  <span className="info-label">X (Twitter):</span>
                  <a 
                    href="https://x.com/phsiodev_1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="info-link"
                  >
                    @phsiodev_1
                  </a>
                </div>

                <div className="info-note">
                  <p>
                    Open to freelance opportunities, collaborations, and interesting projects.
                    Feel free to reach out!
                  </p>
                </div>
              </div>
            </TerminalWindow>
          </div>
        </div>
      </div>
    </Layout>
  );
}
