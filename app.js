const express = require("express");
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const { storage, multer } = require("./middleware/multerConfig");
const User = require("./model/userModel");
const bcrypt = require("bcrypt");

const app = express();

const upload = multer({ storage: storage });

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.get(`/delete/:id`, async (req, res) => {
  const id = req.params.id;
  await Blog.findByIdAndDelete(id);
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const data = await Blog.findById(id);
  res.render("./blog/edit.ejs", { data, id });
});

app.post("/edit/:id", upload.single("image"), async (req, res) => {
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

app.get("/createblog", (req, res) => {
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
  let flag = true;
  const users = await User.find({ email, password });
  users.length === 0 ? res.send("Login Failed") : res.send("Login Successful.");
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

app.listen(3000, () => {
  console.log("Nodejs project has started at port " + 3000);
});
