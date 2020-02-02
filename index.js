// Other requires
// Note that fs and md are different approaches.  Could look more into this.
const fs = require("fs");
const path = require("path");
const md = require("markdown-it")({html:true});
const fm = require("front-matter");
const moment = require("moment");

/* Get the express object 
Note: the 'app' object is a function, which is sent to Node's HTTP servers
as a callback to handle requests. */
const express = require("express");
const app = express();

/* Specifies to express that the templating engine to be used is pug */
app.set('view engine', 'pug');
app.set("views", "./views/");

/* What this actually does is adds the anonymous callback function as a 'listener'
to the 'listening' event for the server.  So, some asynchronous behaviour happens.
First, the http.Server object is returned.  Meanwhile, the server begins setting up
the listening process.  When this is done, it triggers the 'listening' event, which
calls the anonymous function that uses console.log.  By that time, the server object
exists and can be referenced. */
const server = app.listen(3001, () => {
    console.log(`Express running -> PORT ${server.address().port}`);
});

/* Read in JSON file that will be used to populate pages */
const site_config = require("./config/site_config");

/* Get current year, to be sent to page templates */
const datetime = new Date();
const curr_year = datetime.getFullYear();

/* Set up a route for each page, based on the pages listed in the JSON file */
// Note that for fs.* calls, there is generally both a synchronous and asynchronous version.
// I'm using the synchronous versions on purpose because all of this is setting up the server
for (const page in site_config.pages) {
    const this_page = site_config.pages[page]

    // Add a route for this page based on its page_type
    switch(this_page.page_type) {
        case "info":
            // This is a basic general info page, with main content in a md file

            // Read page content and set up HTML and metadata
            const md_fn = this_page.name + ".md";
            const page_markdown = fs.readFileSync("./content/"+md_fn, "utf8");
            const markdown_content = fm(page_markdown);
            const page_meta = markdown_content.attributes;
            const page_html = md.render(markdown_content.body);

            // Add route
            app.get("/" + this_page.name, (req, res) => {
                res.render("info", {
                    page_title: this_page.nice_name,
                    page_meta: page_meta,
                    main_html: page_html,
                    pages: site_config.pages,
                    curr_year: curr_year
                });
            });
            break;

        case "feed":
            /* This is a 'feed' type page, which displays items from a particular feed which can then be
               visited individually. */
            
            /* First, read markdown posts, convert to HTML, add to posts array, and set up express route for the
               particular feed page */
            const posts = [];   // The object itself changes, but not what the var points to, so use const not let
            const feed_dir = "./feeds/" + this_page.name;
            const markdown_filenames = fs.readdirSync(feed_dir);
            for (const key in markdown_filenames) {

                /* Looping through all of the feed posts in the particular feed directory */
                
                // Extract metadata and body from this post's markdown file
                const md_fn = markdown_filenames[key];
                const post_id = md_fn.replace(/\.[^/.]+$/, "");
                const post_markdown = fs.readFileSync(feed_dir + "/" + md_fn, "utf8");
                const markdown_content = fm(post_markdown);
                const post_meta = markdown_content.attributes;
                const post_html = md.render(markdown_content.body);

                /* Frontmatter imports dates as a Date() object and, importantly, assumes UTC.  Need to use the
                   moment.utc() function instead of moment() because moment() would convert from UTC to local
                   timezone, which can affect the display date.  IE, I don't want to care about timezones in this
                   context. */
                post_meta.date_str = moment.utc(post_meta.date).format("YYYY-MM-DD");

                // Add the post to the array of all posts
                posts.push({
                    post_id: post_id,
                    html: post_html,
                    metadata: post_meta
                });
                
                /* Add route for this particular feed post. The route URL takes the form "/<feed_name>/<post_name>" */
                app.get(path.join("/", this_page.name, post_id), (req, res) => {
                    res.render("feed_post", {
                        post_id: post_id,
                        feed_name: this_page.name,
                        metadata: post_meta,
                        post_html: post_html,
                        pages: site_config.pages,
                        curr_year: curr_year
                    });
                });
            }

            /* Sort the array of all posts by date, in order from oldest to newest */
            posts.sort(function(post1, post2) {
                // If the result of this compare function is negative, post2 is sorted before post1
                return post2.metadata.date - post1.metadata.date;
            });

            // Finally, add route for the feed page itself
            app.get("/"+this_page.name, (req, res) => {
                res.render("feed", {
                    page_id: this_page.name,
                    page_title: this_page.nice_name,
                    pages: site_config.pages,
                    posts: posts,
                    curr_year: curr_year
                });
            });

            break;

        case "resource_link":
            /* This is a 'resource_link' type page - a simple link to a static file. */
            app.get("/"+this_page.name, (req, res) => {
                res.sendFile(__dirname+"/resources/"+this_page.target_url);
            });
            break;
    }

    /* One page in the JSON file will be the landing page; this is the default page used if a path otherwise doesn't
       exist */
    if (this_page.landing_page) {
        landing_page_url = "/"+this_page.name;
    }
}

app.use(express.static("public"));


/* Set up the route for the landing page */
app.get("*", (req, res) => {
    res.redirect(landing_page_url);
});

