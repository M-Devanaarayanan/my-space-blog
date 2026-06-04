import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// 1. Set up EJS Templating Engine
app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`);

// 2. Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`)); // Tells Express where to find static assets (CSS/Images)

// 3. In-Memory Data Store (Our blog posts live here for now)
let posts = [
    {
        id: "1",
        title: "The Paul Graham Philosophy",
        content: "An elegant website doesn't need flashy animations. It needs solid typography, meaningful content, and a distraction-free user experience.",
        dateCreated: "June 2, 2026"
    }
];

// 4. Core Home Route
app.get("/", (req, res) => {
    // We render 'home.ejs' and pass our posts array into it as a variable named 'blogPosts'
    res.render("home.ejs", { blogPosts: posts });
});


// Route to render the "New Post" form page
app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

// Route to handle the form submission from the "New Post" page
app.post("/posts", (req, res) => {
    // 1. Capture the form data using body-parser (via req.body)
    const submittedTitle = req.body.postTitle;
    const submittedContent = req.body.postContent;

    // 2. Create a new post object with a unique ID and current date
    const newPost = {
        id: Date.now().toString(), // Generates a unique string ID based on time
        title: submittedTitle,
        content: submittedContent,
        dateCreated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    // 3. Push our new post into the temporary array
    posts.push(newPost);

    // 4. Redirect the user back to the homepage to see their new post!
    res.redirect("/");
});



app.post("/posts/:id/delete", (req, res) => {
    // Step A: Grab the ID string sent by the browser
    const idToDelete = req.params.id; // e.g., "1717416760000"

    // Step B: Use JavaScript's built-in .filter() method on our array
    posts = posts.filter(post => post.id !== idToDelete);
    
    // Step C: Send the user back to the home page
    res.redirect("/");
});




// 1. GET ROUTE: Show the edit form with the existing post data pre-loaded
app.get("/posts/:id/edit", (req, res) => {
    const idToEdit = req.params.id;

    // Find the specific post in our array that matches the dynamic ID
    const targetPost = posts.find(post => post.id === idToEdit);

    

    // Render the edit page and pass that specific post object into it
    res.render("edit.ejs", { post: targetPost });
});

// 2. POST ROUTE: Handle the form submission and update the array object
app.post("/posts/:id/update", (req, res) => {
    const idToUpdate = req.params.id;

    // Find the specific post in our array
    const targetPost = posts.find(post => post.id === idToUpdate);

    // Overwrite its old title and content with the new text from the form
    targetPost.title = req.body.postTitle;
    targetPost.content = req.body.postContent;

    // Bounce them back to the home page to see the updated post!
    res.redirect("/");
});




app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
});


