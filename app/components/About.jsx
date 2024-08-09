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
            <div className="fifty padding-20 text-center flex-vertical">
                <div>
                    <h2><span><PinLogo /></span>About Boathouse Cart and Bike Rental</h2>
                    <p>Our Put-in-Bay golf cart rental service provides you with the speed and range to explore all of South Bass Island. We also offer bicycle rentals featuring 26" cruiser style bikes. Reserve your golf cart or bike today and start your adventure with Boathouse Cart and Bike Rental!</p>
                </div>
            </div>
        </section>
    )

}
export default About;
