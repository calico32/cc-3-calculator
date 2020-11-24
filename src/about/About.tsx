import React from 'react';

import { HTMLDivProps } from '../types';

// @ts-expect-error its an image
const { default: calc } = await import('../../assets/calc-about.png');

export default (props: HTMLDivProps): JSX.Element => (
  <div {...props}>
    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">About</h1>

    <h2 className="mt-2 text-lg text-gray-800 dark:text-white">
      Repository:{' '}
      <a
        className="link"
        href="https://github.com/wiisportsresort/cc-3-calculator/"
        target="_blank"
      >
        https://github.com/wiisportsresort/cc-3-calculator
      </a>
    </h2>

    <h2 className="mt-8 text-xl font-bold text-gray-800 dark:text-white">Inner workings</h2>
    <section className="mt-4">
      <p>
        The first step in calculating the user's input is <strong>tokenization</strong> - the
        process of splitting the string into individual bits. This is done with a super long regular
        expession. Here it is:
      </p>
      <code className="block my-2">
        {
          '/\\s*((?<=[^+\\-^]+)[+-]|[+-]?([0-9]+(\\.[0-9]*)?|\\.[0-9]+)(e[+-]?[0-9]*)?|[+-]?[A-Za-z0-9πϕ]+|\\S)\\s*/g'
        }
      </code>
      Broken up into sections, this checks for (ordered by priority):
      <ul className="ml-4 list-disc">
        <li>A + or - preceeded by a number/value</li>
        <li>
          A number, optionally preceeded by + or -, optionally followed by a <code>.</code> and 0-9,
          optionally follwed by an <code>e</code> and 0-9 (for scientific notation).
        </li>
        <li>A defined constant (pi, e, etc), optionally preceded by a + or -</li>
        <li>A single non-whitespace character (catch-all for operators)</li>
      </ul>
    </section>
    <section className="mt-6">
      <p>
        Once tokenized, the expression can be parsed into a node tree. This is the process of
        turning <code>[1, '+', 1]</code> into{' '}
        <code>
          {'{'} operation: '+', operands: [1, 1] {'}'}.{' '}
        </code>
      </p>
      <p>
        This a pretty complex step, but it works (most of the time). The parser starts at line 91 in{' '}
        <a
          className="link"
          href="https://github.com/wiisportsresort/cc-3-calculator/blob/master/src/calculator/calc.ts"
          target="_blank"
        >
          src/calculator/calc.ts
        </a>
        .
      </p>
    </section>
    <section className="mt-6">
      <p>
        The final step is calculating each level of the node tree. A recursive function traverses
        the tree, and, at each step, if the operands are both numbers, they are calculated and
        reduced to a number. The parent calculation can now be calculated, and so on until the
        entire tree has been reduced to a single number.
      </p>

      <pre>
        {`
type Operand = Calculation | number;

interface Calculation {
  operands: [Operand, Operand];
  operation: Operation;
}

const evaluate = (input: Operand): number => {
  if (typeof input === 'number') return input;
  else {
    const [lhs, rhs] = input.operands.map(evaluate);

    switch (input.operation) {
      case Operation.add:
        return lhs + rhs;
      case Operation.sub:
        return lhs - rhs;
      case Operation.mult:
        return lhs * rhs;
      case Operation.div:
        return lhs / rhs;
      case Operation.mod:
        return lhs % rhs;
      case Operation.pow:
        return lhs ** rhs;
      default:
        throw new Error(\`Invalid operation '\${input.operation}'.\`);
    }
  }
};
    `}
      </pre>
    </section>
    <h2 className="mt-8 text-xl font-bold text-gray-800 dark:text-white">Calculator Frontend</h2>
    <p>
      The frontend for the calculator logic lives in{' '}
      <a
        className="link"
        href="https://github.com/wiisportsresort/cc-3-calculator/blob/master/src/calculator/Calculator.tsx"
        target="_blank"
      >
        src/calculator/Calculator.tsx
      </a>
      . Previous calculations are stored in the list above, which is saved to local storage. Errors
      are also displayed here.
    </p>
    <img src={calc} alt="calculator!!" className="mt-2 rounded-sm shadow-xl w-96" />

    <h2 className="mt-8 text-xl font-bold text-gray-800 dark:text-white">Technology Stack</h2>
    <ul className="ml-4 list-disc">
      <li>
        <strong>nginx</strong> as webserver
      </li>
      <li>
        <strong>webpack</strong> as bundler
      </li>
      <li>
        <strong>Typescript/JSX</strong> as programming/markup language
      </li>
      <li>
        <strong>Sass</strong> as styling language
      </li>
      <li>
        <strong>React</strong> as UI library
      </li>
      <li>
        <strong>TailwindCSS</strong> as design/utility framework
      </li>
      <li>
        <strong>Trivago</strong> as hotel
      </li>
    </ul>
  </div>
);
