import { describe, it, expect, vi, beforeEach } from 'vitest';
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

// Mock auth module
const mockAuth = vi.fn();
vi.mock('@/auth', () => ({
  auth: () => mockAuth()
}));

// Mock redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}));

describe('Admin Panel CRUD Actions', () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockAuth.mockResolvedValue({ user: { email: 'test@example.com' } });
  });

  it('rejects action if no session is found', async () => {
    mockAuth.mockResolvedValue(null); // Unauthenticated
    const projectData = {
      name: "Test Project",
      slug: "test-project",
      type: "Personal" as const,
      year: "2024", tags: [], tagline: 'Test', overview: 'Test' 
    };
    const result = await createProjectAction(projectData);
    expect(result).toEqual({ success: false, error: 'Unauthorized' });
  });

  it('creates a project', async () => {
    const projectData = {
      name: "Test Project",
      slug: "test-project",
      type: "Personal" as const,
      year: "2024", tags: [], tagline: 'Test', overview: 'Test' };
    const result = await createProjectAction(projectData);
    // Since it redirects on success, the return value in our test could be undefined or `{ success: true }` if we bypassed the redirect logic or caught it.
    // Wait, createProjectAction doesn't return anything on success, it calls redirect().
    // So `result` should be undefined.
    expect(result).toBeUndefined();
  });

  it('edits a project', async () => {
    const result = await editProjectAction(1, { name: 'Updated Project' });
    expect(result).toBeDefined();
    if (result) expect(result.success).toBe(true);
  });

  it('deletes a project', async () => {
    const result = await deleteProjectAction(1);
    expect(result).toBeDefined();
    if (result) expect(result.success).toBe(true);
  });

  it('toggles post publish status', async () => {
    const result = await togglePostPublishAction(1, true);
    expect(result).toBeDefined();
    if (result) expect(result.success).toBe(true);
  });
});
