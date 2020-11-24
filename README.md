# web calculator

it calculates!

live at <https://calc.wiisportsresorts.dev>.

more detail about technologies and how it's made are located in the about page (<https://calc.wiisportsresorts.dev/about>).

## extra features

- expression parsing: more than 1 operation per expression
- more operators: `%` (modulo) and `^` (exponent) operators in addition to `+-*/`
- GUI: website (and it's only 500 KB)
- calculation history: previous calculations are saved in local storage
- constants: pi, e, ln2, log2e, and more
- theming: light/dark mode

## running locally

Uses Yarn v2.

- `yarn`
- `yarn dev` (warning: ~30MB bundle)
- `yarn build:prod` for production bundle
- `yarn serve` for testing HTTP server
