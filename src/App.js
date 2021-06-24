import express from "express";
import cors from "cors";
import connection from "./database/Database.js";
import financesSchema from "./schema/finances.schema.js";
import usersSchema from "./schema/users.schema.js";
import userSanitization from "./sanitization/users.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/finances", async (req, res) => {
  console.log(req.headers);
  const token = req.header("authorization")?.replace("Bearer ", "");
  if (!token) return res.sendStatus(401);

  try {

    const result = await connection.query(`
      SELECT finances.*
      FROM sessions
      JOIN finances
      ON finances."userId" = sessions."userId"
      WHERE token = $1
    `, [token]);

    if (!result.rows[0]) return res.sendStatus(401);

    return res.status(200).send(result.rows);

  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }

});

app.post("/finances", async (req, res) => {
  const validation = financesSchema(req.body);
  if (validation.error) return res.status(400).send(validation.error.details[0].message);
  console.log(req.body, req.query);

  const value = req.body.value;
  const description = req.body.description.split(" ").filter(w => w).join(" ");
  const type = req.query.type;

  if (type !== "income" && type !== "outgo") return res.status(400).send("Type incorrect.");

  try {
    await connection.query(`
      INSERT INTO finances
      (description, value, type, date)
      VALUES ($1,$2,$3,NOW())
    `, [description, value * 100, type]);
    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }

});

app.post("/users", async (req, res) => {

  const validation = usersSchema(req.body);
  if (validation.error) return res.status(400).send(validation.error.details[0]);

  const user = userSanitization(req.body);
  const { name, email, password } = user;

  try {
    await connection.query(`
      INSERT INTO users
      (name, email, password)
      VALUES ($1,$2,$3);
    `, [name, email, bcrypt.hashSync(password, 10)]);
    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {

    const result = await connection.query(`
      SELECT * FROM users WHERE email = $1    
    `, [email]);

    const user = result.rows[0];

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();

      await connection.query(`
        INSERT INTO sessions ("userId", token) VALUES ($1,$2)
      `, [user.id, token]);

      return res.status(200).send(token);
    } else {
      return res.status(401).send("Email ou senha inválidos");
    }

  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

app.listen(4000, () => console.info("Server running on port 4000..."));