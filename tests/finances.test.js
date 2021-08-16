import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import {
  SignUp, SignIn, validEntry,
} from './utils';

beforeEach(async () => {
  await connection.query('DELETE FROM users');
  await connection.query('DELETE FROM sessions');
});

describe('Get /finances => Get all entries', () => {
  it('should responds with status 401 when token is missing', async () => {
    const response = await supertest(app).get('/finances').set('Authorization', '');
    expect(response.status).toEqual(401);
  });

  it('should responds with status 401 when token is invalid', async () => {
    const response = await supertest(app).get('/finances').set('Authorization', 'Bearer invalidToken');
    expect(response.status).toEqual(401);
  });

  it('should responds with status 200 when token is valid', async () => {
    await SignUp();
    const user = await SignIn();
    const response = await supertest(app).get('/finances').set('Authorization', `Bearer ${user.token}`);
    expect(response.status).toEqual(200);
  });
});

describe('Post /finances/:id => Create new entry', () => {
  it('should responds with status 201 when is all valid', async () => {
    await SignUp();
    const newUser = await SignIn();
    const response = await supertest(app).post(`/finances/${newUser.user.id}`).send(validEntry).query({ type: 'income' });
    expect(response.status).toEqual(201);
  });
  it('should responds with status 400 when value is invalid or missing', async () => {
    await SignUp();
    const newUser = await SignIn();
    const response = await supertest(app).post(`/finances/${newUser.user.id}`).send({ ...validEntry, value: null }).query({ type: 'income' });
    expect(response.status).toEqual(400);
  });
  it('should responds with status 400 when description is empty', async () => {
    await SignUp();
    const newUser = await SignIn();
    const response = await supertest(app).post(`/finances/${newUser.user.id}`).send({ ...validEntry, description: ' ' }).query({ type: 'income' });
    expect(response.status).toEqual(400);
  });
  it("should responds with status 400 when type is different of 'income' or 'outgo'", async () => {
    await SignUp();
    const newUser = await SignIn();
    const response = await supertest(app).post(`/finances/${newUser.user.id}`).send(validEntry);
    expect(response.status).toEqual(400);
  });
  it('should responds with status 401 when id is invalid', async () => {
    const response = await supertest(app).post('/finances/1').send(validEntry).query({ type: 'income' });
    expect(response.status).toEqual(401);
  });
});

afterAll(() => {
  connection.end();
});
