import { Component } from 'react';

import { Link } from '@remix-run/react';
import { Link as ScrollLink } from 'react-scroll';


export class Menu extends Component {
    render() {
        return (
            <ul className="flex-md navUl">
                <li className="flex-vertical home">
                    <ScrollLink href='' to='about'>
                        <span>About</span>
                    </ScrollLink>
                </li>
                <li className="flex-vertical home">
                    <ScrollLink href='' to='products'>
                        <span>Products</span>
                    </ScrollLink>
                </li>
                <li className="flex-vertical home">
                    <Link reloadDocument to="/pages/location">Location</Link>
                </li>
                <li className="flex-vertical home">
                    <Link to="/pages/contact">Contact Us</Link>
                </li>
                <li className="flex-vertical home">
                    <ScrollLink href='' to='reserve' className='reserveButton'>
                        <span>Reserve Now</span>
                    </ScrollLink>
                </li>
            </ul>
        );
    }
}

export default Menu;
