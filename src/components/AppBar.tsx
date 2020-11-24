import React from 'react';
import { NavLink } from 'react-router-dom';

import { Icon } from './Icon';

import './AppBar.scss';

export const AppBar = ({
  dark,
  setDark,
}: {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const navLinkHandler = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if ((event.target as HTMLElement).classList.contains('active')) event.preventDefault();
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center h-16 px-4 text-gray-100 shadow-lg justify-items-center bg-gradient-to-br from-teal-600 to-blue-400">
      <Icon icon="hash" className="w-8" />
      <span className="p-0 text-xl font-medium font-display">calculator</span>
      <NavLink exact to="/" className="ml-8" onClick={navLinkHandler}>
        home
      </NavLink>
      <NavLink to="/calculator" className="ml-4" onClick={navLinkHandler}>
        calculator
      </NavLink>
      <NavLink to="/about" className="ml-4" onClick={navLinkHandler}>
        about
      </NavLink>
      <div className="flex-1"></div>
      <div className="flex items-center space-x-2">
        <Icon icon="moon" iconProps={{ height: 20, width: 20 }} />
        <button
          role="switch"
          id="dark-mode-switch"
          tabIndex={0}
          className={`inline-flex items-center px-0.5 rounded-full w-12 h-6 transition-colors duration-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-gray-500 focus:outline-none ${
            dark ? 'justify-end bg-green-500' : 'bg-gray-500'
          }`}
          onClick={() => setDark(!dark)}
        >
          <span className="sr-only">Enable dark mode</span>
          <span
            className="w-5 h-5 bg-white rounded-full shadow-sm"
            style={{ transformOrigin: '100% 50% 0px' }}
          ></span>
        </button>
      </div>
    </nav>
  );
};
