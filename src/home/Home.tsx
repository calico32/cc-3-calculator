import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { HTMLDivProps } from '../types';

import './home.scss';

// @ts-expect-error its an image
const { default: calcLight } = await import('../../assets/calc-light.png');
// @ts-expect-error its an image
const { default: calcDark } = await import('../../assets/calc-dark.png');

export default (props: HTMLDivProps): JSX.Element => {
  return (
    <div {...props}>
      <span className="text-4xl font-bold text-gray-800 dark:text-white">
        a calculator, but in the browser
      </span>

      <div className="grid h-64 grid-cols-12 mx-auto mt-20 lg:grid-rows-title-lg grid-rows-title">
        <div
          className="col-span-12 col-start-1 row-span-1 row-start-2 shadow-xl rounded-xl bg-gradient-to-br from-gray-200 to-gray-300"
          id="title-card"
        ></div>
        <div
          className="col-span-12 col-start-1 row-span-1 row-start-2 shadow-xl rounded-xl bg-gradient-to-br from-gray-700 to-gray-800"
          id="title-card-dark"
        ></div>
        <div
          className="col-span-12 col-start-1 row-span-1 row-start-2 p-8 bg-transparent"
          id="title-card-content"
        >
          <span className="block mb-2 text-2xl font-bold">it works, sometimes</span>
          <span className="block">it might function, who knows</span>
          <NavLink to="/calculator">
            <button className="px-4 py-2 mt-4 font-bold text-white duration-150 bg-teal-500 rounded shadow hover:bg-teal-400">
              try it
            </button>
          </NavLink>
          <NavLink to="/about">
            <button className="relative px-4 py-2 mt-4 ml-2 font-bold text-gray-800 rounded dark:text-white bg:transparent">
              read about page
              <div className="absolute inset-0 border-2 border-teal-500 rounded"></div>
            </button>
          </NavLink>
        </div>
        <img
          src={calcLight}
          className="z-10 row-span-3 row-start-1 my-auto rounded-lg shadow-xl md:col-span-5 md:col-start-7 xl:col-start-8 xl:col-span-4"
          id="title-image"
        />
        <img
          src={calcDark}
          className="z-10 row-span-3 row-start-1 my-auto rounded-lg shadow-xl md:col-span-5 md:col-start-7 xl:col-start-8 xl:col-span-4"
          id="title-image-dark"
        />
      </div>
    </div>
  );
};
