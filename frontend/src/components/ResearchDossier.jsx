import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Globe,
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { InlineMarkdown } from './InlineMarkdown';
import { extractDomain } from '../services/dossierParser';

const BADGE_COLORS = ['bg-neo-cyan', 'bg-neo-yellow', 'bg-neo-lime', 'bg-neo-pink', 'bg-neo-purple'];

export function ResearchDossier({ report, rawContent }) {
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!report) return null;

  const { answer = '', key_points = [], sources = [], limitations = [] } = report;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(answer);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyFull = () => {
    let fullText = answer;
    if (key_points.length > 0) {
      fullText += '\n\n### Key Points\n' + key_points.map((pt) => `- ${pt}`).join('\n');
    }
    if (sources.length > 0) {
      fullText +=
        '\n\n### Sources\n' +
        sources
          .map((s) => `- [${s.title || s.url}](${s.url})${s.relevance ? `: ${s.relevance}` : ''}`)
          .join('\n');
    }
    if (limitations.length > 0) {
      fullText += '\n\n### Limitations\n' + limitations.map((lim) => `- ${lim}`).join('\n');
    }

    navigator.clipboard.writeText(rawContent || fullText);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        width: '100%',
      }}
    >
      {/* Top Dossier Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.6rem',
          padding: '0.5rem 0.8rem',
          backgroundColor: '#ffee00',
          border: '2px solid #0d0d0d',
          boxShadow: '3px 3px 0px #0d0d0d',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="neo-badge bg-black" style={{ color: '#00ff66', fontSize: '0.68rem' }}>
            ⚡ INTELLIGENCE DOSSIER
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.75rem',
              color: '#0d0d0d',
            }}
          >
            VERIFIED SYNTHESIS
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={handleCopySummary}
            type="button"
            className="neo-btn bg-white"
            style={{
              padding: '0.2rem 0.6rem',
              fontSize: '0.68rem',
              borderWidth: '2px',
              boxShadow: '2px 2px 0px #000',
            }}
            title="Copy Executive Summary"
          >
            {copiedSummary ? <Check size={11} color="#10e060" /> : <Copy size={11} />}
            <span>{copiedSummary ? 'SUMMARY COPIED' : 'COPY SUMMARY'}</span>
          </button>

          <button
            onClick={handleCopyFull}
            type="button"
            className="neo-btn bg-white"
            style={{
              padding: '0.2rem 0.6rem',
              fontSize: '0.68rem',
              borderWidth: '2px',
              boxShadow: '2px 2px 0px #000',
            }}
            title="Copy Full Intelligence Dossier"
          >
            {copiedFull ? <Check size={11} color="#10e060" /> : <FileText size={11} />}
            <span>{copiedFull ? 'DOSSIER COPIED' : 'COPY ALL'}</span>
          </button>
        </div>
      </div>

      {/* Section 1: Executive Summary */}
      {answer && (
        <div
          style={{
            border: '2px solid #0d0d0d',
            boxShadow: '4px 4px 0px #0d0d0d',
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.3rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '0.75rem',
              paddingBottom: '0.4rem',
              borderBottom: '2px solid #0d0d0d',
            }}
          >
            <Sparkles size={16} color="#0d0d0d" style={{ strokeWidth: 2.5 }} />
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#0d0d0d',
                margin: 0,
              }}
            >
              Executive Synthesis
            </h4>
          </div>

          <div
            style={{
              fontSize: '0.97rem',
              lineHeight: 1.7,
              color: '#1a1a1a',
            }}
          >
            <MarkdownRenderer content={answer} />
          </div>
        </div>
      )}

      {/* Section 2: Key Findings & Strategic Takeaways */}
      {key_points && key_points.length > 0 && (
        <div
          style={{
            border: '2px solid #0d0d0d',
            boxShadow: '4px 4px 0px #0d0d0d',
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.3rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
              paddingBottom: '0.4rem',
              borderBottom: '2px solid #0d0d0d',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <CheckCircle2 size={16} color="#0d0d0d" style={{ strokeWidth: 2.5 }} />
              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#0d0d0d',
                  margin: 0,
                }}
              >
                Key Findings & Strategic Takeaways
              </h4>
            </div>
            <span className="neo-badge bg-neo-cyan" style={{ fontSize: '0.65rem' }}>
              {key_points.length} POINTS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {key_points.map((point, idx) => {
              const badgeBg = BADGE_COLORS[idx % BADGE_COLORS.length];
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.75rem 0.9rem',
                    backgroundColor: '#faf8f2',
                    border: '2px solid #0d0d0d',
                    boxShadow: '2px 2px 0px #0d0d0d',
                  }}
                >
                  <span
                    className={`neo-badge ${badgeBg}`}
                    style={{
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '0.1rem 0.4rem',
                      marginTop: '0.1rem',
                      flexShrink: 0,
                    }}
                  >
                    #{String(idx + 1).padStart(2, '0')}
                  </span>
                  <div
                    style={{
                      fontSize: '0.92rem',
                      lineHeight: 1.55,
                      color: '#1a1a1a',
                      flex: 1,
                    }}
                  >
                    <InlineMarkdown text={point} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 3: Verified Primary Sources & Citations */}
      {sources && sources.length > 0 && (
        <div
          style={{
            border: '2px solid #0d0d0d',
            boxShadow: '4px 4px 0px #0d0d0d',
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.3rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
              paddingBottom: '0.4rem',
              borderBottom: '2px solid #0d0d0d',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <BookOpen size={16} color="#0d0d0d" style={{ strokeWidth: 2.5 }} />
              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#0d0d0d',
                  margin: 0,
                }}
              >
                Verified Primary Sources & Citations
              </h4>
            </div>
            <span className="neo-badge bg-neo-lime" style={{ fontSize: '0.65rem' }}>
              {sources.length} CITED
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {sources.map((src, idx) => {
              const domain = extractDomain(src.url);
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#faf8f2',
                    border: '2px solid #0d0d0d',
                    boxShadow: '3px 3px 0px #0d0d0d',
                    gap: '0.55rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Globe size={12} color="#555" />
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#444',
                          textTransform: 'lowercase',
                        }}
                      >
                        {domain}
                      </span>
                    </div>

                    <a
                      href={src.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        color: '#0d0d0d',
                        textDecoration: 'none',
                        lineHeight: 1.35,
                      }}
                      className="hover:text-neo-pink"
                    >
                      {src.title || src.url || 'Primary Source'}
                    </a>

                    {src.relevance && (
                      <div
                        style={{
                          fontSize: '0.78rem',
                          lineHeight: 1.4,
                          color: '#555',
                          fontStyle: 'italic',
                          borderLeft: '2px solid #0d0d0d',
                          paddingLeft: '0.45rem',
                          marginTop: '0.2rem',
                        }}
                      >
                        {src.relevance}
                      </div>
                    )}
                  </div>

                  {src.url && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.3rem' }}>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neo-btn bg-neo-yellow"
                        style={{
                          padding: '0.25rem 0.6rem',
                          fontSize: '0.68rem',
                          borderWidth: '2px',
                          boxShadow: '2px 2px 0px #000',
                          textDecoration: 'none',
                          color: '#0d0d0d',
                        }}
                      >
                        <span>VISIT SOURCE</span>
                        <ExternalLink size={11} style={{ strokeWidth: 2.5 }} />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 4: Analytical Boundaries & Scope */}
      {limitations && limitations.length > 0 && (
        <div
          style={{
            border: '2px solid #0d0d0d',
            boxShadow: '4px 4px 0px #0d0d0d',
            backgroundColor: '#fffae0',
            padding: '1rem 1.3rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '0.65rem',
              paddingBottom: '0.35rem',
              borderBottom: '2px dashed #0d0d0d',
            }}
          >
            <AlertCircle size={15} color="#0d0d0d" style={{ strokeWidth: 2.5 }} />
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#0d0d0d',
                margin: 0,
              }}
            >
              Analytical Boundaries & Scope
            </h4>
          </div>

          <ul
            style={{
              margin: '0 0 0 1.2rem',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              fontSize: '0.86rem',
              lineHeight: 1.5,
              color: '#333',
            }}
          >
            {limitations.map((lim, idx) => (
              <li key={idx}>
                <InlineMarkdown text={lim} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
