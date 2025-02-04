const express = require("express");
const cors = require("cors");

app = express();

app.use(cors());

app.get("/data", (req, res) => {
	console.log("Ddata received!");
	return res.json({ data: "message"});
	}
)

app.listen(4000, () => {console.log("app online...");})
