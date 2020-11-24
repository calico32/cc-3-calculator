import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';

import { Icon } from '../components/Icon';

export interface HistoryEntry {
  input: string;
  result: string;
}
export interface HistoryItemProps extends HTMLAttributes<HTMLLIElement> {
  index: number;
  entry: HistoryEntry;
  setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
  setInputValue: (value: string) => void;
}

export const HistoryItem = ({
  index,
  entry,
  className,
  setHistory,
  setInputValue,
  ...other
}: HistoryItemProps): JSX.Element => {
  const isError = entry.result.startsWith('*!*');
  return (
    <li key={index} className={classNames(className, 'mb-1')} {...other}>
      {index !== 0 && <hr className="mb-1 border-gray-600" />}
      <div className="flex">
        <button
          className="invisible my-auto text-gray-500 history-button hover:text-gray-700 dark:hover:text-gray-200"
          onClick={() =>
            setHistory(old => {
              const newList = old.slice();
              newList.splice(index, 1);
              return newList;
            })
          }
        >
          <Icon icon="x" iconProps={{ height: 12, width: 12 }} />
        </button>
        <div className="flex-1"></div>
        <div>
          <span
            className="block text-xs text-gray-600 dark:text-gray-500 hover:underline hover:cursor-pointer"
            onClick={() => setInputValue(entry.input)}
          >
            {entry.input}
          </span>
          <span
            className={`block ${
              isError ? 'text-red-600 dark:text-red-500' : 'hover:underline hover:cursor-pointer'
            }`}
            onClick={!isError ? () => setInputValue(entry.result) : undefined}
          >
            {entry.result.replace(/\*!\*/g, '')}
          </span>
        </div>
      </div>
    </li>
  );
};
