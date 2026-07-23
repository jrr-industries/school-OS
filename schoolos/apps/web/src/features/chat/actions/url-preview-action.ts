'use server';

export async function getUrlPreviewAction(url: string) {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    const html = await res.text();

    const getMeta = (name: string) => {
      const patterns = [
        `property="og:${name}"`,
        `property='og:${name}'`,
        `name="twitter:${name}"`,
        `name='twitter:${name}'`,
      ];
      for (const p of patterns) {
        const idx = html.indexOf(p);
        if (idx === -1) continue;
        const after = html.slice(idx + p.length);
        const contentMatch = after.match(/content=["']([^"']+)/);
        if (contentMatch) return decodeHtmlEntities(contentMatch[1]);
      }
      return null;
    };

    const title = getMeta('title') ?? getMeta('site_name') ?? parsed.hostname;
    const description = getMeta('description');
    const image = getMeta('image');

    return {
      url: parsed.href,
      title,
      description,
      image,
      domain: parsed.hostname,
    };
  } catch {
    return null;
  }
}

function decodeHtmlEntities(str: string) {
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x2F;/g, '/');
}
