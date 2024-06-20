import { Link } from "@remix-run/react";
import BH from "../assets/BoathousePins-BH.svg";
import CR from "../assets/BoathousePins-CR.svg";
import PB from "../assets/BoathousePins-PB.svg";
import BC from "../assets/BoathousePins-BC.svg";

function BoathouseBlock() {

    return (
        <nav className="navBB">
            <ul className="navUlBB always-flex">
                <li className="bh">
                    <a target="_blank" href="https://www.theboathousebarandgrill.com">
                        <img className="logos" src={BH} alt="Boathouse Logo" />
                    </a>
                    <div className="submenu">
                        <div className="subdiv">
                            <h3>
                                The Boathouse Bar and Grill
                            </h3>
                            <p>Great Food - Great Bands</p>
                            <a className="button" href="https://www.theboathousebarandgrill.com">Visit</a>
                        </div>
                        <div className="pointer"></div>
                    </div>
                </li>
                <li className="cr">
                    <Link to="/">
                        <img className="logos" src={CR} alt="Cart Rental Logo" />
                    </Link>
                    <div className="submenu">
                        <div className="subdiv">
                            <h3>
                                The Boathouse Cart Rental
                            </h3>
                            <p>Put in Bay Cart Rentals from Boathouse | Downtown Across the street from the Jet Express</p>
                        </div>
                        <div className="pointer"></div>
                    </div>
                </li>
                <li className="pb">
                    <a target="_blank" href="https://thepicnicbasketpib.com/">
                        <img className="logos" src={PB} alt="Picnic Basket" />
                    </a>
                    <div className="submenu">
                        <div className="subdiv">
                            <h3>
                                The Picnic Basket
                            </h3>
                            <p>T-Shirts and Beverage take out and delivery</p>
                            <a className="button" href="https://thepicnicbasketpib.com/">Visit</a>
                        </div>
                        <div className="pointer"></div>
                    </div>
                </li>
                <li className="bg">
                    <a target="_blank" href="https://www.theboathousebarandgrill.com">
                        <img className="logos" src={BC} alt="Biergarten at PIB" />
                    </a>
                    <div className="submenu">
                        <div className="subdiv">
                            <h3>
                                Biergarten at PIB
                            </h3>
                            <p>German Themed place for Beers and Brats</p>
                            <a className="button" href="https://www.biergartenpib.com">Visit</a>
                        </div>
                        <div className="pointer"></div>
                    </div>
                </li>
            </ul>
        </nav>
    )

}
export default BoathouseBlock;
