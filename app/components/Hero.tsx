import TopLogo from './TopLogo';
import MainForm from './MainForm';

import React, { useRef, useLayoutEffect } from 'react';

// import { Link } from '@shopify/hydrogen';
import { Link } from '@remix-run/react';

import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const backScroll = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!backScroll.current || !sectionRef.current) return;

      // set initial state immediately before paint
      gsap.set(backScroll.current, {
        y: 0,
        willChange: 'transform',
      });

      gsap.to(backScroll.current, {
        y: '15%', // subtle slow scroll
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="reserve" className="scrollTrigger" ref={sectionRef}>
      <div className="heroContainer" ref={backScroll}></div>

      <div className="heroOverlay">
        <div className="topOverlay" />

        <div className="topBanner">
          Closest reservable Put in Bay Golf Cart Rental to the Jet Express
          dock <Link to="/pages/location">Location</Link>
        </div>

        <div className="topLogo">
          <TopLogo />
        </div>

        <div className="hero flex-vertical">
          <div className="text-center">
            <h1 className="h1 noMargin">
              Put-in-Bay Golf Cart Rental
            </h1>

            <h2 className="h1">
              Boathouse Cart Rental
            </h2>

            {/* <h2 className="h1 teal">
              <span>Book your cart for Summer 2026 now!</span>
            </h2> */}

            <div className="inside-sm text-center heroFormContainer">
              <MainForm />

              <p className="text-center bright">
                Rent your Put in Bay golf cart rental overnight for multiple
                days. <span className='break'>The more days you reserve, the more discount you receive.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;