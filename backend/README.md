# ⚙️ Histeria-AI Backend

FastAPI-powered streaming backend for autonomous research and structured synthesis using LangChain, LangGraph ReAct agent loops, and Groq inference.

---

## 🚀 Architecture & Endpoints

- **`GET /`**: Health check and configuration status. Returns service status, verified environment flags (`groq_configured`, `tavily_configured`), and currently configured model IDs.
- **`POST /query`**: Accepts `{ "query": "string", "thread_id": "string" | null }` and streams Server-Sent Events (`text/event-stream`):
  - `status`: Node execution updates (`Classifying query`, `Researching`, `Using research tools`, etc.)
  - `classification`: Query classification metadata (`intent`, `complexity`, `needs_tools`)
  - `result`: Final validated JSON research report conforming to the Pydantic schema
  - `error`: Detailed, actionable diagnostic message on failures
  - `done`: Stream completion indicator

---

## 🛠️ Environment Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Environment Variables

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `GROQ_API_KEY` | **Yes** | — | Groq API Key from [Groq Console](https://console.groq.com/keys) |
| `TAVILY_API_KEY` | **Yes** | — | Tavily Search API key for real-time web retrieval from [Tavily](https://tavily.com) |
| `GROQ_MODEL` | No | `openai/gpt-oss-120b` | General Groq model used for research & synthesis |
| `GROQ_CLASSIFIER_MODEL` | No | `openai/gpt-oss-20b` | Fast model for routing and query classification |
| `GROQ_RESEARCH_MODEL` | No | `openai/gpt-oss-120b` | Model executing multi-step ReAct agent research |
| `GROQ_SYNTHESIZER_MODEL` | No | `openai/gpt-oss-120b` | Model structuring research findings into Pydantic JSON |

> **Note on Groq Models**: Ensure you are using models currently supported by Groq (such as `openai/gpt-oss-120b` or `openai/gpt-oss-20b`). Retired model IDs (e.g., `llama-3.3-70b-versatile`) will return a 404 `model_not_found` error.

---

## 🏃 Running the Server

```bash
# Activate virtual environment
venv\Scripts\activate   # Windows
# source venv/bin/activate  # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8000
```
