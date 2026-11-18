import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0a0e27" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="description"
          content="Paul Madu - Fullstack Developer Portfolio. Expert in React, Next.js, Python, Django, Node.js, and modern web technologies."
        />
      </Head>
      <body>
        {/* Decide before first paint whether drones will draw the headers, so
            the plain-text fallback never flashes on WebGL-capable browsers. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var c=document.createElement('canvas');if(c.getContext('webgl2')||c.getContext('webgl'))document.documentElement.classList.add('drones-on')}catch(e){}",
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
