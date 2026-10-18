/**
 * API client to communicate with the FastAPI backend
 */

const API_BASE_URL = 'http://localhost:8000';

/**
 * Check backend health status
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Stream query to /query endpoint
 * Parses text/event-stream chunks formatted as `data: {"type": ..., "content": ...}\n\n`
 *
 * @param {string} query
 * @param {object} callbacks
 * @param {function} callbacks.onToken
 * @param {function} callbacks.onStatus
 * @param {function} callbacks.onDone
 * @param {function} callbacks.onError
 */
export async function streamAgentQuery(query, { onToken, onStatus, onDone, onError }) {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      
      // Keep unfinished part in buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6);
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.type === 'token') {
              onToken?.(parsed.content);
            } else if (parsed.type === 'status') {
              onStatus?.(parsed.content);
            } else if (parsed.type === 'done') {
              onDone?.();
            }
          } catch (e) {
            console.warn('Failed to parse SSE line:', jsonStr, e);
          }
        }
      }
    }

    // Process remainder if any
    if (buffer.trim().startsWith('data: ')) {
      const jsonStr = buffer.trim().slice(6);
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.type === 'token') onToken?.(parsed.content);
        if (parsed.type === 'done') onDone?.();
      } catch (e) {
        // ignore
      }
    }

    onDone?.();
  } catch (err) {
    console.error('SSE Stream Error:', err);
    onError?.(err.message || 'Stream connection failed');
  }
}
