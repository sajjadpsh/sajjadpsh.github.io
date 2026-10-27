import { BorderStyle, Document, Packer, Paragraph, TabStopType, TextRun } from 'docx';
import type { Block } from './blocks';

const A4_TEXT_WIDTH = 11906 - 2 * 1000; // page width minus margins, in twips

// Word shapes every script itself, so the .docx is generated in the page's own language.
export function renderDocx(blocks: Block[], rtl: boolean): Promise<Blob> {
  const run = (text: string, size: number, bold = false) =>
    new TextRun({ text, size, bold, font: 'Calibri', rightToLeft: rtl });

  const children = blocks.map((b) => {
    const base = { bidirectional: rtl, spacing: { after: 80 } };
    switch (b.kind) {
      case 'name':
        return new Paragraph({ ...base, children: [run(b.text, 36, true)] });
      case 'heading':
        return new Paragraph({
          ...base,
          spacing: { before: 240, after: 100 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 1 } },
          children: [run(b.text, 24, true)],
        });
      case 'entry':
        return new Paragraph({
          ...base,
          tabStops: [{ type: TabStopType.RIGHT, position: A4_TEXT_WIDTH }],
          children: [run(b.text, 21, true), ...(b.right ? [run(`\t${b.right}`, 20)] : [])],
        });
      case 'bullet':
        return new Paragraph({ ...base, bullet: { level: 0 }, children: [run(b.text, 20)] });
      default:
        return new Paragraph({ ...base, children: [run(b.text, 20)] });
    }
  });

  const margin = { top: 1000, bottom: 1000, left: 1000, right: 1000 };
  return Packer.toBlob(new Document({ sections: [{ properties: { page: { margin } }, children }] }));
}
