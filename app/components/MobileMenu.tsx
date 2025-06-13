import { useState } from 'react';
import {useLocation} from '@remix-run/react';

import Menu from './Menu';
import MenuInterior from './MenuInterior';

export default function MobileMenu() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [open, setOpen] = useState(false);

  const handleButtonClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <div className={open ? 'hamburger active' : 'hamburger'}>
        <div
          className="ham-trigger flex-vertical"
          onClick={handleButtonClick}
          onKeyDown={handleButtonClick}
          role="button"
          tabIndex={0}
        >
          <div className={open ? 'ham-button active' : 'ham-button'}>
            <span className="line line-1"></span>
            <span className="line line-2"></span>
            <span className="line line-3"></span>
          </div>
        </div>
      </div>

      {open && (
        <menu className="navigation">
          <div className="nav-buffer">
            <div className="inside-sm flex-vertical-modified text-center">
              {isHome ? <Menu /> : <MenuInterior />}
            </div>
          </div>
        </menu>
      )}
    </>
  );
}
