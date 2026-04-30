# Discount & Installment Calculator

A lightweight, accessible web calculator that simulates **flat (simple) interest** installment plans with optional discount support — built with vanilla HTML, CSS and JavaScript, no dependencies.

## Features

- **Discount simulation** — apply a percentage discount before calculating interest
- **Simple interest installment table** — full amortization schedule with monthly breakdown
- **Summary cards** — discounted price, installment value, total to pay and savings at a glance
- **Responsive layout** — works on mobile, tablet and desktop
- **Accessible** — semantic HTML, ARIA labels, live regions for errors, `prefers-reduced-motion` support
- **Reset button** — clear all fields and results in one click
- **Input validation** — clear, contextual error messages per field

## Getting started

No build tools or package manager required.

```bash
git clone https://github.com/mthomedev/Discount-and-Installment-Calculator
cd discount-installment-calculator
# Open index.html in your browser
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

Or simply drag `index.html` into any modern browser.

## How it works

The calculator uses the **flat (simple) interest** method, where interest is computed once on the principal and spread evenly across all installments — common in retail and consumer financing contexts.

| Variable           | Formula                           |
| ------------------ | --------------------------------- |
| Discounted price   | `price × (1 – discount / 100)`    |
| Monthly interest   | `discountedPrice × (rate / 100)`  |
| Total interest     | `monthlyInterest × installments`  |
| Total to pay       | `discountedPrice + totalInterest` |
| Installment value  | `totalToPay / installments`       |
| Amortization/month | `discountedPrice / installments`  |

> **Note:** This is _not_ the compound interest (Price Table / SAC) method. Each month the interest amount is the same.

## Project structure

```
discount-installment-calculator/
├── index.html        # Main HTML — semantic, accessible markup
├── css/
│   └── style.css     # Design tokens, layout, components, responsive
├── js/
│   └── script.js     # Calculation logic, DOM manipulation, validation
└── README.md
```

## Tech stack

| Technology          | Purpose                                    |
| ------------------- | ------------------------------------------ |
| HTML5               | Semantic structure, accessibility          |
| CSS3                | Custom properties, Grid, responsive design |
| JavaScript (ES2020) | Calculation engine, DOM, `Intl` API        |
| Google Fonts        | Sora (UI) + DM Mono (numbers)              |

## Contributing

Contributions are welcome! To propose a change:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push and open a Pull Request

Ideas for future improvements:

- [ ] Compound interest (Price Table / SAC) modes
- [ ] Dark mode toggle
- [ ] Export table as CSV or PDF
- [ ] Currency selector
- [ ] Shareable URL with pre-filled values

## License

[MIT](LICENSE) — free to use, modify and distribute.
