const express = require("express");
const app = express()

app.set('view engine', 'ejs')

app.get("/", (req, res)=>{
    res.send("<h1>huhu, this is homepage</h1>")
})

app.get("/about", (req, res)=>{
    const name = "Kaushal"
    res.render("about.ejs", {name})
})

app.get("/contact", (req, res)=>{
    const data = "ACES Workshop"
    res.render("contact.ejs", {data})
}
)

app.listen(3000, ()=>{
    console.log("Nodejs project has started at port " + 3000)
})