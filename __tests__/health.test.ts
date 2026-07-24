import { describe, it, expect, vi } from 'vitest';
import { GET } from '@/app/api/health/route';
import { db } from '@/db';

// Mock the db module
vi.mock('@/db', () => ({
  db: {
    select: vi.fn(),
  }
}));

describe('Health Check API', () => {
  it('returns 200 when DB is connected', async () => {
    // Setup mock for success
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue([{ id: '1' }])
      })
    });
    vi.mocked(db.select).mockImplementation(mockSelect as any);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.database).toBe('connected');
  });

  it('returns 503 when DB is disconnected', async () => {
    // Setup mock for failure
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        limit: vi.fn().mockRejectedValue(new Error('DB Connection Failed'))
      })
    });
    vi.mocked(db.select).mockImplementation(mockSelect as any);

    const res = await GET();
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.status).toBe('error');
    expect(data.database).toBe('disconnected');
  });
});
