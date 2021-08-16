import app from "./app.js";

app.listen(process.env.PORT, () => console.info(`Server running on port ${process.env.PORT}`));