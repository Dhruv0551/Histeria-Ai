import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Send, Trash2, ArrowDown, Bot, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MessageBubble } from './components/MessageBubble';
import { checkBackendHealth, streamAgentQuery } from './services/api';
import './index.css';
import './neo-style.css';

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `⚡ **SYSTEM BOOT SEQUENCE COMPLETE.**\n\nWelcome to **HISTERIA.AI** — an autonomous research agent interface powered by LangChain ReAct loops and real-time web intelligence.\n\nType any inquiry below or select a rapid prompt to trigger real-time tool execution and streaming response!`,
      timestamp: 'SYSTEM INIT',
      toolUpdates: [],
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [activeNode, setActiveNode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Poll backend health status
  const checkHealth = async () => {
    const res = await checkBackendHealth();
    setBackendOnline(res.ok);
    if (!res.ok) {
      setErrorMessage('Backend is offline. Run `python -m uvicorn main:app --reload` on port 8000');
    } else {
      setErrorMessage(null);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 6000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeNode]);

  // Handle Query Submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const query = inputQuery.trim();
    if (!query || isStreaming) return;

    // User message
    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `bot-${Date.now()}`;

    const newMessages = [
      ...messages,
      {
        id: userMsgId,
        role: 'user',
        content: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolUpdates: [],
      },
    ];

    setMessages(newMessages);
    setInputQuery('');
    setIsStreaming(true);
    setErrorMessage(null);
    setActiveNode('Initializing LangGraph Agent...');

    try {
      await streamAgentQuery(query, {
        onToken: (token) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: msg.content + token }
                : msg
            )
          );
        },
        onResult: (result) => {
          let formattedContent = '';
          if (typeof result === 'string') {
            formattedContent = result;
          } else if (result && typeof result === 'object') {
            const parts = [];
            if (result.answer) {
              parts.push(result.answer);
            }
            if (Array.isArray(result.key_points) && result.key_points.length > 0) {
              parts.push('### Key Points\n' + result.key_points.map((pt) => `- ${pt}`).join('\n'));
            }
            if (Array.isArray(result.sources) && result.sources.length > 0) {
              parts.push('### Sources\n' + result.sources.map((s) => `- [${s.title || s.url}](${s.url})${s.relevance ? `: ${s.relevance}` : ''}`).join('\n'));
            }
            if (Array.isArray(result.limitations) && result.limitations.length > 0) {
              parts.push('### Limitations\n' + result.limitations.map((lim) => `- ${lim}`).join('\n'));
            }
            formattedContent = parts.join('\n\n');
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: formattedContent }
                : msg
            )
          );
        },
        onStatus: (nodeName) => {
          setActiveNode(`Executing: ${nodeName}`);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    toolUpdates: [...new Set([...(msg.toolUpdates || []), nodeName])],
                  }
                : msg
            )
          );
        },
        onDone: () => {
          setIsStreaming(false);
          setActiveNode(null);
          try {
            confetti({
              particleCount: 25,
              spread: 60,
              origin: { y: 0.9 },
              colors: ['#ffee00', '#ff5277', '#00f0ff', '#10e060'],
            });
          } catch (e) {
            // ignore
          }
        },
        onError: (err) => {
          setIsStreaming(false);
          setActiveNode(null);
          setErrorMessage(`Execution Error: ${err}`);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content:
                      msg.content ||
                      `❌ Failed to complete query. Please make sure the FastAPI backend is running and valid API keys (GROQ_API_KEY, TAVILY_API_KEY) are set in backend/.env`,
                  }
                : msg
            )
          );
        },
      });
    } catch (err) {
      setIsStreaming(false);
      setActiveNode(null);
      setErrorMessage(err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Wipe mission log history?')) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: 'Chat session reset. Ready for new parameters.',
          timestamp: 'RESET',
          toolUpdates: [],
        },
      ]);
    }
  };

  return (
    <div
      style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '1rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Header backendOnline={backendOnline} />

      {/* Backend Alert Banner if disconnected */}
      {!backendOnline && (
        <div
          className="neo-box bg-neo-pink"
          style={{
            marginBottom: '1rem',
            padding: '0.8rem 1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 800 }}>
            <AlertTriangle size={22} color="#fff" />
            <div>
              <span>BACKEND SERVICE NOT DETECTED AT http://localhost:8000</span>
              <div style={{ fontSize: '0.78rem', opacity: 0.9, marginTop: '2px' }}>
                Run: <code>cd backend && uvicorn main:app --reload</code>
              </div>
            </div>
          </div>
          <button
            onClick={checkHealth}
            className="neo-btn bg-white"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
          >
            <RefreshCw size={13} /> RETRY LINK
          </button>
        </div>
      )}

      {/* Main Workspace (Sidebar + Chat Area) */}
      <div
        style={{
          display: 'flex',
          gap: '1.25rem',
          flex: 1,
          alignItems: 'stretch',
          flexDirection: 'row',
        }}
      >
        {/* Left Side Telemetry & Quick Commands */}
        <Sidebar
          backendOnline={backendOnline}
          messageCount={messages.filter((m) => m.role === 'user').length}
          onSelectPrompt={(prompt) => {
            setInputQuery(prompt);
            textareaRef.current?.focus();
          }}
        />

        {/* Right Side Main Console */}
        <main
          className="neo-box-xl bg-white"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Console Header Bar */}
          <div
            style={{
              backgroundColor: '#ffee00',
              borderBottom: '3px solid #0d0d0d',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="neo-badge bg-black" style={{ color: '#00ff66' }}>
                STREAM // REACT AGENT
              </span>
              <span style={{ fontWeight: 900, fontSize: '0.85rem' }}>
                MISSION CONSOLE ACTIVE
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {isStreaming && (
                <span className="neo-badge bg-neo-pink">
                  <span className="pulse-dot" /> STREAMING CHUNKS
                </span>
              )}
              <button
                onClick={handleClearChat}
                className="neo-btn bg-white"
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.7rem',
                  borderWidth: '2px',
                  boxShadow: '2px 2px 0px #000',
                }}
                title="Clear Chat Logs"
              >
                <Trash2 size={13} /> PURGE
              </button>
            </div>
          </div>

          {/* Active Status bar during agent tool loops */}
          {activeNode && (
            <div
              style={{
                backgroundColor: '#111',
                color: '#00f0ff',
                padding: '0.4rem 1.25rem',
                borderBottom: '2px solid #0d0d0d',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span className="pulse-dot" style={{ backgroundColor: '#00f0ff' }} />
              <span>AGENT TRACE: {activeNode}</span>
            </div>
          )}

          {/* Message Stream Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem',
              backgroundColor: '#faf8f2',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '440px',
              maxHeight: 'calc(100vh - 340px)',
            }}
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box Footer */}
          <footer
            style={{
              padding: '1.25rem',
              borderTop: '3px solid #0d0d0d',
              backgroundColor: '#ffffff',
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  ref={textareaRef}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Dispatch query or instruction to the agent (Shift+Enter for newline)..."
                  rows={2}
                  disabled={isStreaming}
                  className="neo-input"
                  style={{
                    resize: 'none',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    lineHeight: 1.4,
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isStreaming || !inputQuery.trim()}
                className="neo-btn bg-neo-yellow"
                style={{
                  padding: '0 1.6rem',
                  fontSize: '0.95rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  minWidth: '120px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Send size={16} />
                  <span>TRANSMIT</span>
                </div>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    opacity: 0.8,
                  }}
                >
                  [ENTER ↵]
                </span>
              </button>
            </form>

            {/* Micro Helper Tags */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.6rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#666',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="neo-badge bg-neo-cyan" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  HINT
                </span>
                <span>Queries automatically invoke search_tool when current data is required.</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)' }}>
                VITE + REACT 19 // SSE STREAMING
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
