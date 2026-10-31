import type { Content } from '../content.ts';
import { formatPeriod } from '../period.ts';

// Format-neutral resume outline: single column, plain text, standard headings (ATS-friendly).
// pdf.ts and docx.ts only decide how each block looks.
export type Block =
  | { kind: 'name'; text: string }
  | { kind: 'para'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'entry'; text: string; right?: string }
  | { kind: 'bullet'; text: string };

export function toBlocks({ profile, ui, sections }: Content, intl: string): Block[] {
  const contact = [profile.location, profile.email, profile.phone, ...profile.links.map((l) => l.url)];
  const blocks: Block[] = [
    { kind: 'name', text: profile.resumeName || profile.name },
    { kind: 'para', text: profile.headline },
    { kind: 'para', text: contact.filter(Boolean).join(' | ') },
    { kind: 'heading', text: ui.summary.toUpperCase() },
    { kind: 'para', text: profile.summary },
  ];

  for (const s of sections) {
    if (s.hidden) continue;
    blocks.push({ kind: 'heading', text: s.title.toUpperCase() });
    if (s.type === 'timeline') {
      for (const i of s.items) {
        const where = [i.org, i.location].filter(Boolean).join(', ');
        blocks.push({ kind: 'entry', text: `${i.title} — ${where}`, right: formatPeriod(i.start, i.end, intl, ui.present) });
        for (const b of i.bullets ?? []) blocks.push({ kind: 'bullet', text: b });
      }
    } else if (s.type === 'projects') {
      for (const p of s.items) {
        const right = p.start ? formatPeriod(p.start, p.end, intl, ui.present) : undefined;
        blocks.push({ kind: 'entry', text: [p.name, p.role, p.url].filter(Boolean).join(' — '), right });
        blocks.push({ kind: 'bullet', text: p.description });
        if (p.outcome) blocks.push({ kind: 'bullet', text: p.outcome });
        if (p.stack?.length) blocks.push({ kind: 'bullet', text: `${ui.stack}: ${p.stack.join(', ')}` });
      }
    } else if (s.type === 'skills') {
      for (const g of s.groups) blocks.push({ kind: 'para', text: `${g.label}: ${g.items.join(', ')}` });
    } else {
      blocks.push({ kind: 'para', text: s.body });
    }
  }
  return blocks;
}
