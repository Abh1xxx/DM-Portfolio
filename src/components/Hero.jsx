import { motion, useReducedMotion } from 'framer-motion'
import heroVisual from '../assets/hero.png'

const EASE = [0.22, 1, 0.36, 1]

export default function Hero() {
  const reduced = useReducedMotion()
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : 0.1,
        delayChildren: reduced ? 0 : 0.08,
      },
    },
  }
  const item = {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  }
  return (
    <section className="hero-section" id="top" aria-labelledby="hero-title">
      <div className="ambient-orb orb-one" aria-hidden="true" />
      <div className="ambient-orb orb-two" aria-hidden="true" />
      <div className="hero-grid">
        <motion.div className="hero-copy" variants={container} initial="hidden" animate="show">
          <motion.p className="eyebrow" variants={item}><span /> DIGITAL MARKETING &middot; E-COMMERCE &middot; WEB DEV &middot; CONTENT CREATOR</motion.p>
          <motion.h1 id="hero-title" variants={item}>Abhiram <span>K Rajan.</span></motion.h1>
          <motion.p className="hero-description" variants={item}>Digital marketer, e-commerce specialist, content creator, and web developer focused on making digital work clearer, more useful, and ready to grow.</motion.p>
          <motion.div className="hero-actions" variants={item}><a className="button button-primary" href="#work">Explore my work <b>↗</b></a><a className="button button-secondary" href="#contact">Contact me <b>↗</b></a></motion.div>
        </motion.div>
        <motion.div className="hero-visual" initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75, delay: 0.15, ease: EASE }}>
          <div className="visual-backdrop" /><div className="grid-lines" />
          <div className="visual-card"><div className="card-topline"><span>Digital practice</span><span>Portfolio</span></div><img src={heroVisual} alt="Abstract illustration of a creative workspace" /><div className="card-caption"><span>Strategy / content / code</span><span className="signal">*</span></div></div>
        </motion.div>
      </div>
    </section>
  )
}
