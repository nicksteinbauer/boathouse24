import { PinLogo } from "./PinLogo";

//import { Link } from "@shopify/hydrogen";

import Cart2Person from "../assets/BoathouseCartRental2Person.jpg";
import Cart4Person from "../assets/BoathouseCartRental4Person.jpg";
import Cart6Person from "../assets/BoathouseCartRental6Person.jpg";
import Bike from "../assets/BicycleUpdatedUpdated.jpg";

function Rates() {

    
    
    
    return (
        <section id="products" className="rates">
            <div className="text-center inside-md">
                <h2><span><PinLogo /></span>Our Put-in-Bay Golf Cart Rentals, Bike Rentals</h2>
                <h3>We offer competitive rates and offer 2, 4, 6 person Put in Bay Golf Carts Rentals as well as 26" Bikes</h3>
            </div>
            <div className="inside-xxl auto-grid-rates">
                <div>
                    <img className="Cart2Person" src={Cart2Person} alt="Cart Rental 2 Person Cart" />
                    <h4>2-Person Put-in-Bay Golf Cart Rentals</h4>
                    <p>
                        2 person gas and electric golf carts available.
                    </p>
                   
                </div>
                <div>
                    <img className="Cart4Person" src={Cart4Person} alt="Cart Rental 4 Person Cart" />
                    <h4>4-Person Put-in-Bay Golf Cart Rentals</h4>
                    <p>
                       4 seat gas EZ-Go carts available. Perfect for your full weekend visit to Put-in-Bay.
                    </p>
                   
                </div>
                <div>
                    <img className="Cart6Person" src={Cart6Person} alt="Cart Rental 6 Person Cart" />
                    <h4>6-Person Put-in-Bay Golf Cart Rentals</h4>
                    <p>
                       6 seat gas EZ-Go carts available. Perfect for the whole family visit.
                    </p>
                    
                </div>
                <div>
                    <img className="Bike" src={Bike} alt="Bicycle Rental" />
                    <h4>Put-in-Bay Bicycle Rentals - 26"</h4>
                    <p>
                        26" cruiser style Put-in-Bay Bike rentals.
                    </p>
                    
                </div>
            </div>
            
        </section>
    )

}
export default Rates;
