const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");
const PORT = 8000;

connectToMongo();
const app = express();

app.use(cors());
app.use(express.json());

// route for auth and posts
app.use("/api/auth", require("./routes/auth"));
app.use("/api/blogPost", require("./routes/blogPost"));
app.use("/api/activity", require("./routes/activity"));


app.listen(PORT, (req, res) => {
  console.log(`server running on http://localhost:${PORT}`);
});
