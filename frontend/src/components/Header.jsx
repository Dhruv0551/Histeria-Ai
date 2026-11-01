import React from 'react';
import { Skull, Radio, Terminal, ExternalLink, Sparkles } from 'lucide-react';

export function Header({ backendOnline }) {
  return (
    <header style={{ marginBottom: '1.25rem', width: '100%' }}>
      <div
        style={{
          backgroundColor: '#0d0d0d',
          color: '#ffee00',
          borderBottom: '3px solid #0d0d0d',
          padding: '0.35rem 0',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontSize: '0.75rem',
          fontWeight: 900,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.12em',
        }}
      >
        <div className="animate-marquee">
          <span>
            ⚠️ HISTERIA AGENTIC SYSTEM ACTIVE // LANGGRAPH POWERED // TAVILY REALTIME SEARCH // ⚡ HIGH VELOCITY STREAMING // CORS ENABLED // 
          </span>
          <span>
            ⚠️ HISTERIA AGENTIC SYSTEM ACTIVE // LANGGRAPH POWERED // TAVILY REALTIME SEARCH // ⚡ HIGH VELOCITY STREAMING // CORS ENABLED // 
          </span>
        </div>
      </div>

      <div
        className="neo-box-lg bg-white"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          marginTop: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div
            className="neo-box bg-neo-yellow"
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Skull size={26} strokeWidth={2.6} />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              HISTERIA<span style={{ color: '#ff5277' }}>.AI</span>
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                color: '#666',
                fontFamily: 'var(--font-mono)',
              }}
            >
              AUTONOMOUS RESEARCH AGENT
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            className={`neo-badge ${backendOnline ? 'bg-neo-lime' : 'bg-neo-pink'}`}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
          >
            <Radio size={14} className={backendOnline ? 'pulse-dot' : ''} />
            <span>PORT 8000: {backendOnline ? 'CONNECTED' : 'DISCONNECTED'}</span>
          </div>

          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="neo-btn bg-neo-cyan"
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.75rem',
              textDecoration: 'none',
              color: '#0d0d0d',
            }}
          >
            <Terminal size={14} />
            <span>FASTAPI DOCS</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </header>
  );
}
