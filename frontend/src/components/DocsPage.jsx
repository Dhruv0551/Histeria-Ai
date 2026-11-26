import React, { useState } from 'react';
import {
  BookOpen,
  Terminal,
  Activity,
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Zap,
  Cpu,
  Layers,
  Send,
  RefreshCw,
  Server,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { checkBackendHealth, API_BASE_URL } from '../services/api';

export function DocsPage({ onBackToConsole, backendOnline, initialHealthData }) {
  const [activeTab, setActiveTab] = useState('endpoints');
  const [targetUrl, setTargetUrl] = useState(API_BASE_URL);
  const [testingHealth, setTestingHealth] = useState(false);
  const [healthResult, setHealthResult] = useState(initialHealthData || null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [sampleQuery, setSampleQuery] = useState('Analyze recent breakthroughs in AI reasoning models');
  const [codeLanguage, setCodeLanguage] = useState('curl');

  const handleTestHealth = async () => {
    setTestingHealth(true);
    try {
      const res = await checkBackendHealth(targetUrl);
      setHealthResult(res);
    } finally {
      setTestingHealth(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCurlSnippet = () => `curl -N -X POST "${targetUrl}/query" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "${sampleQuery}",
    "thread_id": "session-prod-001"
  }'`;

  const getPythonSnippet = () => `import requests
import json

url = "${targetUrl}/query"
payload = {
    "query": "${sampleQuery}",
    "thread_id": "session-prod-001"
}

response = requests.post(url, json=payload, stream=True)

for line in response.iter_lines():
    if line:
        decoded_line = line.decode('utf-8')
        if decoded_line.startswith('data: '):
            event = json.loads(decoded_line[6:])
            print(f"[{event.get('type')}]", event.get('content'))`;

  const getJsSnippet = () => `const response = await fetch("${targetUrl}/query", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "${sampleQuery}",
    thread_id: "session-prod-001"
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  console.log("SSE chunk:", chunk);
}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Top Banner Navigation */}
      <div
        className="neo-box-lg bg-white"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div
            className="neo-box bg-neo-cyan"
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOpen size={24} strokeWidth={2.4} />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              HISTERIA.AI <span style={{ color: '#9b51e0' }}>// API & SYSTEM DOCS</span>
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: '#666',
                fontFamily: 'var(--font-mono)',
              }}
            >
              RENDER BACKEND DEPLOYMENT • FASTAPI • SSE STREAMING • REACT AGENT
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            className={`neo-badge ${backendOnline ? 'bg-neo-lime' : 'bg-neo-pink'}`}
            style={{ padding: '0.45rem 0.8rem', fontSize: '0.75rem' }}
          >
            <Activity size={14} className={backendOnline ? 'pulse-dot' : ''} />
            <span>RENDER API: {backendOnline ? 'ONLINE' : 'CONNECTING / SLEEPING'}</span>
          </div>

          <button
            onClick={onBackToConsole}
            className="neo-btn bg-neo-yellow"
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.8rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>RETURN TO MISSION CONSOLE</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        {[
          { id: 'endpoints', label: '1. API ENDPOINTS & LIVE TESTER', icon: Server },
          { id: 'architecture', label: '2. AGENT ARCHITECTURE', icon: Layers },
          { id: 'schema', label: '3. PYDANTIC OUTPUT SCHEMA', icon: Code2 },
          { id: 'deployment', label: '4. RENDER DEPLOYMENT & TELEMETRY', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`neo-btn ${isActive ? 'bg-neo-yellow' : 'bg-white'}`}
              style={{
                fontSize: '0.8rem',
                padding: '0.55rem 1rem',
                boxShadow: isActive ? '4px 4px 0px #0d0d0d' : '2px 2px 0px #0d0d0d',
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'endpoints' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Endpoint 1: Healthcheck */}
          <div className="neo-box-xl bg-white" style={{ overflow: 'hidden' }}>
            <div
              style={{
                backgroundColor: '#ffee00',
                borderBottom: '3px solid #0d0d0d',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="neo-badge bg-neo-lime" style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}>
                  GET / HEAD
                </span>
                <span style={{ fontWeight: 900, fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>
                  / (Health Check & Telemetry)
                </span>
              </div>
              <span className="neo-badge bg-white" style={{ fontSize: '0.7rem' }}>
                RENDER PROBE ENDPOINT
              </span>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.88rem', color: '#333', lineHeight: 1.5 }}>
                Returns operational telemetry, LLM configuration status for Groq and Tavily, and active model names. Used by Render health probes and the frontend connection monitor.
              </p>

              {/* Interactive Probe Panel */}
              <div
                className="neo-box"
                style={{
                  backgroundColor: '#faf8f2',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Activity size={16} color="#0d0d0d" />
                    <span>INTERACTIVE RENDER HEALTHCHECK PROBE</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#666' }}>
                    Target: {targetUrl}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://histeria-ai.onrender.com"
                    className="neo-input"
                    style={{ flex: 1, minWidth: '240px', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                  />
                  <button
                    onClick={handleTestHealth}
                    disabled={testingHealth}
                    className="neo-btn bg-neo-lime"
                    style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                  >
                    <RefreshCw size={14} className={testingHealth ? 'animate-spin' : ''} />
                    <span>{testingHealth ? 'PROBING RENDER...' : 'TEST HEALTHCHECK'}</span>
                  </button>
                </div>

                {healthResult && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      border: '2px solid #0d0d0d',
                      backgroundColor: healthResult.ok ? '#f0fdf4' : '#fef2f2',
                      padding: '0.8rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          className={`neo-badge ${healthResult.ok ? 'bg-neo-lime' : 'bg-neo-pink'}`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {healthResult.ok ? `STATUS ${healthResult.status} OK` : `FAILED (${healthResult.status || 'OFFLINE'})`}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          LATENCY: {healthResult.latencyMs} ms
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(healthResult.data || healthResult.error, null, 2), 'health')}
                        className="neo-btn bg-white"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.68rem' }}
                      >
                        {copiedCode === 'health' ? <Check size={12} color="#10e060" /> : <Copy size={12} />}
                        <span>{copiedCode === 'health' ? 'COPIED' : 'COPY RESPONSE'}</span>
                      </button>
                    </div>

                    <pre
                      style={{
                        backgroundColor: '#0d0d0d',
                        color: healthResult.ok ? '#00ff66' : '#ff5277',
                        padding: '0.8rem',
                        fontSize: '0.76rem',
                        fontFamily: 'var(--font-mono)',
                        overflowX: 'auto',
                        border: '2px solid #0d0d0d',
                        margin: 0,
                      }}
                    >
                      {JSON.stringify(healthResult.data || { error: healthResult.error }, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Endpoint 2: Agent Query Stream */}
          <div className="neo-box-xl bg-white" style={{ overflow: 'hidden' }}>
            <div
              style={{
                backgroundColor: '#00f0ff',
                borderBottom: '3px solid #0d0d0d',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="neo-badge bg-black" style={{ color: '#00f0ff', fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}>
                  POST
                </span>
                <span style={{ fontWeight: 900, fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>
                  /query (Autonomous ReAct Agent Stream)
                </span>
              </div>
              <span className="neo-badge bg-neo-yellow" style={{ fontSize: '0.7rem' }}>
                SSE (SERVER-SENT EVENTS)
              </span>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.88rem', color: '#333', lineHeight: 1.5 }}>
                Streams the execution of the LangGraph autonomous research loop. Emits token-by-token synthesis, tool state changes (Tavily search, BS4 scraper), and returns a final structured research dossier.
              </p>

              {/* Code Snippet Tabs */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {[
                      { id: 'curl', label: 'cURL' },
                      { id: 'python', label: 'Python' },
                      { id: 'javascript', label: 'JavaScript' },
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setCodeLanguage(lang.id)}
                        className={`neo-badge ${codeLanguage === lang.id ? 'bg-neo-yellow' : 'bg-white'}`}
                        style={{ cursor: 'pointer', fontSize: '0.72rem' }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const code = codeLanguage === 'curl' ? getCurlSnippet() : codeLanguage === 'python' ? getPythonSnippet() : getJsSnippet();
                      copyToClipboard(code, 'query-code');
                    }}
                    className="neo-btn bg-white"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem' }}
                  >
                    {copiedCode === 'query-code' ? <Check size={12} color="#10e060" /> : <Copy size={12} />}
                    <span>{copiedCode === 'query-code' ? 'COPIED' : 'COPY CODE'}</span>
                  </button>
                </div>

                <pre
                  style={{
                    backgroundColor: '#0d0d0d',
                    color: '#f5f5f5',
                    padding: '1rem',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    overflowX: 'auto',
                    border: '3px solid #0d0d0d',
                    boxShadow: '4px 4px 0px #0d0d0d',
                    lineHeight: 1.45,
                  }}
                >
                  {codeLanguage === 'curl' && getCurlSnippet()}
                  {codeLanguage === 'python' && getPythonSnippet()}
                  {codeLanguage === 'javascript' && getJsSnippet()}
                </pre>
              </div>

              {/* SSE Protocol Breakdown */}
              <div
                className="neo-box"
                style={{
                  backgroundColor: '#fffae0',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
              >
                <div style={{ fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Zap size={16} /> SSE STREAMING EVENT SPECIFICATION
                </div>
                <div style={{ fontSize: '0.8rem', color: '#333', lineHeight: 1.5 }}>
                  The response is an HTTP 200 stream with <code>Content-Type: text/event-stream</code>. Each chunk is a double-newline delimited line formatted as <code>data: {`{"type": "...", "content": ...}`}</code>:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem', marginTop: '0.4rem' }}>
                  <div className="neo-box" style={{ padding: '0.6rem', backgroundColor: '#fff' }}>
                    <span className="neo-badge bg-neo-cyan" style={{ fontSize: '0.68rem' }}>status</span>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.3rem', color: '#444' }}>
                      Graph transitions, e.g. <code>Classifying query...</code> or <code>tavily_search</code>.
                    </p>
                  </div>
                  <div className="neo-box" style={{ padding: '0.6rem', backgroundColor: '#fff' }}>
                    <span className="neo-badge bg-neo-lime" style={{ fontSize: '0.68rem' }}>token</span>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.3rem', color: '#444' }}>
                      Streaming LLM text chunks emitted progressively during direct synthesis.
                    </p>
                  </div>
                  <div className="neo-box" style={{ padding: '0.6rem', backgroundColor: '#fff' }}>
                    <span className="neo-badge bg-neo-purple" style={{ fontSize: '0.68rem', color: '#fff' }}>result</span>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.3rem', color: '#444' }}>
                      Complete structured research dossier conforming to <code>ResponseFormat</code> schema.
                    </p>
                  </div>
                  <div className="neo-box" style={{ padding: '0.6rem', backgroundColor: '#fff' }}>
                    <span className="neo-badge bg-neo-pink" style={{ fontSize: '0.68rem', color: '#fff' }}>error / done</span>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.3rem', color: '#444' }}>
                      Terminal signals indicating stream completion or captured exceptions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Architecture */}
      {activeTab === 'architecture' && (
        <div className="neo-box-xl bg-white" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '0.3rem' }}>
              AUTONOMOUS REACT RESEARCH ENGINE
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#555' }}>
              Unlike static chatbots, Histeria-AI executes an iterative Action → Observation → Reflection loop orchestrated with LangGraph and Groq LPU inference.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="neo-box" style={{ padding: '1rem', backgroundColor: '#faf8f2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="neo-badge bg-neo-yellow">STAGE 1</span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Intent Classification</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#444', lineHeight: 1.5 }}>
                Categorizes query into <code>factual</code>, <code>research</code>, <code>comparison</code>, <code>creative</code>, or <code>conversational</code>. Bypasses web scraping for conversational queries to ensure sub-second response times.
              </p>
            </div>

            <div className="neo-box" style={{ padding: '1rem', backgroundColor: '#faf8f2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="neo-badge bg-neo-cyan">STAGE 2</span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Adaptive Recursion</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#444', lineHeight: 1.5 }}>
                Scales maximum tool recursion depth dynamically according to query complexity (<code>simple: 25</code>, <code>moderate: 50</code>, <code>complex: 100</code> steps). Self-terminates when sufficient evidence is accumulated.
              </p>
            </div>

            <div className="neo-box" style={{ padding: '1rem', backgroundColor: '#faf8f2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="neo-badge bg-neo-lime">STAGE 3</span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Multi-Source Tools</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#444', lineHeight: 1.5 }}>
                <strong>tavily_search</strong> extracts real-time web results. <strong>get_data_from_url</strong> performs deep BeautifulSoup DOM extraction (up to 12k clean chars) with anti-boilerplate filters.
              </p>
            </div>

            <div className="neo-box" style={{ padding: '1rem', backgroundColor: '#faf8f2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="neo-badge bg-neo-purple" style={{ color: '#fff' }}>STAGE 4</span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Pydantic Synthesis</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#444', lineHeight: 1.5 }}>
                Strict JSON synthesis guarantees the final report conforms to <code>ResponseFormat</code> with verified citations, bold takeaways, and explicit limitations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Schema */}
      {activeTab === 'schema' && (
        <div className="neo-box-xl bg-white" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '0.3rem' }}>
              PYDANTIC RESPONSEFORMAT SPECIFICATION
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#555' }}>
              All research investigations return structured objects validated against Pydantic models.
            </p>
          </div>

          <pre
            style={{
              backgroundColor: '#0d0d0d',
              color: '#00ff66',
              padding: '1.2rem',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              border: '3px solid #0d0d0d',
              boxShadow: '4px 4px 0px #0d0d0d',
              overflowX: 'auto',
            }}
          >
{`class Source(BaseModel):
    title: str = Field(description="Name or title of primary web reference")
    url: str = Field(description="Direct verifiable HTTP/HTTPS hyperlink")
    relevance: str = Field(description="Contextual contribution to the answer")

class ResponseFormat(BaseModel):
    answer: str = Field(
        description="Comprehensive executive synthesis answering the prompt"
    )
    key_points: List[str] = Field(
        description="High-impact takeaways with bolded leading labels"
    )
    sources: List[Source] = Field(
        description="Cited sources retrieved during investigation"
    )
    limitations: List[str] = Field(
        description="Explicit accounting of knowledge boundaries or gaps"
    )`}
          </pre>
        </div>
      )}

      {/* Tab 4: Deployment & Render Telemetry */}
      {activeTab === 'deployment' && (
        <div className="neo-box-xl bg-white" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '0.3rem' }}>
              RENDER PRODUCTION DEPLOYMENT NOTES
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#555' }}>
              Production infrastructure topology, sleep cycle behaviors, and environment configurations.
            </p>
          </div>

          <div
            className="neo-box bg-neo-yellow"
            style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <div style={{ fontWeight: 900, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Server size={18} /> RENDER COLD START / WAKEUP NOTIFICATION
            </div>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.5, color: '#0d0d0d' }}>
              Render free tier instances automatically spin down into a sleeping state after 15 minutes of inactivity. The first health check or query dispatched by the frontend will wake the container, which typically takes 30 to 50 seconds. Subsequent requests execute with sub-second latency.
            </p>
          </div>

          <div className="neo-box" style={{ padding: '1rem', backgroundColor: '#faf8f2' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              Live URLs & Endpoints
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
              <li>
                <strong>API Host:</strong>{' '}
                <a href="https://histeria-ai.onrender.com/" target="_blank" rel="noreferrer" style={{ color: '#0d0d0d', textDecoration: 'underline' }}>
                  https://histeria-ai.onrender.com
                </a>
              </li>
              <li>
                <strong>Health Probe:</strong>{' '}
                <a href="https://histeria-ai.onrender.com/" target="_blank" rel="noreferrer" style={{ color: '#0d0d0d', textDecoration: 'underline' }}>
                  https://histeria-ai.onrender.com/
                </a>
              </li>
              <li>
                <strong>Stream Route:</strong> https://histeria-ai.onrender.com/query
              </li>
              <li>
                <strong>Frontend:</strong>{' '}
                <a href="https://histeria-ai.vercel.app" target="_blank" rel="noreferrer" style={{ color: '#0d0d0d', textDecoration: 'underline' }}>
                  https://histeria-ai.vercel.app
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
