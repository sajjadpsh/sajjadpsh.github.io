'use client';
import { useEffect, useState } from 'react';
import type { Content } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import { hasEditAccess } from '@/lib/auth';

type Props = {
  ui: Content['ui'];
  locale: Locale;
  intl: string;
  rtl: boolean;
  /** Static PDF built at deploy time (/resume/<locale>.pdf, English on fa/ar pages). */
  pdfHref: string;
  fileName: string;
};

/** Everyone gets the static PDF; .docx is offered only to visitors signed in to the CMS with push access. */
export default function ResumeDownload({ ui, locale, intl, rtl, pdfHref, fileName }: Props) {
  const [canEdit, setCanEdit] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    hasEditAccess().then(setCanEdit);
  }, []);

  const downloadDocx = async () => {
    setBusy(true);
    try {
      // Content and generators load on click only, so the page HTML doesn't carry the whole résumé.
      const [{ getContent }, { toBlocks }, { renderDocx }] = await Promise.all([
        import('@/lib/i18n'),
        import('@/lib/resume/blocks'),
        import('@/lib/resume/docx'),
      ]);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(await renderDocx(toBlocks(getContent(locale), intl), rtl));
      a.download = `${fileName}.docx`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a className="btn-primary" href={pdfHref} download={`${fileName}.pdf`} type="application/pdf">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
        </svg>
        {`${ui.downloadResume} · ${ui.pdf}`}
      </a>
      {canEdit && (
        <button type="button" className="btn-ghost" onClick={downloadDocx} disabled={busy}>
          {busy ? ui.generating : ui.docx}
        </button>
      )}
    </div>
  );
}
