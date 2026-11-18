import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import TerminalWindow from '@/components/TerminalWindow';
import { usePageDrones, titleScene, DroneHeader } from '@/components/drones/page';

const HEADER = {
  eyebrow: '$ ./contact.sh',
  title: 'Contact',
  sub: "Let's connect and build something great together.",
  meta: 'Remote roles · Freelance · Web3 builds',
};

export default function Contact() {
  // Drones write the title — and celebrate a sent message.
  const drones = usePageDrones(
    async (ctx) => [
      { key: 'title', elements: titleScene(ctx, HEADER) },
      {
        key: 'sent',
        elements: titleScene(ctx, {
          eyebrow: '$ ./contact.sh --status',
          title: 'Message sent ✓',
          sub: "Thanks for reaching out — I'll get back to you soon.",
          meta: 'Delivered',
        }),
      },
    ],
    null
  );
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
        // Glide to the top and let the drones confirm it.
        if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        drones.current.show('sent');
        setTimeout(() => drones.current.clear(), 9000);
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
        <meta name="description" content="Contact Paul Madu - Petroleum Engineering graduate and Full-Stack Engineer open to remote developer roles, Masters research supervision, and freelance projects." />
      </Head>

      <div className="contact-container">
        <DroneHeader {...HEADER} />

        <div className="contact-content">
          <div className="contact-form-section" data-reveal="left">
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

          <div className="contact-info-section" data-reveal="right" data-delay="0.15">
            <TerminalWindow title="contact-info.txt" showControls={false}>
              <div className="contact-info">
                <h3 className="info-title">Connect With Me</h3>
                
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <a href="mailto:madupaul.20181131453@futo.edu.ng" className="info-link">
                    madupaul.20181131453@futo.edu.ng
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
                    href="https://x.com/physiodev_1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="info-link"
                  >
                    @physiodev_1
                  </a>
                </div>

                <div className="info-note">
                  <p>
                    Currently open to: remote developer roles, Masters research supervision, and freelance projects.
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
