import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { SignUp, validBody } from './utils';

beforeEach(async () => {
  await connection.query('DELETE FROM users');
  await connection.query('DELETE FROM sessions');
});

describe('POST /users => New user registration', () => {
  it('should responds with status 400 when name is empty', async () => {
    const body = { ...validBody, name: ' ' };
    const result = await supertest(app).post('/users').send(body);
    expect(result.status).toEqual(400);
  });

  it('should responds with status 400 when email is invalid', async () => {
    const body = { ...validBody, email: 'invalidEmail' };
    const result = await supertest(app).post('/users').send(body);
    expect(result.status).toEqual(400);
  });

  it('should returns status 400 when password and confirm password are differente', async () => {
    const body = { ...validBody, confirmPassword: 'different' };
    const result = await supertest(app).post('/users').send(body);
    expect(result.status).toEqual(400);
  });

  it('should responds with status 400 when body is empty', async () => {
    const result = await supertest(app).post('/users').send({});
    expect(result.status).toEqual(400);
  });

  it('should returns status 201 when body is valid', async () => {
    const result = await supertest(app).post('/users').send(validBody);
    expect(result.status).toEqual(201);
  });

  it('should returns status 401 when email is already registered', async () => {
    await SignUp();
    const result = await supertest(app).post('/users').send(validBody);
    expect(result.status).toEqual(401);
  });
});

describe('POST /signin => Login with user registered', () => {
  it('should responds with status 401 when email is invalid', async () => {
    await SignUp();
    const body = { ...validBody, email: 'invalidEmail@email.com' };
    const result = await supertest(app).post('/signin').send(body);
    expect(result.status).toEqual(401);
  });

  it('should responds with status 401 when password is invalid', async () => {
    await SignUp();
    const body = { ...validBody, password: 'invalid' };
    const result = await supertest(app).post('/signin').send(body);
    expect(result.status).toEqual(401);
  });

  it('should returns status 200 when is all valid', async () => {
    await SignUp();
    const result = await supertest(app).post('/signin').send(validBody);
    expect(result.status).toBe(200);
  });

  it('should respods with an object with keys token(string) and user(object)', async () => {
    await SignUp();
    const result = await supertest(app).post('/signin').send(validBody);
    expect(result.body).toEqual(expect.objectContaining({
      token: expect.any(String),
      user: expect.objectContaining({
        id: expect.any(Number),
        email: validBody.email,
        name: validBody.name,
      }),
    }));
  });
});

afterAll(() => {
  connection.end();
});
