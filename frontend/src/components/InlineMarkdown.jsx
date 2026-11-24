import React from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * Component that parses and renders inline markdown:
 * **bold**, *italic*, `code`, and [text](url)
 */
export function InlineMarkdown({ text }) {
  if (!text) return null;

  // Split tokens by bold, italic, code, and links
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return (
    <>
      {parts.map((part, idx) => {
        if (!part) return null;

        // Bold: **text**
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          return (
            <strong key={idx} style={{ fontWeight: 800, color: '#0d0d0d' }}>
              {part.slice(2, -2)}
            </strong>
          );
        }

        // Italic: *text*
        if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
          return (
            <em key={idx} style={{ fontStyle: 'italic' }}>
              {part.slice(1, -1)}
            </em>
          );
        }

        // Inline code: `code`
        if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
          return (
            <code
              key={idx}
              style={{
                fontFamily: 'var(--font-mono)',
                backgroundColor: '#fffae0',
                border: '1.5px solid #0d0d0d',
                padding: '1px 6px',
                fontSize: '0.88em',
                fontWeight: 700,
                borderRadius: '2px',
                color: '#0d0d0d',
                boxShadow: '1px 1px 0px #0d0d0d',
              }}
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        // Link: [text](url)
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const [, label, url] = linkMatch;
          return (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#0d0d0d',
                fontWeight: 800,
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                backgroundColor: '#ffee00',
                padding: '1px 5px',
                border: '1px solid #0d0d0d',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                margin: '0 2px',
                transition: 'background-color 0.15s ease',
              }}
              className="hover:bg-neo-pink hover:text-white"
            >
              <span>{label}</span>
              <ExternalLink size={11} style={{ strokeWidth: 2.5 }} />
            </a>
          );
        }

        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
}
