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
   

**Alan Garcia:** "implemented the backend title and author search API with in-memory cache (alongside Prajwal's pagination) integrated it with the frontend React search page, and wrote error handling."

- **Jira Task:** Alan - Implement backend API endpoint to fetch books on search tab (by title).  
  ◦ [KAN-21 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-21), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/feature%2FKAN-21-define-book-schema-in-mongodb-tit)

- **Jira Task:** Alan - Connect the frontend to the backend search endpoint.  
  ◦ [KAN-20 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-20), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/feature%2FKAN-20-connect-the-frontend-to-the-backe)

- **Jira Task:** Alan - Extend book controller to accept author query.  
  ◦ [KAN-47 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-47), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/feature%2FKAN-47-extend-book-controller-to-search-by-author)

- **Jira Task:** Alan - Add Caching for Search Results.  
  ◦ [KAN-23 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-23), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/feature%2FKAN-23-add-caching-for-search-results)

- **Jira Task:** Alan - Comment backend code for description and clarification.  
  ◦ [KAN-48 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-48), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/feature%2FKAN-48-comment-on-backend-code-for-clarification)
  
  
**Aevin Tweedie:** “Provided users a 'To Read' list to track books and add them directly from search results, connected it to the backend API, and implemented confirmation notifications for list actions.”

- **Jira Task:** Aevin – Implement backend API to fetch 'To Read' list  
  ◦ [KAN-7 (Jira)](https://cs3398-hutts-fall.atlassian.net/browse/KAN-7), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-7-implement-backend-api-fetch-to-read)

- **Jira Task:** Aevin – Implement backend API endpoint to remove a book from 'To Read' and add to collections  
  ◦ [KAN-13 (Jira)](https://cs3398-hutts-fall.atlassian.net/browse/KAN-13), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-13-implement-backend-api-endpoint-create-endpoint-to-remove-a-book-from-to-read-and-add-to-collections)

- **Jira Task:** Aevin – Display confirmation notifications for add/delete actions on To Read list  
  ◦ [KAN-15 (Jira)](https://cs3398-hutts-fall.atlassian.net/browse/KAN-15), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-15-display-confirmation-notifications-for-add-delete-actions-on-to-read-list)

- **Jira Task:** Aevin – Design wireframe for To Read list page  
  ◦ [KAN-6 (Jira)](https://cs3398-hutts-fall.atlassian.net/browse/KAN-6), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-6-design-wireframe-for-to-read-list-page)

- **Jira Task:** Aevin – Connect frontend to API and add button functionality in React to update lists  
  ◦ [KAN-14 (Jira)](https://cs3398-hutts-fall.atlassian.net/browse/KAN-14), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-14-connect-frontend-to-api-add-button-functionality-in-react-to-call-the-backend-and-update-lists)

- **Jira Task:** Aevin – API endpoint tests using Postman (integration/functional tests)  
  ◦ [KAN-10 (Jira)](https://cs3398-hutts-fall.atlassian.net/browse/KAN-10) *(No Bitbucket branch — tested locally via Postman)*
  
-------


**Nirajan Banjade:** "Set a common database cluster for all to interact, implemented backend login/register/password update and wired it with frontend, and implemented credentials security policy."


- **Jira Task:** Nirajan - Implementation: signup/login/logout + password validator.
  ◦ [KAN-24 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-24), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/src/KAN-24-design-auth-model-roles-and-password-policy/)

- **Jira Task:** Nirajan - Implementation: signup/login/logout + password validator.
  ◦ [KAN-25 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-25), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/src/KAN-25-implementation-signup-login-logout-password-validator/)

- **Jira Task:** Nirajan - Implementation: email verification (single-use token 15 min).
  ◦ [KAN-26 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-26)[Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/src/KAN-26-implementation-email-verification-single-use-token-30-60-min/)

- **Jira Task:** Nirajan - Implementation: password reset (no reuse of old password) and start login/register page UI.
  ◦ [KAN-27 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-27), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/src/KAN-27-implementation-password-reset-no-reuse-of-old-password/)

- **Jira Task:** Nirajan - Wiring frontend and backend of Login/Register/Update section.
  ◦ [KAN-28 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-28), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/src/KAN-28-wiring-frontend-and-backend-of-login-register-update-section/)

- **Jira Task:** Nirajan - Implement JWT authentication for session storage and Userprofile API.
  ◦ [KAN-52 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-52), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/src/KAN-52-implement-jwt-authentication-for-session-storage/)



### Next Sprint Goals
- **Nirajan**
  - **Route protection & nav cleanup:** Public landing page for everyone; after login, unlock protected routes (Profile, To-Read, Search, Groups) with JWT checks and hide nav items for unauthenticated users.
  - **Book-based groups & discussions:** Create/join groups per book title and add discussion boards with posts and comments.
  
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
