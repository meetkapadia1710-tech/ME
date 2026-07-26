import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitContactForm } from '@/app/actions/contact';
import * as Sentry from '@sentry/nextjs';

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

// Each test gets its own client IP so the rate limiter (3 per IP per 10 min)
// doesn't leak state between cases.
const { sendMock, clientIp } = vi.hoisted(() => ({
  sendMock: vi.fn(),
  clientIp: { value: '203.0.113.1' },
}));

vi.mock('next/headers', () => ({
  headers: () => ({
    get: (key: string) => (key === 'x-forwarded-for' ? clientIp.value : null),
  }),
}));

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

function validForm() {
  const formData = new FormData();
  formData.append('email', 'test@example.com');
  formData.append('name', 'John Doe');
  formData.append('message', 'Hello!');
  return formData;
}

let ipCounter = 0;

describe('Contact Form Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key';
    sendMock.mockResolvedValue({ data: { id: 'msg_1' }, error: null });
    clientIp.value = `203.0.113.${++ipCounter}`;
  });

  it('fails when fields are missing', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    // Missing name and message

    const result = await submitContactForm(null, formData);
    expect(result).toEqual({ success: false, error: 'Missing required fields' });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('fails with invalid email', async () => {
    const formData = new FormData();
    formData.append('email', 'not-an-email');
    formData.append('name', 'John Doe');
    formData.append('message', 'Hello!');

    const result = await submitContactForm(null, formData);
    expect(result).toEqual({ success: false, error: 'Invalid email address' });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('rejects an over-long message without calling the provider', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('name', 'John Doe');
    formData.append('message', 'x'.repeat(5001));

    const result = await submitContactForm(null, formData);
    expect(result).toEqual({ success: false, error: 'Message is too long' });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('sends the message and reports success', async () => {
    const result = await submitContactForm(null, validForm());

    expect(result).toEqual({ success: true });
    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'meetkapadia1710@gmail.com',
        replyTo: 'test@example.com',
        subject: 'Portfolio contact from John Doe',
        text: expect.stringContaining('Hello!'),
      })
    );
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('strips newlines from the name so it cannot restructure the subject', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('name', 'John\r\nBcc: someone@evil.test');
    formData.append('message', 'Hello!');

    await submitContactForm(null, formData);

    const subject = sendMock.mock.calls[0][0].subject as string;
    expect(subject).not.toMatch(/[\r\n]/);
  });

  it('reports failure when the provider returns an error', async () => {
    sendMock.mockResolvedValue({ data: null, error: { name: 'validation_error' } });

    const result = await submitContactForm(null, validForm());

    expect(result).toEqual({ success: false, error: 'Failed to send message' });
    expect(Sentry.captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ tags: { context: 'contact-form' } })
    );
  });

  it('reports failure when the provider throws', async () => {
    sendMock.mockRejectedValue(new Error('network down'));

    const result = await submitContactForm(null, validForm());

    expect(result).toEqual({ success: false, error: 'Failed to send message' });
    expect(Sentry.captureException).toHaveBeenCalled();
  });

  it('never reports success when the API key is missing', async () => {
    delete process.env.RESEND_API_KEY;

    const result = await submitContactForm(null, validForm());

    expect(result).toEqual({ success: false, error: 'Failed to send message' });
    expect(sendMock).not.toHaveBeenCalled();
    expect(Sentry.captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ tags: { context: 'contact-form' } })
    );
  });

  it('rate limits repeated submissions from the same IP', async () => {
    // Same IP for every call in this test.
    clientIp.value = '198.51.100.77';

    const first = await submitContactForm(null, validForm());
    const second = await submitContactForm(null, validForm());
    const third = await submitContactForm(null, validForm());
    const fourth = await submitContactForm(null, validForm());

    expect(first).toEqual({ success: true });
    expect(second).toEqual({ success: true });
    expect(third).toEqual({ success: true });
    expect(fourth.success).toBe(false);
    expect(fourth.error).toMatch(/too many/i);
    expect(sendMock).toHaveBeenCalledTimes(3);
  });
});
