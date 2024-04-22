//this file index.js is the most important file of the whole, it starts the server and all the files are connected to this particular file.

const express = require("express");  // this is to add express.js to your main file
const path = require("path"); // this is to set the path for views folder
const {connectToMongoDB} = require("./connection"); // this line is to import file "connection.js" to the main file
const urlRoute = require("./routes/url"); // this file is to import the file "url" from the routes folder
const staticRoute = require("./routes/staticRouter"); // this line is to link staticRouter file from routes folder
const URL = require("./models/url"); // this line is to import url file from the models folder

const app = express(); // this line is to take access of express
PORT = 8001 // PORT declaration

connectToMongoDB("mongodb://localhost:27017/short-url").then(()=>console.log("MongoDB Connected")); //this shows the database is connected to which mongodb port and also prints the message "MongoDB Connected when the connection is established"

app.set("view engine", "ejs"); //this line is to set the view engine, which we set as ejs, since we've installed ejs
app.set("views", path.resolve("./views")); //this line is to guide the view engine to our ejs file

app.use(express.json()); //this line indicates what kind of data we will request from the website, which is currently set to json
app.use(express.urlencoded({extended: false})); //this line changes the above setting from just json forms as well

app.get("/test", async(req,res)=>{
    const allUrls = await URL.find({})
    return res.render("home",{
        urls: allUrls
    });
});

app.use("/url", urlRoute);
app.use("/", staticRoute);


app.get('/url/:shortId', async(req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, { $push:{
        visitHistory: {
            timestamp: Date.now()
        },
    },
}
);
res.redirect(entry.redirectURL);
});


app.listen(PORT, ()=>console.log(`SERVER STARTED AT : ${PORT}`));