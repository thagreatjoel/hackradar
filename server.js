const express = require("express");
const axios = require("axios");
const qs = require("querystring");
const jwt = require("jsonwebtoken");

const app = express();

const CLIENT_ID = "d8b24b29963240f7a26ef417ffc4ad4c";
const CLIENT_SECRET = "61c6145bb154ba12bbac953c256ba4d690fdc9cf3a12f2136ab2766407aa14c2";
const REDIRECT_URI = "http://localhost:3000/auth";

app.get("/", (req,res)=>{
  res.sendFile(__dirname + "/index.html");
});

app.get("/auth", async (req,res)=>{

  const code = req.query.code;

  if(!code){
    return res.send("No code received");
  }

  try{

    const tokenRes = await axios.post(
      "https://auth.hackclub.com/oauth/token",
      qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code"
      }),
      { headers:{ "Content-Type":"application/x-www-form-urlencoded"} }
    );

    const id_token = tokenRes.data.id_token;

    const user = jwt.decode(id_token);

    console.log("USER:", user);

    res.send(`
      <h1>Welcome ${user.name}</h1>
      <p>Email: ${user.email}</p>
      <img src="${user.picture}" width="120"/>
    `);

  }catch(err){
    console.log(err.response?.data || err.message);
    res.send("Auth failed");
  }

});
const access_token = tokenRes.data.access_token;

const userRes = await axios.get(
  "https://auth.hackclub.com/oauth/userinfo",
  {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  }
);

console.log("USER:", userRes.data);

res.send(userRes.data);
app.listen(3000,()=>{
  console.log("Server running at http://localhost:3000");
});
