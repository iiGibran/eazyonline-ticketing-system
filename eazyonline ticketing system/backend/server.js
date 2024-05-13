require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const app = express();
const port = 3001;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Eazyonline2024",
  database: "tickets_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "Gibran@eazyonline.nl",
    pass: "Eazyonline2024",
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

async function sendVerificationEmail(email, verificationCode) {
  try {
    await transporter.sendMail({
      from: "gibran@eazyonline.nl",
      to: email,
      subject: "Verification Code for Eazyonline Ticketing System",
      text: `Your verification code is: ${verificationCode}`,
    });
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

app.use(express.json());
app.use(cors());

// Endpoint to send verification code
app.post("/api/send-verification-code", (req, res) => {
  const { email } = req.body;
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  try {
    sendVerificationEmail(email, verificationCode);
    res.status(200).send("Verification code sent successfully.");
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).send("Error sending verification code.");
  }
});

// User Signup Endpoint
app.post(
  "/api/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Must be a valid email address")
      .custom((email) => email.endsWith("@eazyonline.nl"))
      .withMessage("Email must be from the domain @eazyonline.nl"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Generate a random verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Store the verification code in the database
    connection.query(
      "INSERT INTO verification_codes (email, code) VALUES (?, ?)",
      [email, verificationCode],
      async (err, results) => {
        if (err) {
          console.error("Error storing verification code:", err);
          return res.status(500).send("Error storing verification code");
        }

        // Send verification email
        try {
          await sendVerificationEmail(email, verificationCode);
          console.log("Verification email sent successfully.");
        } catch (error) {
          console.error("Error sending verification email:", error);
          return res.status(500).send("Error sending verification email");
        }
      }
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the user in the database
    connection.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).send("Error creating user");
        }
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.status(201).send({ token });
      }
    );
  }
);

app.post(
  "/api/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err || results.length === 0) {
          return res.status(401).send("Authentication failed.");
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).send("Authentication failed.");
        }
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.status(200).send({ token });
      }
    );
  }
);

// Existing Ticket Management Endpoints
app.post("/api/create-ticket", (req, res) => {
  const { firstName, lastName, email, phone, companyName, message } = req.body;
  const truncatedMessage = message.substring(0, 1000);
  const ticket = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone,
    company_name: companyName,
    message: truncatedMessage,
  };

  connection.query("INSERT INTO tickets SET ?", ticket, (err, results) => {
    if (err) {
      console.error("Error creating ticket:", err);
      res.status(500).send("Error creating ticket");
      return;
    }
    console.log("Ticket created:", results);
    res.status(200).send("Ticket created successfully");
  });
});

app.get("/api/tickets", (req, res) => {
  connection.query("SELECT * FROM tickets", (err, results) => {
    if (err) {
      console.error("Error fetching tickets:", err);
      res.status(500).send("Error fetching tickets");
      return;
    }
    res.json(results);
  });
});

app.put("/api/tickets/:ticketId", (req, res) => {
  const ticketId = req.params.ticketId;
  const {
    first_name,
    last_name,
    company_name,
    email,
    phone,
    message,
    status,
    priority,
  } = req.body;
  const ticket = {
    first_name,
    last_name,
    company_name,
    email,
    phone,
    message,
    status,
    priority,
  };
  connection.query(
    "UPDATE tickets SET ? WHERE id = ?",
    [ticket, ticketId],
    (err, results) => {
      if (err) {
        console.error("Error updating ticket:", err);
        res.status(500).send("Error updating ticket");
        return;
      }
      console.log("Ticket updated:", results);
      res.status(200).send("Ticket updated successfully");
    }
  );
});

app.delete("/api/tickets/:ticketId", (req, res) => {
  const ticketId = req.params.ticketId;

  connection.query(
    "DELETE FROM tickets WHERE id = ?",
    ticketId,
    (err, results) => {
      if (err) {
        console.error("Error deleting ticket:", err);
        res.status(500).send("Error deleting ticket");
        return;
      }
      console.log("Ticket deleted:", results);
      res.status(200).send("Ticket deleted successfully");
    }
  );
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
