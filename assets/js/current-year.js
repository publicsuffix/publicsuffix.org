// Keeps the footer copyright end year current. The HTML holds the year of the
// last edit as a fallback for clients that do not run JavaScript.
for (const el of document.querySelectorAll('[data-current-year]')) {
  el.textContent = String(new Date().getFullYear()).slice(-2);
}
