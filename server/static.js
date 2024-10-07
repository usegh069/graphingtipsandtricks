const express = require("express");
const app = express();
const path = require("path")
app.use(express.static(path.resolve(__dirname, "../")));

app.listen(3000, ()=>{
    console.log("ON")
})