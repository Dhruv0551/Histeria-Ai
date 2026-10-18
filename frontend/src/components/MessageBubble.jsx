import React from 'react';
import { Bot, User, Wrench, Sparkles, Copy, Check } from 'lucide-react';

export function MessageBubble({ message, onCopy }) {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '1.5rem',
        width: '100%',
      }}
    >
      {/* Header Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.4rem',
        }}
      >
        <span
          className={`neo-badge ${isUser ? 'bg-neo-pink' : 'bg-neo-cyan'}`}
          style={{ fontSize: '0.7rem' }}
        >
          {isUser ? <User size={12} /> : <Bot size={12} />}
          {isUser ? 'OPERATOR' : 'HISTERIA CORE'}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#666',
          }}
        >
          {message.timestamp || 'JUST NOW'}
        </span>
      </div>

      {/* Main Bubble */}
      <div
        className={isUser ? 'neo-box bg-neo-yellow' : 'neo-box-lg bg-white'}
        style={{
          maxWidth: isUser ? '85%' : '92%',
          padding: '1.1rem 1.4rem',
          position: 'relative',
        }}
      >
        {/* Tool Updates / Thoughts */}
        {!isUser && message.toolUpdates && message.toolUpdates.length > 0 && (
          <div
            style={{
              marginBottom: '0.9rem',
              padding: '0.6rem 0.8rem',
              backgroundColor: '#121212',
              color: '#00ff66',
              border: '2px solid #000',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ffee00', fontWeight: 800 }}>
              <Wrench size={13} />
              <span>ACTIVE TOOL EXECUTIONS:</span>
            </div>
            {message.toolUpdates.map((tool, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', paddingLeft: '0.5rem' }}>
                <span style={{ color: '#00f0ff' }}>➔</span>
                <span>Node: {tool}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message Content */}
        <div
          className="rendered-markdown"
          style={{
            color: '#0d0d0d',
            fontSize: '0.96rem',
            lineHeight: 1.6,
            wordBreak: 'break-word',
          }}
        >
          {message.content ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontStyle: 'italic', color: '#666' }}>
              <span className="pulse-dot" />
              <span>Thinking & processing through agentic graph...</span>
            </div>
          )}
        </div>

        {/* Actions row */}
        {!isUser && message.content && (
          <div
            style={{
              marginTop: '0.8rem',
              paddingTop: '0.6rem',
              borderTop: '2px dashed #0d0d0d',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="neo-badge bg-neo-lime" style={{ fontSize: '0.65rem' }}>
                <Sparkles size={11} /> GROQ // GPT-OSS-20B
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="neo-btn bg-white"
              style={{
                padding: '0.2rem 0.6rem',
                fontSize: '0.7rem',
                borderWidth: '2px',
                boxShadow: '2px 2px 0px #000',
              }}
              title="Copy message"
            >
              {copied ? <Check size={12} color="#10e060" /> : <Copy size={12} />}
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
