'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfViewerInner({ url, fileName }: { url: string; fileName?: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <p className="text-xs font-medium truncate">{fileName ?? 'PDF Document'}</p>
        <span className="text-[10px] text-muted-foreground">
          {numPages ? `${pageNumber} / ${numPages}` : ''}
        </span>
      </div>

      <div className="relative">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
        <Document
          file={url}
          onLoadSuccess={({ numPages: n }) => {
            setNumPages(n);
            setLoading(false);
          }}
          onLoadError={() => setLoading(false)}
          loading={null}
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer
            renderAnnotationLayer
            width={Math.min(typeof window !== 'undefined' ? window.innerWidth * 0.6 : 500, 600)}
          />
        </Document>
      </div>

      {numPages && numPages > 1 && (
        <div className="flex items-center justify-center gap-2 px-3 py-2 border-t bg-muted/30">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="px-2 py-1 text-xs rounded bg-background border hover:bg-muted disabled:opacity-30 transition-colors"
          >
            Prev
          </button>
          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="px-2 py-1 text-xs rounded bg-background border hover:bg-muted disabled:opacity-30 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
