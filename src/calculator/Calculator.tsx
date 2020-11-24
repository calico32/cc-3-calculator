import React from 'react';

import { Icon } from '../components/Icon';
import { HTMLDivProps } from '../types';
import { parseAndEval } from './calc';
import { HistoryEntry, HistoryItem } from './HistoryItem';

import './calculator.scss';

const { useEffect, useRef, useState } = React;

// not the best solution but it works
let previousHistoryLength = 0;

export default (props: HTMLDivProps): JSX.Element => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  let historyIndex = 0;
  let savedTempValue = '';

  const historyRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const tryCalculate = () => {
    if (!inputRef.current) return;
    if (!inputRef.current.value.trim()) return;
    const input = inputRef.current.value;
    let result: string;
    try {
      result = parseAndEval(input, true);
    } catch (err) {
      console.warn(err);
      result = '*!*' + err.message;
    }
    inputRef.current.value = '';
    setHistory(old => [...old, { input, result }]);
  };

  const setInputValue = (val: string) => {
    if (!inputRef.current) return;
    inputRef.current.value = val.toString();
    historyIndex = 0;
    inputRef.current.focus();
  };

  useEffect(() => {
    const stored = localStorage.getItem('calculatorHistory');
    if (!stored) return;
    const items = JSON.parse(stored);
    previousHistoryLength = items.length;
    setHistory(items);
  }, []);

  useEffect(() => {
    if (history.length > previousHistoryLength)
      historyRef.current?.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'start',
      });
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
    previousHistoryLength = history.length;
  }, [history]);

  return (
    <div {...props}>
      <div className="flex items-center justify-center h-full overflow-hidden">
        <div className="flex flex-col w-5/6 overflow-hidden text-gray-800 bg-gray-200 rounded shadow-sm dark:text-gray-300 dark:bg-gray-800 xl:w-3/6 h-5/6">
          <ul
            className="flex-1 p-2 overflow-x-hidden overflow-y-scroll text-right list-none"
            ref={historyRef}
          >
            {history.map((entry, key) => (
              <HistoryItem
                index={key}
                key={key}
                entry={entry}
                setHistory={setHistory}
                setInputValue={setInputValue}
              />
            ))}
            {/* bottom scroll target */}
            <li></li>
          </ul>
          <div className="flex items-center rounded">
            <button
              className="flex items-center justify-center w-12 h-12 text-gray-500 transition bg-gray-300 rounded-bl dark:bg-gray-700 dark:text-gray-300 hover:text-white hover:bg-red-500 dark:hover:text-white dark:hover:bg-red-400"
              onClick={() => setHistory([])}
              title="Clear all history entries"
            >
              <Icon icon="trash" />
            </button>
            <input
              placeholder="expression"
              className="flex-grow h-12 px-4 text-right text-gray-600 bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
              onKeyDown={event => {
                if (!inputRef.current) return;

                switch (event.key) {
                  case 'Enter':
                    inputRef.current.value.trim() && tryCalculate();
                    break;

                  // spaces cause problems in tokenization and i dont feel like fixing it
                  // TODO
                  case ' ':
                    event.preventDefault();
                    break;

                  // shell-like history
                  case 'ArrowUp':
                    event.preventDefault();
                    if (history.length - (historyIndex + 1) < 0) return;
                    if (historyIndex == 0) savedTempValue = inputRef.current.value;
                    historyIndex++;
                    inputRef.current.value = history[history.length - historyIndex].input;
                    break;
                  case 'ArrowDown':
                    event.preventDefault();
                    if (historyIndex > 0) historyIndex--;
                    if (historyIndex == 0) return (inputRef.current.value = savedTempValue);
                    inputRef.current.value = history[history.length - historyIndex].input;
                }
              }}
              ref={inputRef}
            />
            <button
              className="flex items-center justify-center w-12 h-12 text-white transition bg-blue-400 rounded-br hover:bg-blue-500"
              onClick={tryCalculate}
              title="Calculate current expression"
            >
              <Icon icon="send" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
