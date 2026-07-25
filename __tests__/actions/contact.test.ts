import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitContactForm } from '@/app/actions/contact';
import * as Sentry from '@sentry/nextjs';

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

describe('Contact Form Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fails when fields are missing', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    // Missing name and message

    const result = await submitContactForm(null, formData);
    expect(result).toEqual({ success: false, error: "Missing required fields" });
  });

  it('fails with invalid email', async () => {
    const formData = new FormData();
    formData.append('email', 'not-an-email');
    formData.append('name', 'John Doe');
    formData.append('message', 'Hello!');

    const result = await submitContactForm(null, formData);
    expect(result).toEqual({ success: false, error: "Invalid email address" });
  });

  it('succeeds with valid input', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('name', 'John Doe');
    formData.append('message', 'Hello!');

    const result = await submitContactForm(null, formData);
    expect(result).toEqual({ success: true });
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('handles failure and captures with Sentry', async () => {
    const formData = new FormData();
    formData.append('email', 'fail@example.com');
    formData.append('name', 'John Doe');
    formData.append('message', 'Hello!');

    const result = await submitContactForm(null, formData);
    expect(result).toEqual({ success: false, error: "Failed to send message" });
    expect(Sentry.captureException).toHaveBeenCalled();
    expect(Sentry.captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ tags: { context: 'contact-form' } })
    );
  });
});
