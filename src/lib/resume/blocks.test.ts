import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toBlocks } from './blocks.ts';
import type { Content } from '../content.ts';

const content = {
  meta: { title: '', description: '' },
  ui: { summary: 'Summary', present: 'Present', stack: 'Stack' },
  profile: { name: 'Jane', resumeName: 'Jane Q. Doe', headline: 'Dev', summary: 'Hi', location: 'Here', email: 'j@x.io', links: [{ label: 'GH', url: 'gh.com/j' }] },
  sections: [
    { type: 'timeline', id: 'xp', title: 'Experience', items: [{ title: 'Dev', org: 'Acme', start: '2024-11', bullets: ['Built'] }] },
    { type: 'projects', id: 'p', title: 'Projects', items: [{ name: 'P', url: 'p.io', description: 'Thing' }, { name: 'Q', url: 'q.io', description: 'More', role: 'Lead', start: '2025-05', end: '2025-07', outcome: 'Shipped', stack: ['Vue', 'Go'] }] },
    { type: 'skills', id: 's', title: 'Skills', groups: [{ label: 'Tech', items: ['JS', 'Py'] }] },
    { type: 'text', id: 't', title: 'Hidden', hidden: true, body: 'nope' },
  ],
} as unknown as Content;

test('toBlocks flattens visible sections in order', () => {
  const blocks = toBlocks(content, 'en');
  assert.deepEqual(blocks[0], { kind: 'name', text: 'Jane Q. Doe' });
  assert.deepEqual(blocks[2], { kind: 'para', text: 'Here | j@x.io | gh.com/j' });
  assert.deepEqual(blocks.slice(5), [
    { kind: 'heading', text: 'EXPERIENCE' },
    { kind: 'entry', text: 'Dev — Acme', right: 'Nov 2024 – Present' },
    { kind: 'bullet', text: 'Built' },
    { kind: 'heading', text: 'PROJECTS' },
    { kind: 'entry', text: 'P — p.io', right: undefined },
    { kind: 'bullet', text: 'Thing' },
    { kind: 'entry', text: 'Q — Lead — q.io', right: 'May 2025 – Jul 2025' },
    { kind: 'bullet', text: 'More' },
    { kind: 'bullet', text: 'Shipped' },
    { kind: 'bullet', text: 'Stack: Vue, Go' },
    { kind: 'heading', text: 'SKILLS' },
    { kind: 'para', text: 'Tech: JS, Py' },
  ]);
});
