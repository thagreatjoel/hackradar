require("dotenv").config()

const express = require("express")
const axios = require("axios")
const qs = require("querystring")
const path = require("path")

const app = express()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const PORT = process.env.PORT || 3000

app.use(express.static("public"))

app.get("/", (req,res)=>{
 res.sendFile(path.join(__dirname,"public/index.html"))
})

app.get("/auth", async (req,res)=>{

 const code = req.query.code

 if(!code){
  return res.send("No code received")
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
   {
    headers:{
     "Content-Type":"application/x-www-form-urlencoded"
    }
   }
  )

  const access_token = tokenRes.data.access_token

  const userRes = await axios.get(
   "https://auth.hackclub.com/oauth/userinfo",
   {
    headers:{
     Authorization:`Bearer ${access_token}`
    }
   }
  )

  console.log("USER:", userRes.data)

  res.redirect("/map.html")

 }catch(err){

  console.log(err.response?.data || err.message)
  res.send("Auth failed")

 }

})

app.listen(PORT,()=>{
 console.log(`Server running at http://localhost:${PORT}`)
})
