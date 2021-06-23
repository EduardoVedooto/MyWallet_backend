import express from "express";
import cors from "cors";
import connection from "./database/Database.js";
import financesSchema from "./schema/finances.schema.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/finances", async (req, res) => {
    const finances = await connection.query("SELECT * FROM finances");
    return res.status(200).send(finances.rows);
});

app.post("/finances", async (req, res) => {
    const validation = financesSchema(req.body);
    if (validation.error) return res.status(400).send(validation.error.details[0].message);
    console.log(req.body, req.query);

    const value = req.body.value;
    const description = req.body.description.split(" ").filter(w => w).join(" ");
    const type = req.query.type;

    if (type !== "income" && type !== "outgo") return res.status(400).send("Type incorrect.");

    await connection.query(`
        INSERT INTO finances
        (description, value, type, date)
        VALUES ($1,$2,$3,NOW())
    `, [description, value * 100, type]);
    res.sendStatus(201);

});

app.listen(4000, () => console.info("Server running on port 4000..."));