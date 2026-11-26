import React from 'react';
import { Skull, Radio, BookOpen, Terminal, Activity } from 'lucide-react';

export function Header({
  backendOnline,
  currentView = 'console',
  onNavigate,
  onTriggerHealthcheck,
  latencyMs,
}) {
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
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div
          onClick={() => onNavigate?.('console')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            cursor: 'pointer',
          }}
          title="Return to Mission Console"
        >
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onTriggerHealthcheck?.()}
            className={`neo-badge ${backendOnline ? 'bg-neo-lime' : 'bg-neo-pink'}`}
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
              border: '2px solid #0d0d0d',
            }}
            title="Click to probe Render healthcheck now"
          >
            <Radio size={14} className={backendOnline ? 'pulse-dot' : ''} />
            <span>RENDER API: {backendOnline ? 'ONLINE' : 'CONNECTING / SLEEPING'}</span>
            {latencyMs != null && backendOnline && (
              <span style={{ opacity: 0.8, fontSize: '0.7rem' }}>({latencyMs}ms)</span>
            )}
          </button>

          {currentView === 'docs' ? (
            <button
              onClick={() => onNavigate?.('console')}
              className="neo-btn bg-neo-yellow"
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                color: '#0d0d0d',
              }}
            >
              <Terminal size={14} />
              <span>MISSION CONSOLE</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate?.('docs')}
              className="neo-btn bg-neo-cyan"
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                color: '#0d0d0d',
              }}
            >
              <BookOpen size={14} />
              <span>CUSTOM DOCS PAGE</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
