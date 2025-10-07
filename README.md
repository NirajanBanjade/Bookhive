# BookHive  
> BookHive is an AI-powered social platform for book lovers. It helps users discover new books based on their reading preferences, find like-minded readers, and engage in community-driven discussions. Think of it as Goodreads meets Reddit, with a dash of AI magic.  
> Live demo [_coming soon_](#). <!-- Replace # with your hosted link when available -->

## Table of Contents  
* [General Information](#general-information)  
* [Technologies Used](#technologies-used)  
* [Features](#features)  
* [Setup](#setup)  
* [Usage](#usage)  
* [Project Status](#project-status)  
* [Room for Improvement](#room-for-improvement)  
* [Acknowledgements](#acknowledgements)  
* [Contact](#contact)  

---

## General Information  
- **Version:** 0.1 (First sprint prototype)  
- **Purpose:** BookHive combines book discovery with community-driven discussions, helping readers find their next favorite story while building meaningful connections.  
- **Team Members:** Nirajan Banjade, Alan Garcia, Aevin Tweedie, Prashant Panta, Prajwal Kunwar  
- **Logo/Image:**   ![alt text](<book demo.gif>)

---

## Technologies Used
- **Backend:** [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)  
- **Frontend:** [React](https://react.dev/) or [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)/[CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)/[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)  
- **Database:** [MongoDB](https://www.mongodb.com/)  
- **External API:** [Google Books API](https://developers.google.com/books)  
- **Version Control & Tools:** [Bitbucket](https://bitbucket.org/), [Jira](https://www.atlassian.com/software/jira), [Git](https://git-scm.com/)

---

## Features  

## Sprint 1 — Contributions

**Prajwal Kunwar:** “implemented the backend keyword search API with pagination, integrated it with the frontend React search page, and wrote unit tests for validation and error handling.”

- **Jira Task:** Prajwal – design and document the keyword search API endpoint with pagination rules  
  ◦ [KAN-31 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-31), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/feature%2FKAN-31-search-api-design)  
    
- **Jira Task:** Prajwal – implement the Node.js backend route to fetch and normalize data from Google Books API  
  ◦ [KAN-32 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-32), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/feature%2FKAN-32-google-books-route)  
    
- **Jira Task:** Prajwal – build the React search page to display results, errors, and loading states  
  ◦ [KAN-34 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-34), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/feature%2FKAN-34-frontend-search-page)  
   
- **Jira Task:** Prajwal – create unit tests to validate search results, empty states, and error handling  
  ◦ [KAN-33 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-33), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/feature%2FKAN-33-frontend-test)  

- **Jira Task:** Prajwal – implement “Load More” functionality in the frontend to handle additional results  
  ◦ [KAN-35 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-35), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/feature%2FKAN-35-load-more)  
   
---

### Next Sprint Goals
- 
- 
- 
- 
---
## Setup
Dependencies: Listed in `package.json`.

Database: [MongoDB](https://www.mongodb.com/) (local or Atlas).

Clone and install:
```bash
git clone <repo-url>
cd bookhive
npm install

## Usage

Run the app:

**For development (with live reload):**
```bash
npm run dev

---

## **Project Status**

Project is: *In Progress (Sprint 1\)*

---

## **Room for Improvement**

Areas for improvement:

* Expanded AI-generated recommendations

* Full-featured rating/review system

* Smarter community curation tools

Future To-Dos:

* Implement AI-based character/setting visualizations

* Add topic-based book clubs

* Add book ratings & reviews

---

## **Acknowledgements**

* Inspired by Goodreads, Reddit, and modern AI tools.

* Thanks to Mozilla’s Open Leadership Training resources for guiding our project vision.

* Special thanks to **Dr. Lehr** for being a motivating professor and encouraging us to grow through this project.

---

## **Contact**

Created by:

* Nirajan Banjade — lra84@txstate.edu

* Alan Garcia — iwt5@txstate.edu

* Aevin Tweedie — lav115@txstate.edu

* Prashant Panta — uyw13@txstate.edu

* Prajwal Kunwar — kzw17@txstate.edu
