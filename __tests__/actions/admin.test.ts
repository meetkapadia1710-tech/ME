import { describe, it, expect, vi } from 'vitest';
import { createProjectAction, editProjectAction, deleteProjectAction, togglePostPublishAction } from '@/app/admin/actions';

vi.mock('@/db', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 1 }]),
  }
}));

describe('Admin Panel CRUD Actions', () => {
  it('creates a project', async () => {
    const data = { name: 'Test Project', slug: 'test-project', type: 'Personal', year: '2024', tags: [], tagline: 'Test', overview: 'Test' };
    const result = await createProjectAction(data);
    expect(result.success).toBe(true);
    expect(result.project).toBeDefined();
  });

  it('edits a project', async () => {
    const result = await editProjectAction(1, { name: 'Updated Project' });
    expect(result.success).toBe(true);
  });

  it('deletes a project', async () => {
    const result = await deleteProjectAction(1);
    expect(result.success).toBe(true);
  });

  it('toggles post publish status', async () => {
    const result = await togglePostPublishAction(1, true);
    expect(result.success).toBe(true);
  });
});
