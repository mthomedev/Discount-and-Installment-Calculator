/**
 * Discount & Installment Calculator
 * Uses the flat (simple interest) method.
 *
 * Formula:
 *   discountedPrice  = price × (1 – discount/100)
 *   totalInterest    = discountedPrice × (rate/100) × installments
 *   totalToPay       = discountedPrice + totalInterest
 *   installmentValue = totalToPay / installments
 *   amortization     = discountedPrice / installments  (same every month)
 *   monthlyInterest  = discountedPrice × (rate/100)    (same every month)
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ── Config ─────────────────────────────────────────── */
  const CURRENCY = "USD";
  const LOCALE   = "en-US";

  /* ── Formatters ─────────────────────────────────────── */
  const fmtCurrency = new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  /** Parse a string/number, replacing comma with dot. Returns NaN on failure. */
  function toNumber(v) {
    if (typeof v === "number") return v;
    if (v === "" || v == null) return NaN;
    return parseFloat(String(v).trim().replace(",", "."));
  }

  /** Create a <td> with formatted text. */
  function td(text, isFirst = false) {
    const cell = document.createElement("td");
    cell.textContent = text;
    if (isFirst) cell.setAttribute("data-label", "#");
    return cell;
  }

  /* ── DOM refs ───────────────────────────────────────── */
  const form        = document.getElementById("form");
  const btnReset    = document.getElementById("btn-reset");
  const erroEl      = document.getElementById("erro");
  const resultados  = document.getElementById("resultados");
  const tabelaSecao = document.getElementById("tabelaSecao");
  const tbody       = document.querySelector("#tabela tbody");
  const tfoot       = document.getElementById("tfoot");

  const outPrecoDesconto = document.getElementById("precoComDesconto");
  const outParcela       = document.getElementById("valorParcela");
  const outTotal         = document.getElementById("totalPagar");
  const outEconomia      = document.getElementById("economia");

  const inputs = {
    preco:    document.getElementById("preco"),
    desconto: document.getElementById("desconto"),
    taxa:     document.getElementById("taxa"),
    parcelas: document.getElementById("parcelas"),
  };

  if (!form) { console.error("Form not found"); return; }

  /* ── Validation helpers ─────────────────────────────── */
  const validations = [
    { el: inputs.preco,    test: v => !isNaN(v) && v > 0,                   msg: "Price must be a positive number." },
    { el: inputs.desconto, test: v => !isNaN(v) && v >= 0 && v <= 100,      msg: "Discount must be between 0 and 100%." },
    { el: inputs.taxa,     test: v => !isNaN(v) && v >= 0,                  msg: "Interest rate must be ≥ 0." },
    { el: inputs.parcelas, test: v => !isNaN(v) && Number.isInteger(v) && v >= 1, msg: "Installments must be a whole number ≥ 1." },
  ];

  function validate(values) {
    for (const { el, test, msg } of validations) {
      el.classList.remove("invalid");
      if (!test(values[el.id] ?? values[Object.keys(values)[validations.indexOf({ el, test, msg })]])) {
        el.classList.add("invalid");
        return msg;
      }
    }
    return null;
  }

  function clearErrors() {
    erroEl.textContent = "";
    Object.values(inputs).forEach(el => el.classList.remove("invalid"));
  }

  /* ── Reset ──────────────────────────────────────────── */
  function resetAll() {
    form.reset();
    clearErrors();
    resultados.hidden  = true;
    tabelaSecao.hidden = true;
    tbody.innerHTML    = "";
    tfoot.innerHTML    = "";
    outPrecoDesconto.textContent = "—";
    outParcela.textContent       = "—";
    outTotal.textContent         = "—";
    outEconomia.textContent      = "—";
  }

  btnReset?.addEventListener("click", resetAll);

  /* ── Submit ─────────────────────────────────────────── */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    // Read values
    const price        = toNumber(inputs.preco.value);
    const discount     = toNumber(inputs.desconto.value);
    const rate         = toNumber(inputs.taxa.value);
    const installments = Number.parseInt(inputs.parcelas.value, 10);

    // Validate
    const values = { preco: price, desconto: discount, taxa: rate, parcelas: installments };
    const errMsg = validateAll(values);
    if (errMsg) {
      erroEl.textContent = errMsg;
      return;
    }

    // Calculate
    const discountedPrice = price * (1 - discount / 100);
    const monthlyRate     = rate / 100;
    const monthlyInterest = discountedPrice * monthlyRate;
    const totalInterest   = monthlyInterest * installments;
    const totalToPay      = discountedPrice + totalInterest;
    const installmentVal  = totalToPay / installments;
    const amortization    = discountedPrice / installments;
    const savings         = price - discountedPrice;

    // Update result cards
    outPrecoDesconto.textContent = fmtCurrency.format(discountedPrice);
    outParcela.textContent       = fmtCurrency.format(installmentVal);
    outTotal.textContent         = fmtCurrency.format(totalToPay);
    outEconomia.textContent      = fmtCurrency.format(savings);

    resultados.hidden  = false;

    // Build table
    tbody.innerHTML = "";
    tfoot.innerHTML = "";

    for (let month = 1; month <= installments; month++) {
      const remaining = Math.max(0, discountedPrice - amortization * month);
      const row = document.createElement("tr");
      row.appendChild(td(month, true));
      row.appendChild(td(fmtCurrency.format(installmentVal)));
      row.appendChild(td(fmtCurrency.format(monthlyInterest)));
      row.appendChild(td(fmtCurrency.format(amortization)));
      row.appendChild(td(fmtCurrency.format(remaining)));
      tbody.appendChild(row);
    }

    // Footer totals
    const footRow = document.createElement("tr");
    [
      "Total",
      fmtCurrency.format(totalToPay),
      fmtCurrency.format(totalInterest),
      fmtCurrency.format(discountedPrice),
      "—",
    ].forEach((text) => {
      const cell = document.createElement("td");
      cell.textContent = text;
      footRow.appendChild(cell);
    });
    tfoot.appendChild(footRow);

    tabelaSecao.hidden = false;

    // Smooth scroll to results
    resultados.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  /* ── Inline validation helper (rewritten to avoid index dependency) ── */
  function validateAll({ preco, desconto, taxa, parcelas }) {
    const checks = [
      { el: inputs.preco,    ok: !isNaN(preco) && preco > 0,                           msg: "Price must be a positive number." },
      { el: inputs.desconto, ok: !isNaN(desconto) && desconto >= 0 && desconto <= 100, msg: "Discount must be between 0 and 100%." },
      { el: inputs.taxa,     ok: !isNaN(taxa) && taxa >= 0,                            msg: "Interest rate must be ≥ 0." },
      { el: inputs.parcelas, ok: Number.isInteger(parcelas) && parcelas >= 1,          msg: "Installments must be a whole number ≥ 1." },
    ];
    for (const { el, ok, msg } of checks) {
      if (!ok) { el.classList.add("invalid"); return msg; }
    }
    return null;
  }

  // Clear invalid state on input change
  Object.values(inputs).forEach(el => {
    el.addEventListener("input", () => {
      el.classList.remove("invalid");
      if (erroEl.textContent) erroEl.textContent = "";
    });
  });
});
