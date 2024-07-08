const express = require("express");
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const app = express()

connectToDb()

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.set('view engine', 'ejs')

app.get("/", (req, res)=>{
    res.send("<h1>Hello Hariom</h1>")
})

app.get("/about", (req, res)=>{
    const name = "Kaushal"
    res.render("about.ejs", {name})
})

app.get("/contact", (req, res)=>{
    const data = "ACES Workshop"
    res.render("contact.ejs", {data})
})

app.get("/createblog", (req, res)=>{
    res.render("./blog/create.ejs")
})

app.post("/createblog", async (req, res)=>{
    /*
        const title = req.body.title
        const subtitle = req.body.subtitle
        const description = req.body.description
    */
    const {title, subtitle, description} = req.body
    await Blog.create({
        title,
        subtitle,
        description
    })
    res.send("Blog created succesfully")
})

app.listen(3000, ()=>{
    console.log("Nodejs project has started at port " + 3000)
})