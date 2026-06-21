import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';
import './CardNav.css';

interface NavLink {
  label: string;
  href?: string;
  ariaLabel?: string;
}

interface CardNavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: NavLink[];
}

interface CardNavProps {
  logoNode?: React.ReactNode;
  logo?: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const CardNav = ({
  logoNode,
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#0d0b14',
  menuColor,
  buttonBgColor,
  buttonTextColor,
}: CardNavProps) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded]           = useState(false);
  const navRef   = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const tlRef    = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector<HTMLElement>('.card-nav-content');
      if (contentEl) {
        const prev = {
          visibility:    contentEl.style.visibility,
          pointerEvents: contentEl.style.pointerEvents,
          position:      contentEl.style.position,
          height:        contentEl.style.height,
        };
        contentEl.style.visibility    = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position      = 'static';
        contentEl.style.height        = 'auto';
        void contentEl.offsetHeight;
        const total = 60 + 16 + contentEl.scrollHeight;
        Object.assign(contentEl.style, prev);
        return total;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: calculateHeight, duration: 0.4, ease });
    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');
    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;
    return () => { tl?.kill(); tlRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;
      tlRef.current.kill();
      const newTl = createTimeline();
      if (!newTl) return;
      if (isExpanded) newTl.progress(1);
      tlRef.current = newTl;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`} style={{ backgroundColor: baseColor }}>

        <div className="card-nav-top">
          {/* Hamburger */}
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && toggleMenu()}
            style={{ color: menuColor ?? 'rgba(255,255,255,0.7)' }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          {/* Logo */}
          <div className="logo-container">
            {logoNode ?? <img src={logo} alt={logoAlt} className="logo" />}
          </div>

          {/* CTA */}
          <a
            href="/register"
            className="card-nav-cta-button"
            style={{
              background: buttonBgColor ?? 'linear-gradient(to right, #9333ea, #ec4899)',
              color: buttonTextColor ?? '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            Get Started
          </a>
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {(items ?? []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link"
                    href={lnk.href ?? '#'}
                    aria-label={lnk.ariaLabel}
                  >
                    <GoArrowUpRight className="nav-card-link-icon" aria-hidden="true" />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
