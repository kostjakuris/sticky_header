'use client';
import { useEffect, useReducer, useRef } from 'react';
import './Header.css';

type HeaderMode = 'default' | 'fixed' | 'leaving' | 'appearing';

export default function Header() {
  const [, rerender] = useReducer(n => n + 1, 0);
  const modeRef = useRef<HeaderMode>('default');

  const prevScrollYRef = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const headerHeight = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setMode = (next: HeaderMode) => {
    modeRef.current = next;
    rerender();
  };

  useEffect(() => {
    if (headerRef.current) {
      headerHeight.current = headerRef.current.offsetHeight;
    }

    if (window.scrollY > 250) setMode('fixed');

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollingDown = scrollY > prevScrollYRef.current;

      if (scrollingDown && scrollY > 250 && modeRef.current === 'default') {
        setMode('fixed');
      }

      if (!scrollingDown && scrollY <= 250 && modeRef.current === 'fixed') {
        setMode('leaving');
        timeoutRef.current = setTimeout(() => setMode('default'), 420);
      }

      if (scrollY < headerHeight.current && modeRef.current !== 'default' && modeRef.current !== 'appearing') {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setMode('appearing');
        timeoutRef.current = setTimeout(() => setMode('default'), 420);
      }

      prevScrollYRef.current = scrollY;
    };

    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  
  return (
    <>
      <header
        ref={headerRef}
        className={`header ${modeRef.current}`}
      >
        <div className='container'>
          <div className='logo'>Logo</div>
          <nav className='nav'>
            <a href='/'>Home</a>
            <a href='/'>About</a>
            <a href='/'>Services</a>
            <a href='/'>Contact</a>
          </nav>
        </div>
      </header>
      <main>
        <section style={{height: '200vh', padding: '0 40px'}}>
          Scroll page
        </section>
      </main>
    </>
  );
}