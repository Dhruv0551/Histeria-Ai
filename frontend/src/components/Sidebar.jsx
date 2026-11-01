import React from 'react';
import { Terminal, Shield, Zap, Search, Activity, Cpu } from 'lucide-react';

export function Sidebar({ backendOnline, messageCount, onSelectPrompt }) {
  const samplePrompts = [
    {
      label: '⚡ Tech Landscape 2026',
      query: 'What are the biggest breakthroughs in AI agent systems in 2026? Search web.',
    },
    {
      label: '🔍 Market Intelligence',
      query: 'Search for recent advances in open-source LLMs and reasoning agents.',
    },
    {
      label: '🧬 Deep Synthesis',
      query: 'Explain quantum error mitigation advances and how search tools verify the data.',
    },
    {
      label: '🚀 Quick Reality Check',
      query: 'What is the current status of space exploration missions this year?',
    },
  ];

  return (
    <aside
      className="neo-box-lg bg-white"
      style={{
        width: '320px',
        minWidth: '280px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        padding: '1.25rem',
        alignSelf: 'stretch',
      }}
    >
      <div
        className="neo-box bg-neo-yellow"
        style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 900, fontSize: '0.85rem' }}>
            <Activity size={16} /> SYSTEM TELEMETRY
          </div>
          <span className={`neo-badge ${backendOnline ? 'bg-neo-lime' : 'bg-neo-pink'}`}>
            <span className="pulse-dot" style={{ backgroundColor: backendOnline ? '#10e060' : '#ff5277' }} />
            {backendOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#0d0d0d',
            color: '#00ff66',
            padding: '0.5rem 0.7rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            border: '2px solid #000',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
          }}
        >
          <div>GRAPH: LANGCHAIN AGENTS</div>
          <div>SEARCH: TAVILY INTELLIGENCE</div>
          <div>SSE: TEXT/EVENT-STREAM</div>
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: '0.8rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Cpu size={15} /> Active Tools
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div
            className="neo-box"
            style={{
              padding: '0.6rem 0.8rem',
              backgroundColor: '#eef8ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={15} color="#0d0d0d" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>search_tool</div>
                <div style={{ fontSize: '0.68rem', color: '#666' }}>Tavily Live Web Engine</div>
              </div>
            </div>
            <span className="neo-badge bg-neo-cyan" style={{ fontSize: '0.65rem' }}>LIVE</span>
          </div>

          <div
            className="neo-box"
            style={{
              padding: '0.6rem 0.8rem',
              backgroundColor: '#fff0f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={15} color="#0d0d0d" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>ReAct Cycle</div>
                <div style={{ fontSize: '0.68rem', color: '#666' }}>Reasoning & Action Loop</div>
              </div>
            </div>
            <span className="neo-badge bg-neo-lime" style={{ fontSize: '0.65rem' }}>READY</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: '0.8rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Terminal size={15} /> Rapid Prompts
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(p.query)}
              className="neo-btn bg-white"
              style={{
                fontSize: '0.75rem',
                textAlign: 'left',
                justifyContent: 'flex-start',
                padding: '0.6rem 0.8rem',
                textTransform: 'none',
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: '#0d0d0d' }}>{p.label}</div>
                <div style={{ fontSize: '0.68rem', color: '#555', marginTop: '2px' }}>
                  {p.query.slice(0, 42)}...
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div
        className="neo-box bg-neo-purple"
        style={{
          padding: '0.7rem 0.9rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#fff' }}>TOTAL QUERIES</span>
        <span
          className="neo-badge bg-white"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
        >
          {messageCount}
        </span>
      </div>
    </aside>
  );
}
