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
- **Logo/Image:** _Placeholder_  

---

## Technologies Used  
- **Backend:** [Flask](https://flask.palletsprojects.com/) or [FastAPI](https://fastapi.tiangolo.com/)  
- **Frontend:** [React](https://react.dev/) or [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)/[CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)/[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)  
- **Database:** [MongoDB](https://www.mongodb.com/)  
- **External API:** [Google Books API](https://developers.google.com/books)  
- **Version Control & Tools:** [Bitbucket](https://bitbucket.org/), [Jira](https://www.atlassian.com/software/jira), [Git](https://git-scm.com/)  

---

## Features  

Current sprint features:  

- **Basic Book Search**  
  - **Description:** Search for books using the Google Books API by title, author, or keyword.  
  - **Who uses it:** End users who want to discover books.  
  - **User Stories:**  
    - As a user, I want to search for a book by title so that I can find specific books I’m interested in.  
    - As a user, I want to search for books by author so that I can see all works by a particular author.  
    - As a user, I want to search for book by keywords so that I can discover books on subjects that I am interested in.

- **To-Read List**  
  - **Description:** Save books to a personal “to-read” list to keep track of books to read later.  
  - **Who uses it:** End users keeping track of reading goals.  
  - **User Stories:**  
    - As a user, I want to add a book to my to-read list so that I can remember to read it later.  
    - As a user, I want to view my to-read list so that I can see all the books I plan to read.  

- **Community Discussion Spaces (Prototype)**  
  - **Description:** Each book has a placeholder page where users can discuss it.  
  - **Who uses it:** End users who want to engage with other readers.  
  - **User Stories:**  
    - As a user, I want to view a discussion space for a book so that I can see what others are saying about it.  
    - As a user, I want to post comments in a discussion space so that I can share my thoughts and opinions on a book.  

---

## Setup  
**Dependencies:** Listed in `requirements.txt` (to be added).  
**Database:** MongoDB (local or Atlas).  

Clone and install:  
```bash
git clone <repo-url>
cd bookhive
pip install -r requirements.txt
## **Usage**

Run the app (Flask example):

`flask run`

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
