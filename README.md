## Introduction
This is the simple content management system (CMS) and setup used to run my personal website at http://www.davidminkley.com.  It is based on a Node backend which uses Express.js to generate and serve pages created from Pug templates with Markdown files for most content.  The website presentation is dynamic and displays differently with different browser window sizes (ie desktop vs. mobile).  The site itself is run on a Digital Ocean Ubuntu droplet running NGINX, with PM2 managing the Node application itself.

## CMS Design
All of the heavy lifting of the app is done by index.js.  When initially run, the app reads in a JSON-structured configuration file (./config/site_config) which contains information about the pages that will be available from the main navigation menu.  Pages linked from the main menu can be of type "info" or "feed", both of which rely on Pug templates for structure and Markdown files for specific content.  Info-type pages are straightforward, presenting as a page containing the rendered content of a Markdown file.  Feed-type pages process each Markdown file inside a directory specific to that feed, and display the contents as a list of posts much like a blog.  Clicking on a post in this list takes the user to a page of type "feed_post", containing the content of a single feed Markdown file.  A final type of entity specified in the configuration file are "resource links", which render as a main menu link to some specific file (for example a PDF of my CV).

While processing the site config file, an Express route is created for each future page and resource link, as well as one to serve static assets such as images.  Express is used to render the Pug views/templates for each particular page, and the entire site is generated and held in memory after startup; at this time there is no dynamic changing of content after initialization.

Markdown files are rendered into HTML using the markdown-it parser.

## Directory structure
The CMS expects the following directory structure:
```
.
├── config
│   └── site_config.json
├── content
│   └── <Markdown content for "info" pages>
├── feeds
│   └── <a feed's directory>
│       └── <Markdown content for each of this feed's posts>
├── index.js
├── node_modules
├── public
│   └── <Public resources, such as images>
├── resources
│   └── <Files served by resource links>
├── views
    └── <Pug template files>
```

## Technologies used

Node/JavaScript libraries:
- [express](https://expressjs.com/) - Node.js server framework
- [Pug](https://pugjs.org/) - An HTML templating engine
- [markdown-it](https://github.com/markdown-it/markdown-it) - A Markdown to HTML parser
- [front-matter](https://www.npmjs.com/package/front-matter) - Extracts YAML-formatted metadata from the beginning of Markdown documents
- [moment](https://momentjs.com/) - Time and dates for JavaScript

Server-side technologies:
- [NGINX](https://www.nginx.com/) - Web server
- [PM2](https://pm2.keymetrics.io/) - A process manager for Node apps

## Contact

Contact me by email at david.r.minkley@gmail.com
