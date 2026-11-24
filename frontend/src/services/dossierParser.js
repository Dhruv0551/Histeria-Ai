/**
 * Pure JavaScript utility functions for extracting domains and dossier data.
 * Contains no JSX.
 */

/**
 * Extracts a domain name safely from a URL
 */
export function extractDomain(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.split('/')[0] || 'web';
  }
}

/**
 * Analyzes raw text to check if it contains a structured dossier report
 * (### Key Points, ### Sources, ### Limitations) and parses it into an object.
 */
export function extractReportFromText(text) {
  if (!text || typeof text !== 'string') return null;

  const hasKeyPoints = /###\s*Key\s*Points/i.test(text);
  const hasSources = /###\s*Sources/i.test(text);
  const hasLimitations = /###\s*Limitations/i.test(text);

  if (!hasKeyPoints && !hasSources && !hasLimitations) {
    return null;
  }

  const sections = text.split(/(?=###\s*(?:Key\s*Points|Sources|Limitations))/i);
  let answer = '';
  const key_points = [];
  const sources = [];
  const limitations = [];

  for (const section of sections) {
    const trimmed = section.trim();
    if (/^###\s*Key\s*Points/i.test(trimmed)) {
      const body = trimmed.replace(/^###\s*Key\s*Points\s*/i, '');
      const lines = body.split('\n');
      for (const line of lines) {
        const clean = line.replace(/^[*-]\s+/, '').trim();
        if (clean) key_points.push(clean);
      }
    } else if (/^###\s*Sources/i.test(trimmed)) {
      const body = trimmed.replace(/^###\s*Sources\s*/i, '');
      const lines = body.split('\n');
      for (const line of lines) {
        const clean = line.replace(/^[*-]\s+/, '').trim();
        if (!clean) continue;
        const match = clean.match(/\[([^\]]+)\]\(([^)]+)\)(?::\s*(.*))?/);
        if (match) {
          sources.push({
            title: match[1].trim(),
            url: match[2].trim(),
            relevance: (match[3] || '').trim(),
          });
        } else {
          sources.push({ title: clean, url: '', relevance: '' });
        }
      }
    } else if (/^###\s*Limitations/i.test(trimmed)) {
      const body = trimmed.replace(/^###\s*Limitations\s*/i, '');
      const lines = body.split('\n');
      for (const line of lines) {
        const clean = line.replace(/^[*-]\s+/, '').trim();
        if (clean) limitations.push(clean);
      }
    } else {
      if (!answer) {
        answer = trimmed;
      } else {
        answer += '\n\n' + trimmed;
      }
    }
  }

  return { answer, key_points, sources, limitations };
}
