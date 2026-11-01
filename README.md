# ⚡ Histeria-AI

> **An Autonomous Research & Decision-Making Agent** powered by LangChain, LangGraph ReAct loops, Groq ultra-fast LLM inference, and real-time multi-source web intelligence.

---

## 🌟 Overview

**Histeria-AI** is an advanced autonomous research agent designed to perform deep, multi-step inquiries, verify real-time web facts, synthesize evidence-backed conclusions, and deliver structured, citation-rich research dossiers through a responsive cyber-retro UI.

Unlike typical chatbots that hallucinate or provide surface-level static answers, Histeria-AI executes an iterative **Action $\rightarrow$ Observation $\rightarrow$ Reflection** loop, querying the live web, extracting readable DOM content, cross-verifying sources, maintaining conversation state via thread checkpointing, and outputting validated JSON reports formatted into executive summaries.

---

## 🏗️ Architecture

```
                    ┌────────────────────────┐
                    │      React Client      │
                    │   (Vite + Tailwind)    │
                    └───────────┬────────────┘
                                │ SSE Stream (/query)
                                ▼
                    ┌────────────────────────┐
                    │     FastAPI Server     │
                    │  (Async Event Engine)  │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │   LangGraph / Agent    │ ◄───► [ InMemorySaver ]
                    │      (ReAct Loop)      │       (Thread State)
                    └───────────┬────────────┘
                                │
               ┌────────────────┴────────────────┐
               ▼                                 ▼
   ┌───────────────────────┐         ┌───────────────────────┐
   │     Groq LLM Engine   │         │     Agent Tools       │
   │ (ChatGroq /           │         │ • Tavily Web Search   │
   │  openai/gpt-oss-120b) │         │ • URL Data Scraper    │
   └───────────┬───────────┘         └───────────────────────┘
               │
               ▼
   ┌───────────────────────┐
   │ Structured Formatter  │
   │ (Pydantic Schema JSON)│
   └───────────────────────┘
```

---

## 🚀 Key Features

- **Autonomous ReAct Agent Loop**: Iteratively selects tools, executes actions, analyzes observations, and decides whether further evidence is required before stopping.
- **Real-Time Live Web Intelligence**: Integrated with Tavily Web Search to extract top ranked, high-relevance web references.
- **Deep Webpage Data Extractor**: Custom HTML parser using `BeautifulSoup` that strips scripts/styles and extracts up to 12,000 characters of clean readable text from targeted URLs.
- **Structured Pydantic Reports**: Guaranteed output structure featuring:
  - Direct executive answer
  - Key supporting points
  - Granular sources with titles, URLs, and contextual relevance
  - Transparent research limitations & unresolved uncertainties
- **Server-Sent Events (SSE) Streaming**: Low-latency, real-time node state telemetry (`Research started`, `Researching`, `Using research tools`, `Formatting report`).
- **Thread-Aware State Checkpointing**: LangGraph `InMemorySaver` enables continuous conversation history and context-aware follow-up queries.
- **Retro-Cyber Neo-Brutalist UI**: Modern frontend built with React, Vite, Lucide icons, canvas-confetti, live backend health check monitoring, and query history caching.

---

## 📊 Current Implementation Status

Here is the progress mapping against our core engineering milestones:

```
[████████████████████████████░░░░░░░░░░] 60% Overall Progress
```

| Component | Status | Details |
| :--- | :---: | :--- |
| **Custom Tools Implementation** | ✅ Complete | Tavily Search tool & BeautifulSoup URL extractor with schema validation. |
| **LangChain ReAct Execution** | ✅ Complete | Action $\rightarrow$ observation $\rightarrow$ next-action loop with `create_agent`. |
| **Groq LLM Integration** | ✅ Complete | Fast inference using ChatGroq models (`openai/gpt-oss-120b`). |
| **Strict Pydantic Output** | ✅ Complete | JSON-mode bounded response with `answer`, `key_points`, `sources`, `limitations`. |
| **Streaming SSE Server** | ✅ Complete | FastAPI streaming endpoint with node-level progress updates. |
| **Interactive Frontend** | ✅ Complete | React + Vite UI with real-time SSE parsing, health monitoring & chat memory. |
| **Thread Checkpointing** | 🟡 In Progress | `InMemorySaver` integrated; persistent DB storage (SQLAlchemy) planned. |
| **Citation Verification & Cross-Checking** | 🟡 In Progress | Grounding prompt in place; automated citation verification suite pending. |
| **Human-in-the-Loop Clarification** | ⚪ Roadmap | Interactive clarification when queries are ambiguous. |
| **Evaluation Benchmark** | ⚪ Roadmap | 20–30 task benchmark suite for accuracy & tool selection metrics. |

---

## 🗺️ Project Roadmap

The roadmap follows a 4-week incremental progression from core tool-using agent to an evaluated, production-grade autonomous research system.

![Project Roadmap](backend/proj-roadmap.png)

### 📍 Week 1: Build a Working Tool-Using Agent *(Completed ✅)*
- [x] Implement custom tools (`search_tool`, `get_data_from_url`).
- [x] Integrate LangChain's tool-calling capabilities.
- [x] Build the action $\rightarrow$ observation $\rightarrow$ next-action loop.
- [x] Set maximum iteration limit and safety constraints.
- [x] Inspect exact arguments and results of each tool call via live telemetry.
> **Milestone Achieved**: The agent autonomously solves multi-step research tasks without a rigid, hardcoded sequence of tool calls.

---

### 📍 Week 2: Make the Agent Robust *(Currently Active 🟡)*
- [x] Add structured state and a structured research plan schema.
- [x] Implement tool failure resilience and safe URL validation.
- [x] Track exact sources, titles, and citation relevance.
- [x] Add evidence verification guidelines and strict stopping conditions in system prompts.
- [ ] Implement automated contradiction detection between divergent sources.
- [ ] Stress-test edge queries (vague user intent, missing data, conflicting claims).
> **Milestone Goal**: The agent consistently knows when to deepen research and when sufficient evidence has been acquired to stop.

---

### 📍 Week 3: Add State Persistence & User Interaction *(Next Up 📅)*
- [ ] **Persistent Storage**: Transition from in-memory checkpointer to persistent database storage (SQLAlchemy / PostgreSQL / Qdrant).
- [ ] **Interrupt & Resume**: Support long-running research tasks with pause, resume, and checkpoint restore.
- [ ] **Interactive Clarification**: Allow the agent to halt and ask the user for clarification when prompts are ambiguous or multi-faceted.
- [ ] **Human-in-the-Loop (HITL)**: Require user confirmation before executing consequential or compute-heavy actions.
- [ ] **Observability & Telemetry**: Log granular tool traces, token usage, cost analytics, and step-by-step latency.
> **Milestone Goal**: The agent can recover seamlessly from interruptions and transparently explain its reasoning process.

---

### 📍 Week 4: Evaluate & Prepare for the Next Framework *(Future 🎯)*
- [ ] **Benchmark Dataset**: Curate a standardized evaluation dataset of 20–30 diverse research tasks.
- [ ] **Tool-Selection Benchmarks**: Measure tool-selection accuracy, precision, and task completion rate.
- [ ] **Hallucination & Citation Auditing**: Verify citation correctness, URL validity, and unsupported claim percentage.
- [ ] **A/B Architecture Comparison**: Benchmark the planned verified agent against a naive zero-shot baseline agent.
- [ ] **Documentation & Post-Mortem**: Document edge-case failure modes, architectural trade-offs, and scalability bottlenecks.
> **Milestone Goal**: Demonstrate measurable performance and empirical verification of design choices.

---

## 📂 Repository Structure

```
Histeria-Ai/
├── backend/
│   ├── controllers.py        # Stream orchestration, agent execution & JSON formatting
│   ├── main.py               # FastAPI application entrypoint & routing
│   ├── models.py             # ChatGroq LLM model instantiation
│   ├── prompts.py            # ReAct instructions & JSON formatter system prompts
│   ├── schemas.py            # Pydantic schemas (Query, Source, ResponseFormat)
│   ├── tools.py              # Custom tools (Tavily search & URL scraper)
│   ├── proj-roadmap.png      # Roadmap milestone diagram
│   ├── requirements.txt      # Backend Python dependencies
│   └── .env                  # API keys and secrets (GROQ_API_KEY, TAVILY_API_KEY)
│
└── frontend/
    ├── public/               # Public assets and icons
    ├── src/
    │   ├── components/       # Header, Sidebar, MessageBubble, NeoComponents
    │   ├── services/         # api.js (SSE event source handler & health checks)
    │   ├── App.jsx           # Main application chat container & state management
    │   ├── index.css         # Base styles & Tailwind directives
    │   └── neo-style.css     # Cyber-retro neo-brutalist styling
    ├── package.json          # Frontend packages & scripts
    └── vite.config.js        # Vite configuration
```

---

## 🛠️ Quickstart Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- [Groq API Key](https://console.groq.com)
- [Tavily Search API Key](https://tavily.com)

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy .env.example to .env
cp .env.example .env

# Edit .env and supply your API keys:
# GROQ_API_KEY=gsk_...
# TAVILY_API_KEY=tvly-...
# (Optional) GROQ_MODEL=openai/gpt-oss-120b

# Start FastAPI server
uvicorn main:app --reload --port 8000
```
API server runs at `http://localhost:8000`. You can verify health and active models at `http://localhost:8000/`.

### 2. Frontend Setup

```bash
cd frontend

# Install npm packages
npm install

# Start Vite development server
npm run dev
```
Client runs at `http://localhost:5173`.

---

## 🔧 Troubleshooting & Common Errors

| Error | Root Cause | Solution |
| :--- | :--- | :--- |
| **`404 - The model ... does not exist`** | The model ID configured is retired or not accessible on your Groq tier (e.g. `llama-3.3-70b-versatile`). | Set `GROQ_MODEL=openai/gpt-oss-120b` or `openai/gpt-oss-20b` in `backend/.env`. Check active models at [Groq Models](https://console.groq.com/docs/models). |
| **`401 - Invalid API Key`** | Missing or incorrect `GROQ_API_KEY`. | Verify your key at [Groq Console Keys](https://console.groq.com/keys) and update `backend/.env`. |
| **`429 - Rate Limit Exceeded`** | Exceeded TPM (tokens per minute) limit on free Groq tier. | Wait 30–60 seconds, or switch to the faster/lighter `GROQ_MODEL=openai/gpt-oss-20b` in `backend/.env`. |
| **`Tavily Search Error`** | Missing or invalid `TAVILY_API_KEY`. | Obtain a free key at [Tavily](https://tavily.com) and add `TAVILY_API_KEY=...` to `backend/.env`. |
| **`Missing GROQ_API_KEY` on boot** | Server started without `.env` configured. | Copy `.env.example` to `backend/.env` and add your keys. |

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).
