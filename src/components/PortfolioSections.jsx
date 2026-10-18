import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "@formspree/react";
import {
  contentMedia,
  marketplaces,
  projects,
  skills,
  workTabs,
} from "../data/portfolioData";

const EASE = [0.22, 1, 0.36, 1];

function SectionTitle({ label, title, copy }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="section-title"
      initial={{ opacity: 0, y: reduced ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <p>{label}</p>
      <h2>{title}</h2>
      {copy && <span>{copy}</span>}
    </motion.div>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function EmptyState({ children }) {
  return <div className="empty-state">{children}</div>;
}

function MarketplaceGallery() {
  return (
    <div className="marketplace-grid">
      {marketplaces.map((marketplace, index) => (
        <motion.article
          className="marketplace-card"
          key={marketplace.name}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {marketplace.image ? (
            <img
              loading="lazy"
              src={marketplace.image}
              alt={`${marketplace.name} dashboard showcase`}
            />
          ) : (
            <div
              className={`marketplace-mark market-${index + 1}`}
              aria-hidden="true"
            >
              {marketplace.name.slice(0, 1)}
            </div>
          )}
          <span>{marketplace.label}</span>
          <h3>{marketplace.name}</h3>
          <p>{marketplace.description}</p>
        </motion.article>
      ))}
    </div>
  );
}

function MediaCard({ item, onOpen, activeAudio, onAudioChange }) {
  const videoRef = useRef(null);
  const isVideo = item.type === "video";
  const muted = activeAudio !== item.src;
  const toggleAudio = (event) => {
    event.stopPropagation();
    if (muted) {
      onAudioChange(item.src);
      videoRef.current?.play().catch(() => {});
    } else onAudioChange(null);
  };
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);
  return (
    <article className="media-card">
      <button
        className="media-open"
        type="button"
        onClick={() => onOpen(item)}
        aria-label={`Open ${item.title}`}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            preload="metadata"
            src={item.src}
            muted={muted}
            playsInline
          />
        ) : (
          <img src={item.src} alt={item.title} loading="lazy" />
        )}
        {isVideo && (
          <span className="play-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
              <path d="M8 5.14v13.72L19 12 8 5.14z" />
            </svg>
          </span>
        )}
        <span className="media-label">
          {item.title}
          {item.ai && " · AI-assisted"}
        </span>
      </button>
      {isVideo && (
        <button
          className="media-audio"
          type="button"
          onClick={toggleAudio}
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4 9h3.5L12 5.5v13L7.5 15H4V9z" />
            {muted ? (
              <path
                d="M16 9.5l4.5 5m0-5l-4.5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <path
                d="M15.5 9a4.2 4.2 0 0 1 0 6M18.2 6.6a8 8 0 0 1 0 10.8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </svg>
        </button>
      )}
    </article>
  );
}

function ContentGallery({
  categories = ["product-images", "graphics", "videos", "ai-videos"],
}) {
  const [selected, setSelected] = useState(null);
  const [activeAudio, setActiveAudio] = useState(null);
  const visible = contentMedia.filter((item) =>
    categories.includes(item.category),
  );
  const step = (direction) =>
    setSelected((current) => {
      const index = visible.indexOf(current);
      return visible[(index + direction + visible.length) % visible.length];
    });
  useEffect(() => {
    const listener = (event) => {
      if (!selected) return;
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [selected, visible]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      {visible.length ? (
        <div className="media-grid">
          {visible.map((item) => (
            <MediaCard
              key={item.src}
              item={item}
              onOpen={setSelected}
              activeAudio={activeAudio}
              onAudioChange={setActiveAudio}
            />
          ))}
        </div>
      ) : (
        <EmptyState>
          Content samples will appear here. Put genuine images and videos in{" "}
          <code>public/media</code>, then register them in{" "}
          <code>src/data/portfolioData.js</code>. No fabricated samples are
          used.
        </EmptyState>
      )}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setSelected(null)}
          >
            <button
              className="lightbox-close"
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close preview"
            >
              ×
            </button>
            {visible.length > 1 && (
              <button
                className="lightbox-nav previous"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous item"
              >
                ←
              </button>
            )}
            <motion.div
              className="lightbox-content"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.24, ease: EASE }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              {selected.type === "video" ? (
                <video
                  src={selected.src}
                  controls
                  muted={activeAudio !== selected.src}
                  playsInline
                />
              ) : (
                <img src={selected.src} alt={selected.title} />
              )}
              <p>
                {selected.title}
                {selected.description && ` — ${selected.description}`}
              </p>
            </motion.div>
            {visible.length > 1 && (
              <button
                className="lightbox-nav next"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                aria-label="Next item"
              >
                →
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ProjectGallery() {
  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <motion.article
          className="project-card"
          key={project.name}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.name} screenshot`}
              loading="lazy"
            />
          ) : (
            <div className="project-fallback" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          )}
          <span>PROJECT / 0{index + 1}</span>
          <h3>{project.name}</h3>
          <p>{project.detail}</p>
          <small>{project.stack}</small>
          {(project.liveUrl || project.githubUrl) && (
            <div className="project-links">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  Live demo ↗
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              )}
            </div>
          )}
        </motion.article>
      ))}
    </div>
  );
}

function WorkPanel({ tab }) {
  if (tab === "E-Commerce & Digital Marketing")
    return (
      <>
        <MarketplaceGallery />
        <ContentGallery categories={["product-images"]} />
      </>
    );
  if (tab === "Content Creation")
    return <ContentGallery categories={["graphics", "videos", "ai-videos"]} />;
  return <ProjectGallery />;
}

const VisitorIcon = () => (
  <svg
    className="visitor-icon-svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

function VisitorCounter() {
  const [count, setCount] = useState(0);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetch("https://countapi.mileshilliard.com/api/v1/hit/abhiram-k-rajan-portfolio-visits")
      .then((response) => response.json())
      .then((data) => setCount(data.value))
      .catch(() => setCount(0));
  }, []);

  return (
    <div className="visitor-counter">
      <span className="visitor-label">visitors</span>
      <div className="visitor-display">
        <VisitorIcon />
        <span className="visitor-number">{count}</span>
      </div>
    </div>
  );
}

function ContactForm() {
  const [state, handleSubmit] = useForm("mbgdqpvz");

  if (state.succeeded) {
    return <p className="form-success">Thanks for your message! I'll get back to you soon.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="formspree-form">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className={state.errors?.name ? "error" : ""}
        />
        {state.errors?.name && <span className="form-error">{state.errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className={state.errors?.email ? "error" : ""}
        />
        {state.errors?.email && <span className="form-error">{state.errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows="5"
          className={state.errors?.message ? "error" : ""}
        />
        {state.errors?.message && <span className="form-error">{state.errors.message}</span>}
      </div>

      <button
        type="submit"
        disabled={state.submitting}
        className={`submit-button ${state.submitting ? "submitting" : ""}`}
      >
        {state.submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

export default function PortfolioSections() {
  const [activeTab, setActiveTab] = useState(workTabs[0]);
  const onTabKeyDown = (event, index) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? workTabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + workTabs.length) %
            workTabs.length;
    setActiveTab(workTabs[next]);
    const tabs =
      event.currentTarget.parentElement.querySelectorAll('[role="tab"]');
    tabs[next].focus();
  };
  return (
    <div className="portfolio-content">
      <section className="content-section about-section" id="about">
        <SectionTitle
          label="01 / About"
          title="Digital work with an operational mindset."
        />
        <Reveal>
          <p className="about-copy">
            Computer Science graduate pursuing a Postgraduate Program in Data
            Science at MAHE Dubai, with UAE experience in e-commerce
            operations, digital marketing, and content creation. I manage
            product listings and marketplace content across Amazon.ae, Noon,
            and Trendyol, and bring React.js and web development skills to
            clear, useful digital experiences.
          </p>
        </Reveal>
        <div className="highlights">
          <Reveal delay={0}>
            <article>
              <span>FOCUS</span>
              <strong>Growth & commerce</strong>
              <small>Digital marketing and marketplace operations</small>
            </article>
          </Reveal>
          <Reveal delay={0.08}>
            <article>
              <span>APPROACH</span>
              <strong>Practical & precise</strong>
              <small>Content, optimisation, and workflow support</small>
            </article>
          </Reveal>
          <Reveal delay={0.16}>
            <article>
              <span>BUILD</span>
              <strong>Web experiences</strong>
              <small>React.js, Redux, Bootstrap, and Tailwind CSS foundations</small>
            </article>
          </Reveal>
        </div>
      </section>
      <section className="content-section experience-section" id="experience">
        <SectionTitle
          label="02 / Experience"
          title="Supporting commerce from listing to promotion."
        />
        <Reveal>
          <article className="experience-card">
            <div className="experience-meta">
              <span>Dubai, UAE</span>
              <span>Mar – Oct 2026</span>
            </div>
            <div>
              <h3>E-Commerce Digital Marketing Assistant</h3>
              <p className="company">European Accessories</p>
              <ul>
                <li>
                  Managed product listings, catalogue updates, pricing,
                  inventory, and promotional activities across Amazon.ae, Noon
                  Seller Lab, and Trendyol.
                </li>
                <li>
                  Optimised product titles, descriptions, keywords, images, and
                  product attributes to improve catalogue quality and online
                  presentation.
                </li>
                <li>
                  Supported social media operations across Instagram, Facebook,
                  and WhatsApp Business, including promotional content and
                  customer communication.
                </li>
                <li>
                  Created product listing images, promotional graphics, and
                  social media creatives using Canva and Canva AI.
                </li>
                <li>
                  Produced short-form promotional videos, Reels-style content,
                  and AI-assisted product videos using CapCut and AI tools.
                </li>
                <li>
                  Supported Google Ads and Meta Ads activities, order
                  processing, customer inquiries, and performance reporting
                  using Excel and Google Sheets.
                </li>
              </ul>
            </div>
          </article>
        </Reveal>
      </section>
      <section className="content-section skills-section" id="skills">
        <SectionTitle
          label="03 / Skills"
          title="A toolkit for digital commerce."
        />
        <div className="skills-grid">
          {skills.map(([title, list], index) => (
            <Reveal key={title} delay={index * 0.07}>
              <article className="skill-card">
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{list}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="content-section work-section" id="work">
        <SectionTitle
          label="04 / My Work"
          title="Selected work, organised by discipline."
          copy="Only genuine, verified work is shown."
        />
        <div className="work-tabs" role="tablist" aria-label="Work categories">
          {workTabs.map((tab, index) => (
            <button
              id={`tab-${index}`}
              key={tab}
              role="tab"
              type="button"
              aria-controls="work-panel"
              aria-selected={activeTab === tab}
              tabIndex={activeTab === tab ? 0 : -1}
              className={activeTab === tab ? "active" : ""}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            id="work-panel"
            key={activeTab}
            className="work-panel"
            role="tabpanel"
            aria-labelledby={`tab-${workTabs.indexOf(activeTab)}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <WorkPanel tab={activeTab} />
          </motion.div>
        </AnimatePresence>
      </section>
      <section className="content-section education-section" id="education">
        <SectionTitle
          label="05 / Education"
          title="Technology with a data-driven outlook."
        />
        <Reveal>
          <div className="education-list">
            <article>
              <div>
                <h3>Postgraduate Program in Data Science</h3>
                <p>
                  Manipal Academy of Higher Education (MAHE), Dubai · Feb 2026 –
                  Present
                </p>
              </div>
            </article>
            <article>
              <div>
                <h3>B.Tech in Computer Science and Engineering</h3>
                <p>SNGCE, Kerala, India · 2020 – 2024</p>
              </div>
            </article>
          </div>
          <div className="certifications">
            <p>Certifications</p>
            <span>
              Full Stack Development (MERN Stack) — Illinois Institute of
              Technology, USA
            </span>
            <span>Full Stack Development (MERN Stack) — Entri Elevate</span>
          </div>
        </Reveal>
      </section>
      <section className="contact-section" id="contact">
        <Reveal>
          <p>06 / Contact</p>
          <h2>
            Let&apos;s build something
            <br />
            meaningful together.
          </h2>
          <p className="contact-copy">
            Dubai, UAE · UAE Student Visa · Available for immediate joining.
            For roles, collaborations, or project conversations, reach out
            directly.
          </p>

          {/* Add the contact form */}
          <div className="contact-form">
            <h3>Send me a message</h3>
            <ContactForm />
          </div>

          {/* Keep existing contact links (optional) */}
          <div className="contact-links">
            <a href="mailto:abhirammain01@gmail.com">
              <span>Email</span>
              abhirammain01@gmail.com
            </a>
            <a href="tel:+971568674373">
              <span>Phone</span>
              +971 56 867 4373
            </a>
            <a
              href="https://www.linkedin.com/in/abhiram-k-rajan-6815a33b7/"
              target="_blank"
              rel="noreferrer"
            >
              <span>LinkedIn</span>
              Abhiram K Rajan ↗
            </a>
            <a
              className="resume-link"
              href={`${import.meta.env.BASE_URL}Abhiram-K-Rajan-Resume.pdf`}
              target="_blank"
              rel="noreferrer"
            >
              <span>Résumé</span>
              Download PDF ↗
            </a>
          </div>
        </Reveal>
      </section>
      <footer className="site-footer">
        © {new Date().getFullYear()} Abhiram K Rajan
        <VisitorCounter />
      </footer>
    </div>
  );
}
