import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toBlocks } from './blocks.ts';
import type { Content } from '../content.ts';

const content = {
  meta: { title: '', description: '' },
  ui: { summary: 'Summary', present: 'Present' },
  profile: { name: 'Jane', headline: 'Dev', summary: 'Hi', location: 'Here', email: 'j@x.io', links: [{ label: 'GH', url: 'gh.com/j' }] },
  sections: [
    { type: 'timeline', id: 'xp', title: 'Experience', items: [{ title: 'Dev', org: 'Acme', start: '2024-11', bullets: ['Built'] }] },
    { type: 'projects', id: 'p', title: 'Projects', items: [{ name: 'P', url: 'p.io', description: 'Thing' }] },
    { type: 'skills', id: 's', title: 'Skills', groups: [{ label: 'Tech', items: ['JS', 'Py'] }] },
    { type: 'text', id: 't', title: 'Hidden', hidden: true, body: 'nope' },
  ],
} as unknown as Content;

test('toBlocks flattens visible sections in order', () => {
  const blocks = toBlocks(content, 'en');
  assert.deepEqual(blocks[2], { kind: 'para', text: 'Here | j@x.io | gh.com/j' });
  assert.deepEqual(blocks.slice(5), [
    { kind: 'heading', text: 'EXPERIENCE' },
    { kind: 'entry', text: 'Dev — Acme', right: 'Nov 2024 – Present' },
    { kind: 'bullet', text: 'Built' },
    { kind: 'heading', text: 'PROJECTS' },
    { kind: 'entry', text: 'P — p.io' },
    { kind: 'bullet', text: 'Thing' },
    { kind: 'heading', text: 'SKILLS' },
    { kind: 'para', text: 'Tech: JS, Py' },
  ]);
});
