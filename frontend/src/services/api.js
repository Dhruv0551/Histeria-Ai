export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://histeria-ai.onrender.com'
).replace(/\/+$/, '');

export async function checkBackendHealth(targetUrl = API_BASE_URL) {
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const cleanUrl = (targetUrl || API_BASE_URL).replace(/\/+$/, '');
    const res = await fetch(`${cleanUrl}/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText || 'Health check failed'}`);
    }
    const data = await res.json();
    return {
      ok: true,
      status: res.status,
      latencyMs,
      data,
      checkedAt: new Date().toISOString(),
      url: cleanUrl,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;
    const isTimeout = err.name === 'AbortError';
    return {
      ok: false,
      status: isTimeout ? 408 : 0,
      latencyMs,
      error: isTimeout ? 'Request timed out after 15s (Render instance may be waking from sleep)' : err.message,
      checkedAt: new Date().toISOString(),
      url: targetUrl || API_BASE_URL,
    };
  }
}

export async function streamAgentQuery(query, { onToken, onResult, onStatus, onDone, onError }) {
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
      
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6);
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.type === 'token') {
              onToken?.(parsed.content);
            } else if (parsed.type === 'result') {
              onResult?.(parsed.content);
            } else if (parsed.type === 'status') {
              onStatus?.(parsed.content);
            } else if (parsed.type === 'error') {
              onError?.(parsed.content);
            } else if (parsed.type === 'done') {
              onDone?.();
            }
          } catch (err) {
            console.warn('Failed to parse SSE line:', jsonStr, err);
          }
        }
      }
    }

    if (buffer.trim().startsWith('data: ')) {
      const jsonStr = buffer.trim().slice(6);
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.type === 'token') onToken?.(parsed.content);
        if (parsed.type === 'result') onResult?.(parsed.content);
        if (parsed.type === 'status') onStatus?.(parsed.content);
        if (parsed.type === 'error') onError?.(parsed.content);
        if (parsed.type === 'done') onDone?.();
      } catch {
      }
    }

    onDone?.();
  } catch (err) {
    console.error('SSE Stream Error:', err);
    onError?.(err.message || 'Stream connection failed');
  }
}
