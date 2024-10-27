const express = require("express");
const app = express();
const path = require("path")
app.use(express.static(path.resolve(__dirname, "../static")));

app.listen(8080, ()=>{
    console.log("ON")
})