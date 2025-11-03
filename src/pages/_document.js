import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0a0e27" />
        <meta
          name="description"
          content="Paul Madu - Fullstack Developer Portfolio. Expert in React, Next.js, Python, Django, Node.js, and modern web technologies."
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
