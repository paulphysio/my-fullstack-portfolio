export default function AsciiImage({ 
  src, 
  alt = 'ASCII art', 
  className = '',
  inline = false 
}) {
  // For SVG ASCII images
  if (src.endsWith('.svg')) {
    return (
      <div 
        className={`ascii-image ${className}`}
        role="img"
        aria-label={alt}
      >
        <object 
          data={src} 
          type="image/svg+xml"
          aria-label={alt}
        >
          {alt}
        </object>
      </div>
    );
  }

  // For PNG/JPG/image files
  if (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.gif') || src.endsWith('.webp')) {
    return (
      <div 
        className={`ascii-image ${className}`}
        role="img"
        aria-label={alt}
      >
        <img 
          src={src} 
          alt={alt}
          loading="lazy"
        />
      </div>
    );
  }

  // For inline ASCII text
  if (inline) {
    return (
      <pre 
        className={`ascii-inline ${className}`}
        role="img"
        aria-label={alt}
      >
        {src}
      </pre>
    );
  }

  return null;
}
