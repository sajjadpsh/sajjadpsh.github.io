import { jsPDF } from 'jspdf';
import type { Block } from './blocks';

// Built-in Helvetica keeps the PDF text-selectable for ATS parsers but only covers Latin scripts,
// so callers pass Latin-script content (see ResumeDownload).
export function renderPdf(blocks: Block[]): Blob {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 50;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const bottom = doc.internal.pageSize.getHeight() - margin;
  let y = margin;

  const font = (size: number, bold = false) => doc.setFont('helvetica', bold ? 'bold' : 'normal').setFontSize(size);
  const ensure = (h: number) => {
    if (y + h > bottom) {
      doc.addPage();
      y = margin;
    }
  };
  const write = (text: string, size: number, bold = false, indent = 0, maxWidth = width - indent) => {
    font(size, bold);
    for (const line of doc.splitTextToSize(text, maxWidth) as string[]) {
      ensure(size * 1.35);
      doc.text(line, margin + indent, y + size);
      y += size * 1.35;
    }
  };

  for (const b of blocks) {
    if (b.kind === 'name') write(b.text, 20, true);
    else if (b.kind === 'para') {
      write(b.text, 10);
      y += 3;
    } else if (b.kind === 'heading') {
      ensure(40);
      y += 10;
      write(b.text, 12, true);
      doc.setLineWidth(0.6).line(margin, y + 1, margin + width, y + 1);
      y += 7;
    } else if (b.kind === 'entry') {
      ensure(30);
      font(10);
      const rightWidth = b.right ? doc.getTextWidth(b.right) + 12 : 0;
      if (b.right) doc.text(b.right, margin + width, y + 10.5, { align: 'right' });
      write(b.text, 10.5, true, 0, width - rightWidth);
      y += 1;
    } else write(`•  ${b.text}`, 10, false, 10);
  }
  return doc.output('blob');
}
