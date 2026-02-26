/**
 * Creates a stylesheet with the provided CSS variables and appends it to the document head.
 * @param {Object} cssVars - An object containing CSS variable names and their corresponding values.
 */
export default function createStylesheet(cssVars) {
  const styleTag = document.createElement('style');
  styleTag.setAttribute('id', 'theme-stylesheet');

  const declarations = Object.entries({
    ...cssVars,
    ...{
      '--__l-threshold': '0.7',
      '--__l': 'clamp(0, (l / var(--__l-threshold) - 1) * -infinity, 1)',
      '--__a': 'clamp(0.87, (l / var(--__l-threshold) - 1) * -infinity, 1)', // 0.87 is the default alpha value for black text.
    },
  })
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');

  styleTag.textContent = `:root {\n${declarations}\n}`;

  document.head.appendChild(styleTag);
}
