const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require('form-data');

const app = express()

app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage : multer.memoryStorage()})

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const color_rgb = req.query.color;
        const file = req.file;

        if(!color_rgb) {
            console.log("missing color")
            return res.status(400).json({ error: 'Missing color parameter' });
        }

        else if (!file) {
            console.log("missing file");
            return res.status(400).json({ error: 'Missing file parameter' });
        }
        

        console.log(file.buffer);

        console.log('Received file:', file);
        console.log('Received color:', color_rgb);
        
        // res.setHeader('Content-Type', file.mimetype);
        // res.send(file.buffer);

        try {
            const formData = new FormData();
            formData.append("file", file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype
            });

            formData.append("color", color_rgb)

            const response = await axios.post('http://127.0.0.1:5000/process', formData, {
                headers: formData.getHeaders(),
                responseType: 'arraybuffer', 
            });

            res.setHeader('Content-Type', 'image/png');
            res.send(response.data);
        } catch (error) {
            console.error('Error processing image:', error);
            return res.status(500).json({ error: 'Image processing failed' });
        }

    } catch (e) {
        console.log(e)
        return res.status(500).json({ error : "Error to upload image-backend"})
    }
})

app.listen(4000, () => {
    console.log(`Backend server running on http://localhost:4000`);
})