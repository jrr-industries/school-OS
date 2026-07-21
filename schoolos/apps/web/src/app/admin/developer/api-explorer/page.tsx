'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Code2, Send, RotateCcw, Shield, Loader2, Copy } from 'lucide-react';

const methods = ['GET', 'POST', 'PUT', 'DELETE'] as const;

const mockResponses: Record<string, string> = {
  GET: JSON.stringify({ success: true, data: { id: 1, name: 'Sample School', code: 'SPR-ELM' }, meta: { total: 156, page: 1, perPage: 10 } }, null, 2),
  POST: JSON.stringify({ success: true, message: 'Resource created successfully', data: { id: 157 } }, null, 2),
  PUT: JSON.stringify({ success: true, message: 'Resource updated successfully' }, null, 2),
  DELETE: JSON.stringify({ success: true, message: 'Resource deleted successfully' }, null, 2),
};

export default function ApiExplorerPage() {
  const [method, setMethod] = useState<typeof methods[number]>('GET');
  const [url, setUrl] = useState('https://api.schoolos.dev/v1/schools');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSend = () => {
    setSending(true);
    setResponse(null);
    setTimeout(() => {
      setResponse(mockResponses[method]);
      setSending(false);
    }, 1200);
  };

  const handleClear = () => {
    setResponse(null);
    setBody('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">API Explorer</h1>
        <p className="text-sm text-muted-foreground mt-1">Explore and test platform APIs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            Request
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {methods.map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`rounded-md px-4 py-2 text-xs font-bold transition-colors ${
                  method === m
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                } ${m === 'GET' ? 'text-emerald-600' : m === 'POST' ? 'text-blue-600' : m === 'PUT' ? 'text-amber-600' : 'text-red-600'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Request URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {(method === 'POST' || method === 'PUT') && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Request Body</label>
              <textarea
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{ "key": "value" }'
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSend}
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? 'Sending...' : 'Send Request'}
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">API Key</p>
                <p className="text-xs text-muted-foreground font-mono">••••••••••••••••••••••••••••••••</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
                <Copy className="h-3 w-3" />
                Copy
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Include your API key in the <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">Authorization</code> header as <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">Bearer YOUR_API_KEY</code></p>
          </div>
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code2 className="h-5 w-5 text-emerald-500" />
              Response
              <span className="ml-auto text-xs font-normal text-muted-foreground">Status: 200 OK</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="rounded-lg bg-slate-950 p-4 overflow-x-auto">
              <code className="text-sm text-emerald-400">{response}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
