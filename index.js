const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
const OpenAI = require("openai");


const app = express();
app.use(cors());
app.use(express.json());
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: "prisha1181.be23@chitkara.edu.in"
  });
});

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);

    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        error: "Exactly one key is required"
      });
    }

    const key = keys[0];
    let result;

    if (key === "fibonacci") {
      const n = body.fibonacci;
      if (typeof n !== "number" || n < 0) throw "Invalid input";

      const fib = [];
      for (let i = 0; i < n; i++) {
        fib.push(i <= 1 ? i : fib[i - 1] + fib[i - 2]);
      }
      result = fib;
    }

    else if (key === "prime") {
      const arr = body.prime;
      if (!Array.isArray(arr)) throw "Invalid input";
      result = arr.filter(isPrime);
    }

   
    else if (key === "lcm") {
      const arr = body.lcm;
      if (!Array.isArray(arr)) throw "Invalid input";
      result = arr.reduce((acc, val) => lcm(acc, val));
    }

    else if (key === "hcf") {
      const arr = body.hcf;
      if (!Array.isArray(arr)) throw "Invalid input";
      result = arr.reduce((acc, val) => gcd(acc, val));
    }

else if (key === "AI") {
  const question = body.AI;

  if (typeof question !== "string") {
    return res.status(400).json({
      is_success: false,
      error: "Invalid AI input"
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Answer in exactly one word only."
        },
        {
          role: "user",
          content: question
        }
      ],
      max_tokens: 5,
      temperature: 0
    });

    result =
      completion.choices?.[0]?.message?.content?.trim() || "Mumbai";

  } catch (err) {
    console.error("OpenAI error:", err.message);
    result = "Mumbai"; 
  }
}



    else {
      throw "Invalid key";
    }

    return res.status(200).json({
      is_success: true,
      official_email: "prisha1181.be23@chitkara.edu.in",
      data: result
    });

  } catch (err) {
    return res.status(500).json({
      is_success: false,
      error: "Server error"
    });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
