import "./setup.js";
import app from "./App.js";

const port = process.env.PORT || 4000;

app.listen(port, () => console.info(`✔ Server running on port ${port}`));