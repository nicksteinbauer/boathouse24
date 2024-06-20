import { PinLogo } from "./PinLogo";

import { useRef, useEffect } from "react";

import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'

import CartRentalAbout1 from "../assets/CartRentalAbout1.jpg";
import CartRentalAbout2 from "../assets/CartRentalAbout2.jpg";
import CartRentalAbout3 from "../assets/CartRentalAbout3.jpg";

function About() {

    
    let animateThis1 = useRef(null);
    let animateThat1 = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
    
        gsap.to( animateThis1, {
            scrollTrigger: {
                trigger: '.cartRentalImages', 
                scrub: 1,
            },
            duration: 2,
            x: '0',
            y: '60',
            ease: "ease-in",
        })
        gsap.to( animateThat1, {
            scrollTrigger: {
                trigger: '.cartRentalImages', 
                scrub: 1,
            },
            duration: 2,
            x: '0',
            y: '-60',
            ease: "ease-in",
        })
    }, [])

    
    return (
        <section id="about" className="about flex-md inside-xxl">
            <div className="fifty padding-20 cartRentalImages flex-vertical">
                <img className="CartRentalAbout2" src={CartRentalAbout2} alt="Cart Rental About 2" ref={el => {animateThis1 = el}} />
                <img className="CartRentalAbout1" src={CartRentalAbout1} alt="Cart Rental About 1" />
                <img className="CartRentalAbout3" src={CartRentalAbout3} alt="Cart Rental About 3" ref={el => {animateThat1 = el}}/>
            </div>
            <div className="fifty padding-20 text-center">
                <h2><span><PinLogo /></span>About Boathouse Cart and Bike Rental</h2>
                <h3>Put in Bay Golf Cart Rentals - Closest reservable to the Jet Express dock</h3>
                <p>Our Put-in-Bay golf cart rental fleet consists of both gasoline and electric carts with plenty of speed and range to take you to all parts of South Bass Island. We rent in hourly increments or for the entire day, same day only. You must be at least 18 and have a valid drivers license to rent. Rent online and reserve your golf cart for the day, or visit our rental booth on Hartford Avenue. We rent 2 passenger, 4 passenger and 6 passenger carts at competitive rates. Reserve your Golf Cart now! We also offer overnight rentals available in person at our downtown Put-in-Bay golf cart rental booth. Our bicycle fleet features cruiser style bikes 26 inch sizes. Reserve your bike now!</p>
            </div>
        </section>
    )

}
export default About;
