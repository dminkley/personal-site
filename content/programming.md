---
author: David Minkley
date: 2020-02-28
---
<div class="a-lot-of-text">

## Programming Interests

Over the past 10 years I have worked for two bioinformatics labs ([the Viral Bioinformatics Resource Centre](https://4virology.net/) and the [Koop Lab](http://lucy.ceh.uvic.ca/cbr_main.py)) as well as for the [Bamfield Marine Sciences Centre](http://www.bamfieldmsc.com) as an interim system administrator.  During the course of this work I have built both published and in-house software, and have recently been pursuing personal projects on my own.  Some of these are described below or available on [my github](https://github.com/dminkley).

### Personal Website and Content Management System

You're using it right now!  My personal website is based on a basic content management system constructed with NodeJS and Express.js, using JavaScript.  Main pages are specified in a json configuration file, and their content is retrieved and rendered into HTML from Markdown files.  One type of page, which I've termed a 'feed', implements what is basically a rudimentary blog.  Simply by placing a new Markdown file into the appropriate feed-specific folder, a new blog post will be created the next time the site is restarted.  The site is deployed on a [Digital Ocean](https://www.digitalocean.com) droplet/VM running Ubuntu, which runs Nginx as a web server that redirects traffic to the Node app.

In the future I plan to improve the functionality of the feed/blog feature by improving its look and also adding a pagination feature for when there are many posts. 

### Custom Evaluation Report Moodle Module

When I arrived for a stint as a sysadmin at BMSC in 2016, students would complete a course evaluation at the end of each cycle using the Moodle feedback plugin.  The results from this feedback were then dumped out into an Excel file by the University Programs coordinator, who had to spend many hours cleaning the data, reformatting it, and dividing it into specific reports sent to each BMSC department.  After a consultation process I extensively modified the feedback module (using PHP and queries of the Moodle MySQL backend database), adding new tabs for each department which contained only the information specific to their work.  I further added a button to each page that formatted and output a new window that could easily be saved as a PDF which the UP coordinator would send to each department.  Ultimately, this improvement has saved the UP coordinator days if not weeks of time.

### GO Trimming
GO Trimming can be found at http://lucy.ceh.uvic.ca/go_trimming/cbr_go_trimming.py

GO Trimming is a bioinformatics program most often used to identify the most relevent biological functions in a list of genes obtained through some analysis.  Genes often have multiple Gene Ontology (GO) categories associated with them.  The GO is a hierarchical graph of molecular functions, where some functions are more specific and nested within (sometimes many) more general functions.  For example, a general category might be "Primary Metabolic Process", which might have "Carbohydrate Biosynthetic Process" as a more specific descendent node in the hierarchy.  When researchers identify a set of genes of interest through an experiment, they want to know what overall functions these genes might contribute to.  If all of the genes are in a single GO category, it is a good bet that that particular category is important in the experimental conditions being tested.

GO Trimming takes a list of genes from an experiment and their attendant GO categories, and filters the list to remove categories that are only in the list because one of their child/descendent categories is.  While these more general categories are likely to be *technically* involved in the experiment, they are usually much less interesting than the more specific categories.  For example, knowing that a 'biological process' (a very general GO category) is involved in a cancer treatment isn't useful because it's obvious.  The more specific category of 'immune system response', however, could be very intriguing.  GO Trimming uses an iterative filtering process to identify categories which are only included because their descendents are, and removes these categories from the list.  The result is a reduced list of more specific, useful functions.

The program itself is implemented in Java and features a Swing GUI to enable use by non-technical users.  After some basic data checking, the software connects to a remote MySQL database containing the GO hierarchy and retrieves information for all of the terms in the input gene list.  These terms are assembled into a graph of linked Java objects, which is then processed and pruned to create the output.

GO Trimming has been used by many researchers and has over 60 citations in peer-reviewed journals.  The original paper describing the approach can be viewed on the [BMC Research Notes journal website](https://link.springer.com/article/10.1186/1756-0500-4-267).

### Sequence Searcher

Sequence Searcher is available on the [Viral Bioinformatics Resource Centre website](https://4virology.net/virology-ca-tools/sequence-searcher/).

Sequence searcher was originally inspired by the work of [Marina Barsky](http://csci.viu.ca/~barskym/), who developed an efficient way to build suffix trees on commodity desktop hardware from very large datasets.  Suffix trees are incredibly useful data structures which enable very efficient processing of certain tasks related to pattern matching.  For instance, once a suffix tree is built from an input dataset, matches between a randomly supplied pattern and the dataset can be found in O(n) time - time proportional to the length of the query pattern.  Another useful feature is the ability to output the longest common substring from a set of strings in linear time - IE time proportional to the length of the strings themselves.  These are impressive results, and are particularly useful in the field of genetics when DNA or amino acid 'alphabets' are examined.  A long common substring between the genomes of two viruses, for example, could indicate that the viruses are closely related.

Dr. Barsky's development allows suffix trees to be built using datasets that are so large that they could not be held in memory.  Instead, they are constructed in peices and written to disk.  Once these trees are built they can be searched and processed normally.  This is where Sequence Searcher comes in - it is a program to process and identify matches in suffix trees created from DNA datasets.

Sequence Searcher itself utilizes a Java interface for ease of use, however the heavy lifting is done in the background by compiled C scripts.  It was this C code base that I helped to build.  Specifically, I implemented the C functions that allow a user to search the suffix tree for an exact pattern or a pattern that contains wildcard characters.

The paper for Sequence Searcher can be found on the [BMC Research Notes journal website](https://bmcresnotes.biomedcentral.com/articles/10.1186/1756-0500-7-466).

</div>
