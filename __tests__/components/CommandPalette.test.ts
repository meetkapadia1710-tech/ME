import { describe, it, expect } from 'vitest';
import { fuzzy } from '@/components/CommandPalette';

describe('Command Palette - fuzzy filter logic', () => {
  it('returns true when query is empty', () => {
    expect(fuzzy('', 'React')).toBe(true);
  });

  it('matches exact strings ignoring case', () => {
    expect(fuzzy('react', 'React')).toBe(true);
    expect(fuzzy('REACT', 'react')).toBe(true);
  });

  it('matches partial consecutive strings', () => {
    expect(fuzzy('rea', 'React')).toBe(true);
    expect(fuzzy('act', 'React')).toBe(true);
  });

  it('matches non-consecutive characters in order (fuzzy)', () => {
    expect(fuzzy('rt', 'React')).toBe(true);
    expect(fuzzy('rc', 'React')).toBe(true);
    expect(fuzzy('rat', 'React')).toBe(true);
  });

  it('fails when characters are out of order', () => {
    expect(fuzzy('tr', 'React')).toBe(false);
  });

  it('fails when characters are not present', () => {
    expect(fuzzy('z', 'React')).toBe(false);
    expect(fuzzy('reactz', 'React')).toBe(false);
  });
});
