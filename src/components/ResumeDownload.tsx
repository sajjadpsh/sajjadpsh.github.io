'use client';
import { useEffect, useState } from 'react';
import type { Content } from '@/lib/content';
import { hasEditAccess } from '@/lib/auth';
import { toBlocks } from '@/lib/resume/blocks';

type Props = {
  ui: Content['ui'];
  /** Page content in its own language, used for .docx. */
  content: Content;
  /** Latin-script content (English on fa/ar pages), used for the PDF. */
  pdfContent: Content;
  intl: string;
  pdfIntl: string;
  rtl: boolean;
};

const save = (blob: Blob, fileName: string) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

/** Everyone gets the PDF; .docx is offered only to visitors signed in to the CMS with push access. */
export default function ResumeDownload({ ui, content, pdfContent, intl, pdfIntl, rtl }: Props) {
  const [canEdit, setCanEdit] = useState(false);
  const [busy, setBusy] = useState<'pdf' | 'docx' | null>(null);
  useEffect(() => {
    hasEditAccess().then(setCanEdit);
  }, []);

  const { name, resumeName } = pdfContent.profile;
  const fileName = `${(resumeName || name).replace(/\s+/g, '_')}_Resume`;

  const download = async (kind: 'pdf' | 'docx') => {
    setBusy(kind);
    try {
      if (kind === 'pdf') {
        const { renderPdf } = await import('@/lib/resume/pdf');
        save(renderPdf(toBlocks(pdfContent, pdfIntl)), `${fileName}.pdf`);
      } else {
        const { renderDocx } = await import('@/lib/resume/docx');
        save(await renderDocx(toBlocks(content, intl), rtl), `${fileName}.docx`);
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className="btn-primary" onClick={() => download('pdf')} disabled={busy !== null}>
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
        </svg>
        {busy === 'pdf' ? ui.generating : `${ui.downloadResume} · ${ui.pdf}`}
      </button>
      {canEdit && (
        <button type="button" className="btn-ghost" onClick={() => download('docx')} disabled={busy !== null}>
          {busy === 'docx' ? ui.generating : ui.docx}
        </button>
      )}
    </div>
  );
}
