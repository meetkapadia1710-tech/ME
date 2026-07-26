import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProjectAction, editProjectAction, deleteProjectAction } from '@/app/admin/actions';
import { revalidatePath } from 'next/cache';

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

// revalidatePath needs Next's static generation store, which doesn't exist
// outside a request. Mock it so we can assert it was called.
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

/** The public pages that must be flushed after any admin mutation. */
const PUBLIC_PAGES = ['/', '/archive', '/archive/[slug]', '/work/[slug]'];

function expectPublicPagesRevalidated() {
  for (const page of PUBLIC_PAGES) {
    expect(revalidatePath).toHaveBeenCalledWith(
      page,
      ...(page.includes('[slug]') ? ['page'] : [])
    );
  }
}

describe('Admin Panel CRUD Actions', () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockAuth.mockResolvedValue({ user: { email: 'test@example.com' } });
    vi.mocked(revalidatePath).mockClear();
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
    expect(revalidatePath).not.toHaveBeenCalled();
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
    // Must fire BEFORE redirect() — redirect throws, so anything after is dead code.
    expectPublicPagesRevalidated();
  });

  it('edits a project', async () => {
    const result = await editProjectAction(1, { name: 'Updated Project' });
    expect(result).toBeDefined();
    if (result) expect(result.success).toBe(true);
    expectPublicPagesRevalidated();
  });

  it('deletes a project', async () => {
    const result = await deleteProjectAction(1);
    expect(result).toBeDefined();
    if (result) expect(result.success).toBe(true);
    expectPublicPagesRevalidated();
  });

});
