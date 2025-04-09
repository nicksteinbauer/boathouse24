import TopLogo from './TopLogo';
import MainForm from './MainForm';

import React, { useRef, useEffect } from "react"

// import { Link } from '@shopify/hydrogen';
import { Link } from '@remix-run/react';

import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'

const Hero: React.FC = () => {

    const backScroll = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        if (backScroll.current) {
            gsap.to(backScroll.current, {
                scrollTrigger: {
                    trigger: '.scrollTrigger',
                    scrub: 1,
                },
                duration: 2,
                x: '0',
                y: '100%',
                ease: "ease-in",
            });
        }
    }, []);

    return (
        <div id='reserve' className='scrollTrigger'>
            <div 
                className={`heroContainer`}
                ref={backScroll}
            ></div>
            <div className={`heroOverlay`}>
                <div className={`topOverlay`} />
                <div className="topBanner">
                    Closest reservable Put in Bay Golf Cart Rental to the Jet Express dock <Link to="/pages/location">Location</Link>
                </div>
                <div className={`topLogo`}>
                    <TopLogo />
                </div>
                <div className={`hero flex-vertical`}>
                    <div className={`text-center`}>
                        <h1 className={`h1 noMargin`}>Put-in-Bay Golf Cart Rental</h1>
                        <h2 className={`h1`}>Boathouse Cart Rental</h2>
                        <div className={`inside-sm text-center heroFormContainer`}>
                            <MainForm />
                            <p className="text-center bright">
                                Rent your Put in Bay golf cart rental overnight for multiple days.<br />
                                The more days you reserve, the more discount you receive.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
