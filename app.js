require("dotenv").config()

const express = require("express");
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const { storage, multer } = require("./middleware/multerConfig");
const User = require("./model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("./middleware/isAuthenticated");
const cookieParser = require('cookie-parser')

const app = express();

const upload = multer({ storage: storage });

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

app.get("/", async (req, res) => {

  const blogs = await Blog.find();
  res.render("home.ejs", { blogs: blogs });
});

app.get("/about", (req, res) => {
  const name = "Kaushal";
  res.render("about.ejs", { name });
});

app.get("/contact", (req, res) => {
  const data = "ACES Workshop";
  res.render("contact.ejs", { data });
});

app.get(`/blog/:id`, async (req, res) => {
  const id = req.params.id;
  const data = await Blog.findById(id);
  res.render("./blog/blog.ejs", { data });
});
app.get(`/delete/:id`, isAuthenticated, async (req, res) => {
  const id = req.params.id;
  await Blog.findByIdAndDelete(id);
  res.redirect("/");
});

app.get("/edit/:id", isAuthenticated, async (req, res) => {
  const id = req.params.id;
  const data = await Blog.findById(id);
  res.render("./blog/edit.ejs", { data, id });
});

app.post("/edit/:id", isAuthenticated, upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const image = req.file?.filename;
  const { title, subtitle, description } = req.body;
  if (image === "") {
    const data = await Blog.findById(id);
    image = data.image;
  }
  await Blog.findByIdAndUpdate(id, {
    title: title,
    subtitle: subtitle,
    description: description,
    image: image,
  });
  res.redirect("/blog/" + id);
});

app.get("/createblog", isAuthenticated, (req, res) => {
  res.render("./blog/create.ejs");
});

app.post("/createblog", upload.single("image"), async (req, res) => {
  /*
        const title = req.body.title
        const subtitle = req.body.subtitle
        const description = req.body.description
    */
  const file = req.file;
  const { title, subtitle, description } = req.body;

  await Blog.create({
    title,
    subtitle,
    description,
    image: file.filename,
  });
  res.send(
    "Blog created succesfully.<br /><a href='/'>Go to home</a>&nbsp;<a href='/createblog'>Create another blog</a>"
  );
});

app.get("/login", (req, res) => {
  res.render("./auth/login.ejs");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.find({ email: email })
  if (user.length === 0) {
    res.send("Invalid Email")
  } else {
    // check password now
    const isMatched = bcrypt.compareSync(password, user[0].password)
    if (isMatched) {
      const token = jwt.sign({userId : user[0]._id}, process.env.SECRET, {expiresIn: '20d'})
      res.cookie("token", token)
      res.send("Login successfully")
    } else {
      res.send("Invalid Password")
    }
  }

});

app.get("/register", (req, res) => {
  res.render("./auth/register.ejs");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  await User.create({
    username,
    email,
    password: bcrypt.hashSync(password, 12),
  });
  res.redirect("/login");
});

app.use(express.static("./storage"));
app.use(express.static("./public"));

app.listen(3000, () => {
  console.log("Nodejs project has started at port " + 3000);
});
