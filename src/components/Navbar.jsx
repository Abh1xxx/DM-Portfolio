import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const navItems = [
  "About",
  "Experience",
  "Skills",
  "My Work",
  "Contact",
];

const externalLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abhiram-k-rajan-6815a33b7/",
  },
  { label: "Résumé", href: `${import.meta.env.BASE_URL}Abhiram-K-Rajan-Resume.pdf` },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <motion.header
      className="site-header"
      initial={{ y: -22, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <nav className="navbar" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Abhiram K Rajan, home">
          ABHIRAM <span>K RAJAN</span>
        </a>
        <div className="nav-links desktop-links">
          {navItems.map((item) => (
            <a key={item} href={`#${item === 'My Work' ? 'work' : item.toLowerCase()}`}>
              {item}
            </a>
          ))}
          {externalLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
        <a className="nav-cta desktop-links" href="#contact">Let&apos;s talk</a>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i />
          <i />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item === 'My Work' ? 'work' : item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              {externalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
export default Navbar;
