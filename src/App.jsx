import { useEffect, useRef, useState } from 'react'
import {
  At,
  ArrowUpRight,
  List,
  PawPrint,
  Play,
  X,
} from '@phosphor-icons/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const gallery = [
  { src: '/assets/eura-real-home.jpeg', title: 'Hug Time', position: 'center 42%', tone: 'brightness(.84) contrast(1.06) saturate(.88)' },
  { src: '/assets/eura-real-toys.jpeg', title: 'Toy Universe', position: 'center 64%', tone: 'brightness(.8) contrast(1.08) saturate(.84)' },
  { src: '/assets/eura-real-park.jpeg', title: 'Park Day', position: 'center 55%', tone: 'brightness(.74) contrast(1.1) saturate(.78)' },
  { src: '/assets/eura-real-car.jpeg', title: 'Ready to Go', position: 'center 55%', tone: 'brightness(.82) contrast(1.07) saturate(.86)' },
  { src: '/assets/eura-real-play.jpeg', title: 'Playtime', position: 'center 48%', tone: 'brightness(.82) contrast(1.06) saturate(.86)' },
  { src: '/assets/eura-new-bed.jpeg', title: 'Lounging in Bed', position: 'center 48%', tone: 'brightness(.8) contrast(1.07) saturate(.82)' },
  { src: '/assets/eura-real-birthday.jpeg', title: 'First Birthday', position: 'center 50%', tone: 'brightness(.8) contrast(1.08) saturate(.84)' },
]

const traits = [
  {
    en: 'TINY TASTE TESTER',
    title: 'Dinner Detective',
    text: 'I checked the shiny spoon. Dinner is definitely hiding in there somewhere.',
    image: '/assets/eura-new-spoon.jpeg',
    position: 'center center',
    tone: 'brightness(.8)',
  },
  {
    en: 'NAP EMERGENCY',
    title: 'One More Yawn',
    text: 'That was a yawn, not a roar. I am simply very, very sleepy.',
    image: '/assets/eura-new-yawn.jpeg',
    position: 'center 42%',
    tone: 'brightness(.9)',
  },
  {
    en: 'ARMS, PLEASE',
    title: 'Professional Cuddler',
    text: 'If your arms are empty, I know exactly where I belong.',
    image: '/assets/eura-new-cuddle.jpeg',
    position: 'center 38%',
    tone: 'brightness(.9)',
  },
  {
    en: 'WINTER DEBUT',
    title: 'First Snow, Ever',
    text: 'My first snow. Cold little paws, enormous questions.',
    image: '/assets/eura-new-first-snow.jpeg',
    position: 'center 58%',
    tone: 'brightness(.68) contrast(1.12) saturate(.7)',
  },
]

function BrandMark() {
  return (
    <a className="brand" href="#top" aria-label="Back to Eura home">
      <span className="brand-mark"><PawPrint size={18} weight="fill" /></span>
      <span>EURA</span>
    </a>
  )
}

function App() {
  const root = useRef(null)
  const heroVideo = useRef(null)
  const dreamVideo = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePhoto, setActivePhoto] = useState(null)
  const [heroVideoReady, setHeroVideoReady] = useState(false)

  useEffect(() => {
    let timer
    const queueVideo = () => {
      timer = window.setTimeout(() => setHeroVideoReady(true), 500)
    }

    if (document.readyState === 'complete') queueVideo()
    else window.addEventListener('load', queueVideo, { once: true })

    return () => {
      window.removeEventListener('load', queueVideo)
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setActivePhoto(null)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    if (!root.current) return undefined

    const mediaQuery = gsap.matchMedia()
    const context = gsap.context(() => {
      mediaQuery.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero-kicker, .hero-word, .hero-intro, .round-action', {
          y: 48,
          opacity: 0,
          duration: 1.15,
          stagger: 0.08,
          ease: 'power3.out',
        })

        gsap.utils.toArray('.media-reveal').forEach((element) => {
          gsap.from(element, {
            y: 32,
            opacity: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              once: true,
            },
          })
        })

        gsap.utils.toArray('.scroll-reveal').forEach((element) => {
          gsap.from(element, {
            y: 52,
            opacity: 0,
            duration: 1.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          })
        })

      })
    }, root)

    return () => {
      mediaQuery.revert()
      context.revert()
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = activePhoto !== null || menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [activePhoto, menuOpen])

  useEffect(() => {
    const video = heroVideo.current
    if (!video || !heroVideoReady) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.05 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [heroVideoReady])

  useEffect(() => {
    const video = dreamVideo.current
    if (!video) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: '150px 0px' },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const pauseHiddenVideos = () => {
      if (document.hidden) {
        heroVideo.current?.pause()
        dreamVideo.current?.pause()
      }
    }

    document.addEventListener('visibilitychange', pauseHiddenVideos)
    return () => document.removeEventListener('visibilitychange', pauseHiddenVideos)
  }, [])

  const navigate = () => setMenuOpen(false)

  return (
    <main ref={root} id="top">
      <header className="site-header">
        <BrandMark />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#profile">Profile</a>
          <a href="#gallery">Gallery</a>
          <a href="#character">Character</a>
          <a className="nav-contact" href="#contact">Follow <ArrowUpRight size={16} /></a>
        </nav>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
          <List size={24} />
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="mobile-menu-top">
            <BrandMark />
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={24} /></button>
          </div>
          <nav>
            <a href="#profile" onClick={navigate}>Profile</a>
            <a href="#gallery" onClick={navigate}>Gallery</a>
            <a href="#character" onClick={navigate}>Character</a>
            <a href="#contact" onClick={navigate}>Follow</a>
          </nav>
        </div>
      )}

      <section className="hero" aria-labelledby="hero-title">
        <video
          ref={heroVideo}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={(event) => {
            event.currentTarget.muted = true
            event.currentTarget.volume = 0
          }}
          poster="/assets/eura-real-park.jpeg"
          aria-label="Eura the Maltipoo playing"
        >
          {heroVideoReady && <source src="/assets/eura-hero.mp4" type="video/mp4" />}
        </video>
        <div className="hero-wash" />
        <div className="hero-copy page-shell">
          <p className="hero-kicker">ONE YEAR OF LITTLE WONDERS</p>
          <h1 id="hero-title" aria-label="Eura, little wonder">
            <span className="hero-word hero-word-name">EURA</span>
            <span className="hero-word hero-word-little">LITTLE</span>
            <span className="hero-word hero-word-wonder">WONDER</span>
          </h1>
          <p className="hero-intro">A tiny girl,<br /><span>full of joy.</span></p>
          <a className="round-action" href="#profile" aria-label="Meet Eura">
            <Play size={18} weight="fill" />
            <span>Meet Eura</span>
          </a>
        </div>
      </section>

      <section className="profile section-pad page-shell" id="profile" aria-labelledby="profile-title">
        <div className="section-heading profile-heading scroll-reveal">
          <p className="section-kicker">MEET EURA</p>
          <h2 id="profile-title">A tiny girl with<br />a very big soul.</h2>
        </div>

        <div className="profile-layout">
          <figure className="profile-portrait media-reveal">
            <img src="/assets/eura-real-profile.jpeg" alt="Front portrait of Eura the Maltipoo" loading="lazy" decoding="async" />
          </figure>

          <div className="profile-details scroll-reveal">
            <div className="identity-row">
              <div><span>Breed</span><strong>Maltipoo</strong></div>
              <div><span>Age</span><strong>One year old</strong></div>
              <div><span>Gender</span><strong>Girl</strong></div>
              <div><span>Birthday</span><strong>May 30</strong></div>
              <div><span>Zodiac</span><strong>Gemini</strong></div>
              <div><span>Coat</span><strong>Champagne</strong></div>
            </div>

            <p className="profile-story">Eura is a tiny girl with a mind entirely her own. She knows exactly what she wants, has opinions about everything, and carries just the right amount of little-princess attitude.</p>

            <div className="stats-grid">
              <article><span>Weight</span><strong>3.45<small>kg</small></strong><p>Just right for a full-arm cuddle</p></article>
              <article><span>Meals</span><strong>On time</strong><p>Never misses a meal</p></article>
              <article><span>Naps</span><strong>Anytime</strong><p>Soft spot, nap spot</p></article>
              <article><span>Toys</span><strong>Many</strong><p>She knows every single one</p></article>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-section section-pad" id="gallery" aria-labelledby="gallery-title">
        <div className="page-shell gallery-header scroll-reveal">
          <h2 id="gallery-title">Everyday, Remembered</h2>
          <p>Not posed. Just small moments, kept exactly as they happened.</p>
        </div>
        <div className="gallery-grid page-shell">
          {gallery.map((photo, index) => (
            <button
              className={`gallery-item gallery-item-${index + 1} media-reveal`}
              key={`${photo.title}-${index}`}
              type="button"
              onClick={() => setActivePhoto(index)}
              aria-label={`View full image: ${photo.title}`}
            >
              <img src={photo.src} alt={photo.title} loading="lazy" decoding="async" style={{ objectPosition: photo.position, filter: photo.tone }} />
              <span>{photo.title}</span>
              <ArrowUpRight size={24} />
            </button>
          ))}
        </div>
      </section>

      <section className="dream-break" aria-labelledby="dream-title">
        <video
          ref={dreamVideo}
          className="dream-video"
          muted
          loop
          playsInline
          preload="none"
          onLoadedMetadata={(event) => {
            event.currentTarget.muted = true
            event.currentTarget.volume = 0
          }}
          poster="/assets/eura-new-bed.jpeg"
          aria-label="Eura drifting through a soft little dream"
        >
          <source src="/assets/eura-dream.mp4" type="video/mp4" />
        </video>
        <div className="dream-wash" />
        <div className="dream-copy page-shell scroll-reveal">
          <p className="dream-kicker">A TINY DREAM</p>
          <h2 id="dream-title">Somewhere<br />Soft &amp; Sweet.</h2>
          <p className="dream-caption">“Why does my dream smell so sweet?”</p>
          <span className="dream-signoff">Eura, probably</span>
        </div>
      </section>

      <section className="character section-pad page-shell" id="character" aria-labelledby="character-title">
        <div className="character-intro scroll-reveal">
          <h2 id="character-title">A Language<br />All Her Own</h2>
          <p>Eura does not need words. Every little gesture says exactly what she means.</p>
        </div>

        <div className="trait-stack">
          {traits.map((trait, index) => (
            <article className="trait-card" key={trait.title} style={{ '--stack-index': index }}>
              <div className="trait-copy">
                <span>{trait.en}</span>
                <h3>{trait.title}</h3>
                <p>{trait.text}</p>
              </div>
              <div className="trait-image">
                <img src={trait.image} alt={`Eura ${trait.title}`} loading="lazy" decoding="async" style={{ objectPosition: trait.position, filter: trait.tone }} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="contact" id="contact" aria-labelledby="contact-title">
        <img className="contact-bg" src="/assets/eura-new-curious.jpeg" alt="Eura enjoying a gentle little moment with her person" loading="lazy" decoding="async" />
        <div className="contact-wash" />
        <div className="contact-content page-shell scroll-reveal">
          <p className="contact-kicker">FOLLOW EURA</p>
          <h2 id="contact-title">Stay Close to<br />Her Little World.</h2>
          <p className="contact-translation">Follow the everyday adventures of one very loved little girl.</p>
          <div className="contact-actions">
            <a href="https://www.xiaohongshu.com/" target="_blank" rel="noreferrer"><At size={22} /> REDnote&nbsp;&nbsp;·&nbsp;&nbsp;仙贝贝 <ArrowUpRight size={18} /></a>
          </div>
          <div className="footer-line">
            <BrandMark />
            <p>Made for one very loved little girl.</p>
            <a href="#top">Back to top <ArrowUpRight size={16} /></a>
          </div>
        </div>
      </footer>

      {activePhoto !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={gallery[activePhoto].title} onClick={() => setActivePhoto(null)}>
          <button type="button" onClick={() => setActivePhoto(null)} aria-label="Close full image"><X size={28} /></button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={gallery[activePhoto].src} alt={gallery[activePhoto].title} decoding="async" />
            <figcaption>
              <span>{gallery[activePhoto].title}</span>
              <span>{String(activePhoto + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  )
}

export default App
