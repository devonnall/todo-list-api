import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Users', () => {
  const app = createApp();

  it('creates a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'a@b.com', name: 'Ada' });

    if (res.status !== 201) {
      console.error('Status:', res.status, 'Body:', res.body);
    }
    
    expect(res.status).toBe(201);
    expect(res.body.email).toBe('a@b.com');
  });
});
