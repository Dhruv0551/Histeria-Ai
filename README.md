# ⚡ Histeria-AI

> **Autonomous Research & Decision-Making Intelligence Engine**  
> Powered by LangChain, LangGraph ReAct execution loops, Groq LPU ultra-fast inference, real-time multi-source web intelligence, and structured Pydantic synthesis.

[![Frontend Deployment](https://img.shields.io/badge/Frontend-Vercel-black?style=flat&logo=vercel)](https://histeria-ai.vercel.app)
[![Backend Deployment](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat&logo=render)](https://histeria-ai.onrender.com)
[![API Status](https://img.shields.io/badge/API%20Status-Live%20%26%20Operational-success?style=flat)](https://histeria-ai.onrender.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=flat&logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

### 🌐 Live Deployments
- **Web Application**: [https://histeria-ai.vercel.app](https://histeria-ai.vercel.app)
- **Production API**: [https://histeria-ai.onrender.com](https://histeria-ai.onrender.com)
- **API Health Telemetry**: [https://histeria-ai.onrender.com/](https://histeria-ai.onrender.com/)

---

## 🌟 Overview

**Histeria-AI** is a production-grade autonomous research agent engineered to conduct multi-step web investigations, cross-examine real-time data, synthesize evidence-backed conclusions, and return strictly structured, citation-grounded research dossiers.

Unlike standard conversational chatbots that generate hallucinated or static responses, Histeria-AI operates on an autonomous **Action $\rightarrow$ Observation $\rightarrow$ Reflection** loop. It dynamically decides which tools to invoke, extracts clean document content from deep web pages, maintains multi-turn conversation states via LangGraph thread checkpointing, and streams real-time execution telemetry to a neo-brutalist cyber-retro frontend.

---

## 🏗️ System Architecture

```
                    ┌─────────────────────────────────┐
                    │       React Neo-Client          │
                    │   (Vite + Tailwind + SSE)       │
                    └───────────────┬─────────────────┘
                                    │ SSE Stream (/query)
                                    ▼
                    ┌─────────────────────────────────┐
                    │         FastAPI Engine          │
                    │     (Async Event Pipeline)      │
                    └───────────────┬─────────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │      1. Intent Classifier       │
                    │  (Complexity & Tool Routing)    │
                    └───────────────┬─────────────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
        [ Direct Synthesis Path ]      [ ReAct Research Agent ]
        (Conversational / Creative)     (LangGraph Iterative Loop)
                     │                             │
                     │                 ┌───────────┴───────────┐
                     │                 ▼                       ▼
                     │       ┌──────────────────┐    ┌──────────────────┐
                     │       │  Tavily Search   │    │ BeautifulSoup4   │
                     │       │  (Web Discovery) │    │ (Deep DOM Scrape)│
                     │       └──────────────────┘    └──────────────────┘
                     │                             │
                     └──────────────┬──────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │      LangGraph Checkpointer     │
                    │   (Thread Conversation State)   │
                    └───────────────┬─────────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │    Structured JSON Synthesizer  │
                    │    (Strict Pydantic Schema)     │
                    └───────────────┬─────────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │     Final Research Dossier      │
                    │  (Answer, Points, Sources, Lim) │
                    └─────────────────────────────────┘
```

---

## ⚡ Core Capabilities

### 🧠 Autonomous ReAct Agent Loop
- Implements an iterative reasoning pattern that dynamically decides next actions based on live observations.
- Supports variable recursion depth dynamically scaled according to query complexity (`simple: 25`, `moderate: 50`, `complex: 100` steps).
- Self-terminates once sufficient verifiable evidence is collected, avoiding redundant tool execution.

### 🌐 Multi-Source Real-Time Web Intelligence
- **Tavily Web Search**: Discovers up-to-date sources, high-ranking pages, and domain-filtered web data.
- **Deep Webpage Data Extractor**: Custom HTML parser using `BeautifulSoup` that strips boilerplate, scripts, and stylesheets to extract up to 12,000 characters of clean readable text from targeted URLs.
- Graceful error handling and safety fallbacks for timeouts, 403/404 HTTP errors, and malformed HTML responses.

### 🎯 Adaptive Query Classification & Routing
- Evaluates user input into five distinct intent categories: `factual`, `research`, `comparison`, `creative`, and `conversational`.
- Bypasses unnecessary web scraping for purely creative or conversational queries to ensure sub-second response times.
- Formulates a targeted `research_directive` to guide the downstream research agent.

### 🔒 Strictly Structured Pydantic Output
- Employs bounded JSON mode to guarantee responses strictly adhere to the `ResponseFormat` schema:
  - **`answer`**: Direct, comprehensive executive synthesis answering the prompt.
  - **`key_points`**: Supporting arguments, critical facts, and analytical takeaways.
  - **`sources`**: Transparent citation list with source titles, verified URLs, and contextual relevance.
  - **`limitations`**: Explicit accounting of data boundaries, knowledge gaps, and potential ambiguities.

### 📡 Server-Sent Events (SSE) Live Telemetry
- Emits real-time state transitions directly to the client:
  - `Classifying query...`
  - `Executing direct synthesis...`
  - `Researching...`
  - `Using research tools: tavily_search / get_data_from_url`
  - `Synthesizing and formatting structured report...`
- Delivers an interactive, low-latency research experience.

### 💾 Conversational Thread Memory
- Uses LangGraph thread checkpointing (`InMemorySaver`) paired with unique `thread_id` identifiers.
- Preserves context across multi-turn inquiries, enabling deep follow-up questions without losing prior research context.

### 🎨 Cyber-Retro Neo-Brutalist Interface
- Custom-crafted frontend built with React, Vite, and Tailwind CSS.
- Features real-time SSE stream parsing, Markdown rendering with interactive citation badges, backend health monitoring, and local query history caching.

---

## 📋 Structured Output Specification

Every research query produces a strictly validated JSON structure:

```json
{
  "answer": "Anthropic announced Claude 3.5 Sonnet on June 20, 2024, setting industry-leading benchmarks in graduate-level reasoning and coding proficiency...",
  "key_points": [
    "Operates at 2x the speed of Claude 3 Opus with cost parity to previous Sonnet tiers.",
    "Introduced 'Artifacts', enabling real-time code execution and visual workspaces.",
    "Achieved 92.0% on HumanEval coding benchmark and 59.4% on GPQA Diamond reasoning."
  ],
  "sources": [
    {
      "title": "Anthropic - Claude 3.5 Sonnet Announcement",
      "url": "https://www.anthropic.com/news/claude-3-5-sonnet",
      "relevance": "Official announcement details, performance benchmarks, and pricing architecture."
    }
  ],
  "limitations": [
    "Real-time enterprise pricing may vary based on API token volume tier."
  ]
}
```

---

## 🔌 API Reference

### Health Check & Status
```http
GET /
```
Returns system health, backend readiness, verified credentials, and active model configurations.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "service": "Histeria-AI Backend",
  "version": "1.0.0",
  "groq_configured": true,
  "tavily_configured": true,
  "models": {
    "default": "openai/gpt-oss-120b",
    "classifier": "openai/gpt-oss-20b",
    "researcher": "openai/gpt-oss-120b",
    "synthesizer": "openai/gpt-oss-20b"
  }
}
```

---

### Research Query (Streaming)
```http
POST /query
Content-Type: application/json
```

**Request Body**:
```json
{
  "query": "Compare state-of-the-art open-weights LLMs released in Q4 2024",
  "thread_id": "optional-uuid-session-identifier"
}
```

**Response**: `text/event-stream`
```
event: status
data: {"step": "Classifying query..."}

event: classification
data: {"intent": "comparison", "complexity": "complex", "needs_tools": true, ...}

event: status
data: {"step": "Using research tools: tavily_search"}

event: status
data: {"step": "Synthesizing and formatting structured report..."}

event: result
data: {"answer": "...", "key_points": [...], "sources": [...], "limitations": [...]}

event: done
data: {"status": "complete"}
```

---

## 🗂️ Project Structure

```
Histeria-Ai/
├── backend/
│   ├── controllers.py        # Stream orchestration, agent execution & JSON synthesis
│   ├── main.py               # FastAPI application entrypoint, CORS & routing
│   ├── models.py             # ChatGroq LLM model configurations & fallbacks
│   ├── prompts.py            # System prompts for ReAct agent, classifier & formatter
│   ├── schemas.py            # Pydantic schemas (Query, Source, ResponseFormat)
│   ├── tools.py              # Custom tools: Tavily Search & BeautifulSoup scraper
│   ├── requirements.txt      # Python backend dependencies
│   ├── .env.example          # Sample environment variables
│   └── Procfile              # Render production start command
│
├── frontend/
│   ├── public/               # Static icons & brand assets
│   ├── src/
│   │   ├── components/       # Header, Sidebar, MessageBubble, NeoComponents
│   │   ├── services/         # SSE streaming client & API health verification
│   │   ├── App.jsx           # Master application container & state orchestration
│   │   ├── index.css         # Tailwind base styles
│   │   └── neo-style.css     # Neo-brutalist theme & animations
│   ├── package.json          # Node dependencies & build scripts
│   └── vite.config.js        # Vite build configuration
│
├── .gitignore                # Global git ignore configuration
├── Procfile                  # Platform deployment configuration
└── README.md                 # Project documentation
```

---

## 🛠️ Getting Started

### Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: 18.x or higher & npm
- **API Keys**:
  - [Groq Console](https://console.groq.com/keys) (Ultra-fast LLM inference)
  - [Tavily](https://tavily.com) (Live web search engine)

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS / Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
```

Edit `backend/.env` with your API credentials:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
TAVILY_API_KEY=tvly-your_tavily_api_key_here
ALLOWED_ORIGINS=https://histeria-ai.vercel.app,http://localhost:5173
```

Start the FastAPI development server:
```bash
uvicorn main:app --reload --port 8000
```
API runs locally at `http://localhost:8000`. You can verify operational status at `http://localhost:8000/`.

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Ensure `frontend/.env` points to your backend instance:
```env
VITE_API_BASE_URL=http://localhost:8000
```

Launch the Vite development server:
```bash
npm run dev
```
The client will be running at `http://localhost:5173`.

---

## ⚙️ Environment Variables Reference

| Variable | Scope | Required | Default | Description |
| :--- | :---: | :---: | :---: | :--- |
| `GROQ_API_KEY` | Backend | **Yes** | — | API key for high-speed Groq LLM inference. |
| `TAVILY_API_KEY` | Backend | **Yes** | — | API key for real-time web discovery & page indexing. |
| `GROQ_MODEL` | Backend | No | `openai/gpt-oss-120b` | Base model for research synthesis. |
| `GROQ_CLASSIFIER_MODEL` | Backend | No | `openai/gpt-oss-20b` | High-speed model for query classification. |
| `GROQ_RESEARCH_MODEL` | Backend | No | `openai/gpt-oss-120b` | High-capacity model for ReAct tool execution. |
| `GROQ_SYNTHESIZER_MODEL` | Backend | No | `openai/gpt-oss-20b` | Model executing structured JSON formatting. |
| `ALLOWED_ORIGINS` | Backend | No | `https://histeria-ai.vercel.app,...` | Comma-separated origins for CORS policies. |
| `VITE_API_BASE_URL` | Frontend | No | `http://localhost:8000` | Backend API base URL consumed by the web client. |

---

## 🚀 Production Deployment

### Backend (Render)
- **Environment**: Python 3.10+
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**: Add `GROQ_API_KEY`, `TAVILY_API_KEY`, and `ALLOWED_ORIGINS` in the Render Environment tab.

### Frontend (Vercel)
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Set `VITE_API_BASE_URL=https://histeria-ai.onrender.com`.

---

## 🔧 Diagnostics & Troubleshooting

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`404 - Model not found`** | Specified Groq model is retired or unsupported on your tier. | Use `openai/gpt-oss-120b` or `openai/gpt-oss-20b` in `backend/.env`. Refer to [Groq Supported Models](https://console.groq.com/docs/models). |
| **`401 - Unauthorized`** | Missing or incorrect `GROQ_API_KEY`. | Verify the key in the [Groq Console](https://console.groq.com/keys) and update `backend/.env`. |
| **`429 - Rate Limit Exceeded`** | Exceeded TPM limit on free Groq tier. | Configure `GROQ_MODEL=openai/gpt-oss-20b` in `backend/.env` for a lighter, faster token footprint. |
| **`Tavily Search Error`** | Invalid or missing `TAVILY_API_KEY`. | Obtain a free key at [Tavily](https://tavily.com) and add it to `backend/.env`. |
| **CORS Network Error** | Frontend URL is not in backend allowed origins. | Append your frontend URL to `ALLOWED_ORIGINS` in `backend/.env`. |

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
