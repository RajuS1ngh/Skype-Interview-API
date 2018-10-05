require("dotenv").config();
const fetch = require("node-fetch");
var Guid = require("guid");
var sha256 = require("sha256");
var jwt = require("jsonwebtoken");

var app = require("express")(),
  port = process.env.PORT || 8040,
  morgan = require("morgan"),
  bodyParser = require("body-parser");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.send("NodeJs Server is Running!!!");
});

// Skype Interview Payload
var payload ={
  // "code": "Full Stack Developer Hiring 500",
  "title": "JavaScript Developer Interview",
  "participants" : [
    { "name": "Yashwanth Pitman", "email": "yashwanth@scoratech.com", "role": "candidate" },
    { "name": "Shirley Setia", "email": "shirley@gmail.com", "role": "interviewer" }
],
"scheduling" : {
   "duration": 90,
   "mode": "manual",
   "dateproposing": "candidate" 
},
  "capabilities": {
      "codeEditor": true,
      "notes": true
  },
  "codingConfig": {
    "codeExecution": true,
    "codingLanguages": [
      "java",
      "javascript",
      "cpp"
  ],
    "defaultCodingLanguage": "javascript"
}
}

// Generate JSONWEBTOKEN FUNCTION
function generateToken(content) {
  const auth = {
    jti: Guid.raw(),
    iss: process.env.API_KEY,
    sub: sha256(content),
    exp: Math.floor(Date.now() / 1000) + 10
  };
  return jwt.sign(auth, process.env.API_SECRET);
}

// Post request to Skype Interview API

fetch("https://interviews.skype.com/api/interviews", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + generateToken(JSON.stringify(payload))
  },
  body: JSON.stringify(payload)
})
  .then(res => res.json())
  .then(jsonRes => {
    console.log('Skype Interview API Response',jsonRes);
  })
  .catch(function() {
    console.log("Promise Rejected");
  });

//Start The Server
app.listen(port, function() {
  console.log(`App is Listening on http://localhost:${port}`);
});
