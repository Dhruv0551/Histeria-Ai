import React, { useState } from 'react';
import { Bot, User, Wrench, Copy, Check } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ResearchDossier } from './ResearchDossier';
import { extractReportFromText } from '../services/dossierParser';

export function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine if this assistant message is an intelligence dossier
  const dossierReport = !isUser
    ? message.report || extractReportFromText(message.content)
    : null;

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
      {/* Sender Badge & Timestamp */}
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

      {/* Message Container */}
      <div
        className={isUser ? 'neo-box bg-neo-yellow' : 'neo-box-lg bg-white'}
        style={{
          maxWidth: isUser ? '85%' : '95%',
          width: dossierReport ? '100%' : 'auto',
          padding: dossierReport ? '1.25rem 1.4rem' : '1.1rem 1.4rem',
          position: 'relative',
        }}
      >
        {/* Active Tool Execution Telemetry */}
        {!isUser && message.toolUpdates && message.toolUpdates.length > 0 && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.65rem 0.85rem',
              backgroundColor: '#121212',
              color: '#00ff66',
              border: '2px solid #0d0d0d',
              boxShadow: '3px 3px 0px #0d0d0d',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#ffee00',
                fontWeight: 800,
              }}
            >
              <Wrench size={13} />
              <span>ACTIVE TOOL EXECUTIONS:</span>
            </div>
            {message.toolUpdates.map((tool, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  paddingLeft: '0.5rem',
                }}
              >
                <span style={{ color: '#00f0ff' }}>➔</span>
                <span>Node: {tool}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message Content */}
        {isUser ? (
          <div
            style={{
              color: '#0d0d0d',
              fontSize: '0.96rem',
              lineHeight: 1.6,
              fontWeight: 600,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {message.content}
          </div>
        ) : dossierReport ? (
          <ResearchDossier report={dossierReport} rawContent={message.content} />
        ) : message.content ? (
          <div
            style={{
              color: '#0d0d0d',
              fontSize: '0.96rem',
              lineHeight: 1.65,
              wordBreak: 'break-word',
            }}
          >
            <MarkdownRenderer content={message.content} />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontStyle: 'italic',
              color: '#666',
              padding: '0.4rem 0',
            }}
          >
            <span className="pulse-dot" />
            <span>Thinking & processing through agentic graph...</span>
          </div>
        )}

        {/* Bottom Copy Action Bar for Non-Dossier Assistant Messages */}
        {!isUser && !dossierReport && message.content && (
          <div
            style={{
              marginTop: '0.9rem',
              paddingTop: '0.6rem',
              borderTop: '2px dashed #0d0d0d',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <button
              onClick={handleCopy}
              type="button"
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
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
