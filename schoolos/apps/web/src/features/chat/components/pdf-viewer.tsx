import dynamic from 'next/dynamic';

export const PdfViewer = dynamic(
  () => import('./pdf-viewer-inner').then((mod) => ({ default: mod.PdfViewerInner })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  },
);

