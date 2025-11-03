/**
 * ASCII Generator Utilities
 * Helper functions for working with ASCII art in React components
 */

/**
 * Escapes special characters for safe SVG rendering
 */
export function escapeForSvg(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates a simple ASCII box around text
 */
export function createAsciiBox(text, options = {}) {
  const { padding = 2, char = '═' } = options;
  const lines = Array.isArray(text) ? text : [text];
  const maxLength = Math.max(...lines.map(l => l.length));
  
  const horizontalBorder = char.repeat(maxLength + padding * 2);
  const paddingStr = ' '.repeat(padding);
  
  const boxed = [
    `╔${horizontalBorder}╗`,
    ...lines.map(line => `║${paddingStr}${line.padEnd(maxLength)}${paddingStr}║`),
    `╚${horizontalBorder}╝`,
  ];
  
  return boxed.join('\n');
}

/**
 * Creates a simple progress bar in ASCII
 */
export function createProgressBar(percent, options = {}) {
  const { width = 20, filledChar = '█', emptyChar = '░' } = options;
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  
  return filledChar.repeat(filled) + emptyChar.repeat(empty);
}

/**
 * Converts text to ASCII banner format (simple version)
 */
export function createBanner(text, options = {}) {
  const { style = 'simple' } = options;
  
  if (style === 'simple') {
    const border = '='.repeat(text.length + 4);
    return `${border}\n  ${text}\n${border}`;
  }
  
  return text;
}

/**
 * Safely embed ASCII art in React components
 */
export function safeAsciiRender(asciiText) {
  // Remove any potentially harmful characters
  const safe = asciiText.replace(/<script>/gi, '');
  return safe;
}

/**
 * Generate inline SVG from ASCII text
 */
export function asciiToInlineSvg(lines, options = {}) {
  const {
    fontSize = 14,
    color = '#00f0ff',
    fontFamily = 'Courier New, monospace',
    lineHeight = 20,
  } = options;

  const width = Math.max(...lines.map(l => l.length)) * (fontSize * 0.6) + 20;
  const height = lines.length * lineHeight + 20;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `  <style>\n`;
  svg += `    text {\n`;
  svg += `      font-family: ${fontFamily};\n`;
  svg += `      font-size: ${fontSize}px;\n`;
  svg += `      fill: ${color};\n`;
  svg += `      letter-spacing: 2px;\n`;
  svg += `    }\n`;
  svg += `  </style>\n`;

  lines.forEach((line, index) => {
    const y = 20 + index * lineHeight;
    svg += `  <text x="10" y="${y}">${escapeForSvg(line)}</text>\n`;
  });

  svg += `</svg>`;
  return svg;
}

export default {
  escapeForSvg,
  createAsciiBox,
  createProgressBar,
  createBanner,
  safeAsciiRender,
  asciiToInlineSvg,
};
