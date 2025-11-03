#!/usr/bin/env node

/**
 * ASCII Art Generator for SVG
 * Usage: node scripts/generate-ascii.js "TEXT" > output.svg
 * Or: npm run generate-ascii "TEXT" > output.svg
 */

const ASCII_FONTS = {
  block: {
    A: ['██████╗ ', '██╔══██╗', '███████║', '██╔══██║', '██║  ██║'],
    B: ['██████╗ ', '██╔══██╗', '██████╔╝', '██╔══██╗', '██████╔╝'],
    C: ['██████╗ ', '██╔════╝', '██║     ', '██║     ', '╚██████╗'],
    D: ['██████╗ ', '██╔══██╗', '██║  ██║', '██║  ██║', '██████╔╝'],
    E: ['███████╗', '██╔════╝', '█████╗  ', '██╔══╝  ', '███████╗'],
    F: ['███████╗', '██╔════╝', '█████╗  ', '██╔══╝  ', '██║     '],
    G: ['██████╗ ', '██╔════╝', '██║  ███╗', '██║   ██║', '╚██████╔╝'],
    H: ['██╗  ██╗', '██║  ██║', '███████║', '██╔══██║', '██║  ██║'],
    I: ['██╗', '██║', '██║', '██║', '██║'],
    J: ['     ██╗', '     ██║', '     ██║', '██   ██║', '╚█████╔╝'],
    K: ['██╗  ██╗', '██║ ██╔╝', '█████╔╝ ', '██╔═██╗ ', '██║  ██╗'],
    L: ['██╗     ', '██║     ', '██║     ', '██║     ', '███████╗'],
    M: ['███╗   ███╗', '████╗ ████║', '██╔████╔██║', '██║╚██╔╝██║', '██║ ╚═╝ ██║'],
    N: ['███╗   ██╗', '████╗  ██║', '██╔██╗ ██║', '██║╚██╗██║', '██║ ╚████║'],
    O: ['██████╗ ', '██╔═══██╗', '██║   ██║', '██║   ██║', '╚██████╔╝'],
    P: ['██████╗ ', '██╔══██╗', '██████╔╝', '██╔═══╝ ', '██║     '],
    Q: ['██████╗ ', '██╔═══██╗', '██║   ██║', '██║▄▄ ██║', '╚██████╔╝'],
    R: ['██████╗ ', '██╔══██╗', '██████╔╝', '██╔══██╗', '██║  ██║'],
    S: ['███████╗', '██╔════╝', '███████╗', '╚════██║', '███████║'],
    T: ['████████╗', '╚══██╔══╝', '   ██║   ', '   ██║   ', '   ██║   '],
    U: ['██╗   ██╗', '██║   ██║', '██║   ██║', '██║   ██║', '╚██████╔╝'],
    V: ['██╗   ██╗', '██║   ██║', '██║   ██║', '╚██╗ ██╔╝', ' ╚████╔╝ '],
    W: ['██╗    ██╗', '██║    ██║', '██║ █╗ ██║', '██║███╗██║', '╚███╔███╔╝'],
    X: ['██╗  ██╗', '╚██╗██╔╝', ' ╚███╔╝ ', ' ██╔██╗ ', '██╔╝ ██╗'],
    Y: ['██╗   ██╗', '╚██╗ ██╔╝', ' ╚████╔╝ ', '  ╚██╔╝  ', '   ██║   '],
    Z: ['███████╗', '╚══███╔╝', '  ███╔╝ ', ' ███╔╝  ', '███████╗'],
    ' ': ['   ', '   ', '   ', '   ', '   '],
  },
};

function generateASCIIArt(text, options = {}) {
  const {
    font = 'block',
    color = '#00f0ff',
    fontSize = 14,
    spacing = 2,
  } = options;

  const chars = text.toUpperCase().split('');
  const lines = ['', '', '', '', ''];

  // Build each line by concatenating character slices
  chars.forEach((char) => {
    const charArt = ASCII_FONTS[font][char] || ASCII_FONTS[font][' '];
    charArt.forEach((line, index) => {
      lines[index] += line + ' '.repeat(spacing);
    });
  });

  return lines;
}

function generateSVG(text, options = {}) {
  const {
    color = '#00f0ff',
    fontSize = 14,
    width = 800,
    height = 200,
  } = options;

  const lines = generateASCIIArt(text, options);
  const lineHeight = fontSize + 5;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `  <style>\n`;
  svg += `    text {\n`;
  svg += `      font-family: 'Courier New', Courier, monospace;\n`;
  svg += `      font-size: ${fontSize}px;\n`;
  svg += `      fill: ${color};\n`;
  svg += `      letter-spacing: 2px;\n`;
  svg += `    }\n`;
  svg += `  </style>\n`;

  lines.forEach((line, index) => {
    const y = 20 + index * lineHeight;
    svg += `  <text x="10" y="${y}">${escapeXml(line)}</text>\n`;
  });

  svg += `</svg>`;
  return svg;
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateBadgeSVG(text, options = {}) {
  const {
    color = '#00f0ff',
    icon = '',
    width = 120,
    height = 80,
  } = options;

  const padding = Math.max(text.length + 6, 10);
  const border = '═'.repeat(padding);

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `  <style>\n`;
  svg += `    text {\n`;
  svg += `      font-family: 'Courier New', Courier, monospace;\n`;
  svg += `      font-size: 10px;\n`;
  svg += `      fill: ${color};\n`;
  svg += `    }\n`;
  svg += `  </style>\n`;

  if (icon) {
    svg += `  <text x="5" y="15">${icon}</text>\n`;
  }
  svg += `  <text x="5" y="30">╔${border}╗</text>\n`;
  svg += `  <text x="5" y="45">║ ${text.padEnd(padding - 2)} ║</text>\n`;
  svg += `  <text x="5" y="60">╚${border}╝</text>\n`;
  svg += `</svg>`;

  return svg;
}

// Main execution
const args = process.argv.slice(2);
const text = args[0] || 'HELLO';
const type = args[1] || 'banner'; // banner or badge
const color = args[2] || '#00f0ff';
const icon = args[3] || '';

if (type === 'badge') {
  console.log(generateBadgeSVG(text, { color, icon }));
} else {
  console.log(generateSVG(text, { color }));
}

module.exports = { generateASCIIArt, generateSVG, generateBadgeSVG };
