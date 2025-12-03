import request from 'supertest';
import app from '../index.js';

describe('Health Check', () => {
    test('GET /health returns OK', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
    });
});
