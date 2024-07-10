const express = require("express");
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const { storage, multer } = require("./middleware/multerConfig");

const app = express()

const upload = multer({storage:storage})

connectToDb()

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.set('view engine', 'ejs')

app.get("/", async (req, res)=>{
    const blogs = await Blog.find()
    res.render("home.ejs", {blogs:blogs})
})

app.get("/about", (req, res)=>{
    const name = "Kaushal"
    res.render("about.ejs", {name})
})

app.get("/contact", (req, res)=>{
    const data = "ACES Workshop"
    res.render("contact.ejs", {data})
})

app.get("/blog", (req, res)=>{
    res.render("./blog/blog.ejs")
})

app.get("/createblog", (req, res)=>{
    res.render("./blog/create.ejs")
})

app.post("/createblog", upload.single('image'),async (req, res)=>{
    /*
        const title = req.body.title
        const subtitle = req.body.subtitle
        const description = req.body.description
    */
    const file = req.file
    const {title, subtitle, description} = req.body

    await Blog.create({
        title,
        subtitle,
        description,
        image: file.filename
    })
    res.send("Blog created succesfully")
})

app.use(express.static("./storage"))

app.listen(3000, ()=>{
    console.log("Nodejs project has started at port " + 3000)
})