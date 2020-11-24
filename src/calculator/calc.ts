// mathjs does exist, but I wanted to implement my own to see how well it worked
// turns not out very well
// but it was still cool

export enum Operation {
  add = '+',
  sub = '-',
  mult = '*',
  div = '/',
  mod = '%',
  pow = '^',
}

// order of operations (parens taken care of already)
const operations: readonly (readonly Operation[])[] = [
  [Operation.pow],
  [Operation.mult, Operation.div, Operation.mod],
  [Operation.add, Operation.sub],
];

export type Parens = '(' | ')';
export type Token = number | Operation | Parens;
export type Operand = Calculation | number;

/** Immutable data structure to hold a calculation and its subcalculations. */
export class Calculation {
  readonly operands: [Operand, Operand];

  constructor(left: Operand, public readonly operation: Operation, right: Operand) {
    this.operands = [left, right];
  }
}

/** Parse a string into an `Operation`; returns `null` if invalid. */
const toOperation = (token: string): Operation | null => {
  const ops = Object.keys(Operation).filter(x => Operation[x] == token);
  return Operation[ops[0]] || null;
};

/** Parse a string into a constant; returns `null` if invalid. */
const toConstant = (token: string): number | null => {
  let constant = token;
  let sign = 1;
  if (/[+-]/.test(token[0])) {
    constant = token.slice(1);
    token[0] === '-' && (sign = -1);
  }

  const constants = {
    pi: Math.PI,
    π: Math.PI,
    phi: (1 + Math.sqrt(5)) / 2,
    ϕ: (1 + Math.sqrt(5)) / 2,
    ln2: Math.LN2,
    ln10: Math.LN10,
    log2e: Math.LOG2E,
    log10e: Math.LOG10E,
    e: Math.E,
  };

  return constants[constant.toLowerCase()] ? constants[constant.toLowerCase()] * sign : null;
};

/** Tokenize an input string. */
export const tokenize = (input: string): Token[] => {
  const tokens: Token[] = [];

  // very long regex (priority left to right)                           some other non-whitespace character
  //                                                                         pos/neg constant (e.g, pi) ┌─┐
  //                                         pos/neg number, including sci notation ┌───────────────────┤ │
  //       +- preceeded by a value ┌────────────────────────────────────────────────┤                   │ │
  //              ┌────────────────┤                                                │                   │ │
  const re = /\s*((?<=[^+\-^]+)[+-]|[+-]?([0-9]+(\.[0-9]*)?|\.[0-9]+)(e[+-]?[0-9]*)?|[+-]?[A-Za-z0-9πϕ]+|\S)\s*/g;

  let match: RegExpExecArray | null;
  while ((match = re.exec(input)) != null) {
    const token = match[1];

    if (toOperation(token)) tokens.push(toOperation(token) as Operation);
    else if (toConstant(token)) tokens.push(toConstant(token) as number);
    else if (/^\(|\)$/.test(token)) tokens.push(token as Parens);
    else if (parseFloat(token) != null && !Number.isNaN(parseFloat(token)))
      tokens.push(parseFloat(token));
    else throw new SyntaxError(`Unexpected token '${token}' at position ${match.index}.`);
  }

  return tokens;
};

/** Parse a token list into a calculation tree. */
export const parse = (tokens: Token[]): Operand => {
  let position = 0;

  const peek = () => tokens[position];

  const consume = (token: Token) => {
    if (token !== tokens[position])
      throw new Error(
        `Expected to consume '${token}' at position ${position} but got '${tokens[position]}'.`
      );
    position++;
  };

  const makeParser = (operations: readonly (readonly Operation[])[]) => {
    const parsers: (() => Operand)[] = [];

    // primary parser
    parsers.push(
      (): Operand => {
        const token = peek();

        if (typeof token === 'number') {
          consume(token);
          return token;
        } else if (token === '(') {
          consume(token);
          // call root parser again
          const expression = parsers[parsers.length - 1]();
          if (peek() !== ')')
            throw new SyntaxError(`Expected ')' at token #${position} but got '${peek()}'.`);
          consume(')');
          return expression;
        } else {
          throw new SyntaxError(`Expected an expression at token #${position} but got '${token}'.`);
        }
      }
    );

    operations.forEach((opList, i) => {
      parsers.push(() => {
        // call previous parser
        let left = parsers[i]();
        let op = peek();

        while (opList.some(o => o === op)) {
          consume(op);
          const right = parsers[i]();
          left = new Calculation(left, op as Operation, right);
          op = peek();
        }
        return left;
      });
    });

    return parsers[parsers.length - 1];
  };

  const parser = makeParser(operations);
  const result = parser();

  if (position !== tokens.length)
    throw new SyntaxError(`Unexpected token '${peek()}' at token #${position}.`);

  return result;
};

/** Evalulate a calculation tree. */
export const evaluate = (input: Operand): number => {
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
        throw new Error(`Invalid operation '${input.operation}'.`);
    }
  }
};

/** Tokenize, parse, and evaluate an input string. */
export const parseAndEval = (input: string, verbose = false): string => {
  verbose && console.debug('--------------------------------------');
  verbose && console.debug(`Attempting to calculate: '${input}'`);
  const tokens = tokenize(input);
  verbose && console.debug('Tokens: ');
  verbose && console.debug(tokens);
  const parsed = parse(tokens);
  verbose && console.debug('Parsed calculation: ');
  verbose && console.debug(parsed);
  const result = evaluate(parsed).toString();
  verbose && console.debug(`Got result: '${result}'`);
  return result;
};
