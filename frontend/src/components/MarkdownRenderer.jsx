import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { InlineMarkdown } from './InlineMarkdown';

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        margin: '0.9rem 0',
        border: '3px solid #0d0d0d',
        boxShadow: '4px 4px 0px #0d0d0d',
        backgroundColor: '#0d0d0d',
        borderRadius: '3px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#1c1c1c',
          padding: '0.35rem 0.8rem',
          borderBottom: '2px solid #333',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#00f0ff',
            textTransform: 'uppercase',
          }}
        >
          {language || 'CODE'}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: copied ? '#10e060' : '#ffee00',
            color: '#0d0d0d',
            border: '2px solid #0d0d0d',
            padding: '0.15rem 0.5rem',
            fontSize: '0.68rem',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '1px 1px 0px #000',
          }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          <span>{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '0.9rem 1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.86rem',
          lineHeight: 1.5,
          color: '#00ff66',
          overflowX: 'auto',
          whiteSpace: 'pre',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Universal Neo-Brutalist Markdown Renderer
 */
export function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  // Split content by code block markers (```)
  const segments = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        value: content.slice(lastIndex, match.index),
      });
    }
    segments.push({
      type: 'code',
      language: match[1] || 'text',
      value: match[2].trimEnd(),
    });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      value: content.slice(lastIndex),
    });
  }

  return (
    <div className={`rendered-markdown ${className}`} style={{ width: '100%' }}>
      {segments.map((seg, sIdx) => {
        if (seg.type === 'code') {
          return <CodeBlock key={sIdx} code={seg.value} language={seg.language} />;
        }

        // Render standard text blocks (paragraphs, headers, lists)
        const lines = seg.value.split('\n');
        const elements = [];
        let listItems = [];
        let listType = null; // 'ul' | 'ol'

        const flushList = () => {
          if (listItems.length > 0 && listType) {
            const ListTag = listType;
            elements.push(
              <ListTag
                key={`list-${elements.length}`}
                style={{
                  margin: '0.6rem 0 0.8rem 1.4rem',
                  paddingLeft: '0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                {listItems.map((li, liIdx) => (
                  <li key={liIdx} style={{ lineHeight: 1.6 }}>
                    <InlineMarkdown text={li} />
                  </li>
                ))}
              </ListTag>
            );
            listItems = [];
            listType = null;
          }
        };

        for (let i = 0; i < lines.length; i++) {
          const rawLine = lines[i];
          const line = rawLine.trim();

          if (!line) {
            flushList();
            continue;
          }

          // Headers
          if (line.startsWith('# ')) {
            flushList();
            elements.push(
              <h1
                key={i}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '1.45rem',
                  margin: '1.2rem 0 0.6rem',
                  borderBottom: '3px solid #0d0d0d',
                  paddingBottom: '0.3rem',
                }}
              >
                <InlineMarkdown text={line.slice(2)} />
              </h1>
            );
            continue;
          }

          if (line.startsWith('## ')) {
            flushList();
            elements.push(
              <h2
                key={i}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  margin: '1rem 0 0.5rem',
                  borderBottom: '2px solid #0d0d0d',
                  paddingBottom: '0.2rem',
                }}
              >
                <InlineMarkdown text={line.slice(3)} />
              </h2>
            );
            continue;
          }

          if (line.startsWith('### ')) {
            flushList();
            elements.push(
              <h3
                key={i}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.08rem',
                  margin: '0.85rem 0 0.4rem',
                  color: '#0d0d0d',
                }}
              >
                <InlineMarkdown text={line.slice(4)} />
              </h3>
            );
            continue;
          }

          // Blockquote
          if (line.startsWith('> ')) {
            flushList();
            elements.push(
              <blockquote
                key={i}
                style={{
                  borderLeft: '5px solid #0d0d0d',
                  backgroundColor: '#fffae0',
                  padding: '0.6rem 0.9rem',
                  margin: '0.7rem 0',
                  fontStyle: 'italic',
                  borderTop: '1px solid #0d0d0d',
                  borderRight: '1px solid #0d0d0d',
                  borderBottom: '1px solid #0d0d0d',
                  boxShadow: '2px 2px 0px #0d0d0d',
                }}
              >
                <InlineMarkdown text={line.slice(2)} />
              </blockquote>
            );
            continue;
          }

          // Unordered list item
          if (/^[-*]\s+/.test(line)) {
            if (listType !== 'ul') {
              flushList();
              listType = 'ul';
            }
            listItems.push(line.replace(/^[-*]\s+/, ''));
            continue;
          }

          // Ordered list item
          if (/^\d+\.\s+/.test(line)) {
            if (listType !== 'ol') {
              flushList();
              listType = 'ol';
            }
            listItems.push(line.replace(/^\d+\.\s+/, ''));
            continue;
          }

          // Horizontal rule
          if (/^---$|^___$|^\*\*\*$/.test(line)) {
            flushList();
            elements.push(
              <hr
                key={i}
                style={{
                  border: 'none',
                  borderTop: '2px dashed #0d0d0d',
                  margin: '1rem 0',
                }}
              />
            );
            continue;
          }

          // Standard paragraph
          flushList();
          elements.push(
            <p
              key={i}
              style={{
                marginBottom: '0.75rem',
                lineHeight: 1.65,
                color: '#0d0d0d',
              }}
            >
              <InlineMarkdown text={line} />
            </p>
          );
        }

        flushList();
        return <React.Fragment key={sIdx}>{elements}</React.Fragment>;
      })}
    </div>
  );
}
