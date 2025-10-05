const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());

app.use(express.json());

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const result = {
    filename: req.file.filename,
    detections: [
      { item: "helmet", confidence: 0.95 },
      { item: "vest", confidence: 0.88 },
    ],
  };

  res.json(result);
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

const ticketsRouter = require("./routes/tickets");

app.use("/api/tickets", ticketsRouter);

app.get("/ping", (req, res) => {
  res.send("Backend is running!");
});
