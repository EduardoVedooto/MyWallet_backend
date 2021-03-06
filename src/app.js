import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from './database/database.js';
import financesSchema from './schema/finances.schema.js';
import usersSchema from './schema/users.schema.js';
import userSanitization from './sanitization/users.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/finances', async (req, res) => {
  const token = req.header('authorization')?.replace('Bearer ', '');

  if (!token || !token.trim().length) return res.sendStatus(401);

  try {
    const result = await connection.query(`
      SELECT * FROM sessions WHERE token = $1;
    `, [token]);

    if (!result.rowCount) return res.status(401).send("Token doesn't match with any valid token on database");

    const finances = await connection.query(`
      SELECT finances.*
      FROM sessions
      JOIN finances
      ON finances."userId" = sessions."userId"
      WHERE token = $1
    `, [token]);

    return res.status(200).send(finances.rows);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

app.post('/finances/:id', async (req, res) => {
  const validation = financesSchema(req.body);
  if (validation.error) return res.status(400).send(validation.error.details[0].message);

  const { value } = req.body;
  const description = req.body.description.split(' ').filter((w) => w).join(' ');
  const { type } = req.query;
  const { id } = req.params;

  if (type !== 'income' && type !== 'outgo') return res.status(400).send('Invalid type');

  try {
    const user = await connection.query('SELECT id FROM users WHERE id = $1', [id]);
    if (!user.rowCount) return res.status(401).send("ID doesn't match with any valid user ID");

    await connection.query(`
      INSERT INTO finances
      (description, value, type, "userId", date)
      VALUES ($1,$2,$3,$4,NOW())
    `, [description, value * 100, type, id]);
    return res.sendStatus(201);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

app.post('/users', async (req, res) => {
  const validation = usersSchema(req.body);
  if (validation.error) return res.status(400).send(validation.error.details[0]);

  const user = userSanitization(req.body);
  const { name, email, password } = user;

  try {
    const result = await connection.query(`
      SELECT * FROM users WHERE email = $1;
    `, [email]);

    if (result.rowCount) return res.status(401).send('E-mail already registered');

    await connection.query(`
      INSERT INTO users
      (name, email, password)
      VALUES ($1,$2,$3);
    `, [name, email, bcrypt.hashSync(password, 10)]);
    return res.sendStatus(201);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await connection.query(`
      SELECT * FROM users WHERE email = $1    
    `, [email]);

    const user = result.rows[0];

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      delete user.password;
      await connection.query(`
        INSERT INTO sessions ("userId", token) VALUES ($1,$2)
      `, [user.id, token]);

      return res.status(200).send({ user, token });
    }
    return res.status(401).send('Email ou senha inv??lidos');
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

app.delete('/logout/:id', async (req, res) => {
  const id = req.params?.id;
  if (!id || Number.isNaN(id)) return res.sendStatus(400);
  await connection.query('DELETE FROM sessions WHERE "userId" = $1', [id]);
  return res.sendStatus(200);
});

export default app;
