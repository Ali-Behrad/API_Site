const express = require("express")
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const cookieParser = require("cookie-parser");
const multer = require("multer");
const crypto = require('crypto');
const fs = require('fs');

const redis = require("./db");
const path = require("path");

const fse = require("fs-extra");
const { log } = require("console");

require("dotenv").config();

const app = express()
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.json())

app.options('*', cors()); // Preflight response for all routes


const generate_cookie = () => {
    const randomBytes = crypto.randomBytes(32);
    
    // Combine with timestamp for uniqueness
    const timestamp = Date.now().toString();

    // Generate a token by hashing
    const token = crypto.createHash('sha256')
        .update(randomBytes + timestamp)
        .digest('hex');
    
    return token;
}

app.get("/", async (req, res) => {
    const newCookie = generate_cookie();
    const input_path = `/home/t1kto0rx/Tech/Stellens/NextJS_API/Users_Images/uploads/${newCookie}`
    const output_path = `/home/t1kto0rx/Tech/Stellens/NextJS_API/Users_Images/outputs/${newCookie}`
    
    fs.mkdirSync(input_path);
    fs.mkdirSync(output_path);

    try {
        await redis.hmset(`user:${newCookie}`, {
            input_path,
            output_path
        });

        console.log("Successfully Added user to Redis");
    } catch (error) {
        console.error("Database error: " , error);
        return res.status(500).json({"Message" : error.message});
    }

    try{
        console.log('New cookie generated:', newCookie);
        return res.json({ "cookie" : newCookie });
    } catch (error) {
        console.error(error.message);
        return res.status(300).json({"message": error.message});
    }
});

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const handle_upload = multer({storage: storage})

app.post("/upload",handle_upload.single("image"),async (req , res) => {
    try{
        const cookie = req.body.cookie;
        let filename = "";
        let color_str = "";

        if (!cookie) {
            return res.status(403).json({ error: "Cookie Required!"});
        }

        try {
            const userData = await redis.hgetall(`user:${cookie}`);

            if (Object.keys(userData).length == 0) {
                return res.status(403).json({ error: 'Invalid cookie' });
            }

            const input_path = userData.input_path;
            filename = req.file.originalname;
            color_str = req.body.color;

            try {
                await fse.move(`uploads/${filename}`, `${input_path}/${filename}`);
                console,log("File Moved Successfully!")
            } catch (error) {
                console.log("File move error, " , error.message);
            }

        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const formData = new FormData();

        formData.append("cookie", cookie);
        formData.append("color", color_str);
        formData.append("imageName", filename);

        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
                headers: {
                    'Content-Type': "multipart/form-data",
                },
                withCredentials: true
            });

            if (response.data["success"]) {
                return res.status(200).json({"success" : true});
            }
            console.error(response.data["error"])
            return res.status(500).json({"message": response.data["error"]})
        } catch (error) {
            console.log("Error communication with Flask microservice: " , error);
            return res.status(500).json({ error : "Error communication with Flask microservice" });
        }
    } catch (error) {
        console.log(`Internal Server Error: ${error}`);
        return res.status(500).json({ error : "Failed to process the message" })
    }
});

app.get("/output", async (req, res) => {
    const cookie = req.query.cookie;

    try{
        const userData = await redis.hgetall(`user:${cookie}`);

        if (Object.keys(userData).length == 0) {
            console.log("Invalid Cookie f");
            return res.status(403).json({"error" : "Invalid Cookie!!"});
        }

        const outPath = userData.output_path;
        const outName = userData.output_name;

        if (!outName) {
            console.log("User didnot upload anything!");
            return res.status(400).json({"error": "No Photo uploaded. Please upload a photo first"});
        }

        if (!fs.existsSync(path.join(outPath, outName))) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const fileStream = fs.createReadStream(path.join(outPath, outName));

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `inline; filename="${outName}"`);

        fileStream.pipe(res);
    } catch(err) {
        console.log("Error: ", err);
        return res.status(500).json({"error": "An error occured!"});
    }
})

app.listen(port, () => {
    console.log(`Express server is running on http://localhost:${port}`);
})