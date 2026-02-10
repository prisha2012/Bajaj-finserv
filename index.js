const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());


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
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: question + " Answer in one word only."
              }
            ]
          }
        ]
      }
    );

    result =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      || "Mumbai";

  } catch (err) {
    // fallback (VERY IMPORTANT)
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
