import classNames from 'classnames';
import React from 'react';

import { HTMLDivProps } from '../types';

export const Footer = (props: HTMLDivProps): JSX.Element => {
  const { className, ...other } = props;
  return (
    <footer
      className={classNames(
        className,
        'object-bottom bottom-0 left-0 w-auto p-2 mt-4 -mx-4 -mb-4 bg-gray-400 dark:bg-gray-800 transition-colors duration-500'
      )}
      {...other}
    >
      © 2020 wiisportsresort under{' '}
      <a
        className="link"
        href="https://github.com/wiisportsresort/cc-3-calculator/blob/master/LICENSE"
        target="_blank"
      >
        MIT License
      </a>
    </footer>
  );
};
