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
  

**Prashant Panta:** "Designed the UI for user profile with editable functions and created the Navigation bar with search and to-add books components."

- **Jira Task:** Prashant – Build React Profile Components – Create ProfileForm (editable) and ProfileView (read-only for others) components. 
  ◦ [KAN-38 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-38), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-38-ProfileViewProfileForm)

- **Jira Task:** Prashant – Modify user profile where you cannot edit your user email.
  ◦ [KAN-53 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-53), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-53-cannot-edit-user-email)

  - **Jira Task:** Prashant-Design Profile Page UI – Create a profile layout with editable fields for bio and an option to upload a profile picture. 
  ◦ [KAN-36 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-36), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/src/6dea60c5db6193e538c7566d40676b02a288fd68/?at=feature%2FKAN-36-profile-ui)

- **Jira Task:** Prashant – Integrate Profile into Navigation—Create a Nav bar and add a “My Profile” link in the navbar 
  ◦ [KAN-39 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-39), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-39-integrate-profile-into-navigation-create-a-nav-bar-and-add-a-my-profile-link-in-the-navbar)

- **Jira Task:** Prashant - Updating the User Profile with better UI
  ◦ [KAN-40 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-40), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-40-updating-the-user-profile-with-better-ui)

-------


**Nirajan Banjade:** "Set a common database cluster for all to interact, implemented backend login/register/password update and wired it with frontend, and implemented credentials security policy."


- **Jira Task:** Nirajan - Implementation: signup/login/logout + password validator.
  ◦ [KAN-24 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-24), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/KAN-24-design-auth-model-roles-and-password-policy)

- **Jira Task:** Nirajan - Implementation: signup/login/logout + password validator.
  ◦ [KAN-25 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-25), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/KAN-25-implementation-signup-login-logout-password-validator)

- **Jira Task:** Nirajan - Implementation: email verification (single-use token 15 min).
  ◦ [KAN-26 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-26)[Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/KAN-26-implementation-email-verification-single-use-token-30-60-min)

- **Jira Task:** Nirajan - Implementation: password reset (no reuse of old password) and start login/register page UI.
  ◦ [KAN-27 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-27), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/KAN-27-implementation-password-reset-no-reuse-of-old-password)

- **Jira Task:** Nirajan - Wiring frontend and backend of Login/Register/Update section.
  ◦ [KAN-28 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-28), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/KAN-28-wiring-frontend-and-backend-of-login-register-update-section)

- **Jira Task:** Nirajan - Implement JWT authentication for session storage and Userprofile API.
  ◦ [KAN-52 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-52), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/KAN-52-implement-jwt-authentication-for-session-storage)


## Sprint 2 — Contributions

**Prajwal Kunwar:** “implemented the backend notification system including the model, service logic, and hooks for To-Read events, and connected it with the frontend to fetch and display notifications.”

- **Jira Task:** Prajwal – Create Notification Model and Schema  
  ◦ [KAN-67 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-67), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-67-notification-model)

- **Jira Task:** Prajwal – Implement Notification Service (Create Logic)  
  ◦ [KAN-68 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-68), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-68-notification-service)

- **Jira Task:** Prajwal – Add Notification Hooks for To-Read List  
  ◦ [KAN-69 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-69), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feat/KAN-69-notification-hook-to-read)

- **Jira Task:** Prajwal – Implement API Integration and Fetch Logic  
  ◦ [KAN-73 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-73), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/commits/branch/feat%2FKAN-73-frontend-notifications-integration)


**Aevin Tweedie:** "implemented the Collections feature end-to-end, including backend models and endpoints for status and reviews, frontend integration for submitting and displaying reviews with average ratings, and refactored the To-Read integration."

- **Jira Task:** Aevin – Add status and review support to Collections backend  
  ◦ [KAN-59 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-59), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-59-add-status-and-review-support-to)

- **Jira Task:** Aevin – Update backend model & endpoints Description  
  ◦ [KAN-61 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-61), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-61-update-backend-model-endpoints-description)

- **Jira Task:** Aevin – Integrate the Collections backend with the React frontend  
  ◦ [KAN-60 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-60), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-60-integrate-the-collections-backend-with-the-react-frontend)

- **Jira Task:** Aevin – Submit and validate reviews on the frontend  
  ◦ [KAN-62 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-62), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-62-test-merge-of-55)

- **Jira Task:** Aevin – Improve To-Read Integration & Refactor  
  ◦ [KAN-9 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-9), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-9-improve-to-read-integration-refactor)

- **Jira Task:** Aevin – Display reviews and average rating  
  ◦ [KAN-63 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-63), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-63-display-reviews-ratings)  


**Alan Garcia:** "implemented the backend logic for building user's interest profile, fetching candidate books, and scoring and ranking the candidate books. Connected the book recommendations to the frontend on the home page."

- **Jira Task:** Alan - Add API endpoints for recommending books
  ◦ [KAN-82 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-82), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-82-add-api-endpoints)

- **Jira Task:** Alan - Build User Interest Profile
  ◦ [KAN-79 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-79), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-79-build-user-interest-profile)

- **Jira Task:** Alan - Generate Candidate Books
  ◦ [KAN-80 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-80), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-80-generate-candidate-books)

- **Jira Task:** Alan - Add API endpoints for recommending books
  ◦ [KAN-81 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-81), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-81-score-and-rank)

- **Jira Task:** Alan - Add API endpoints for recommending books
  ◦ [KAN-83 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-83), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-83-add-a-recommendation-section)




**Nirajan Banjade:** “Created the frontend - backend  integration for the group functionality. Created models, api, handlers, and tests for members access, group join and posting functionality.”

- **Jira Task:** Nirajan – UX / Interaction Design — Book Detail and Group Recommendations
  ◦ [KAN-55 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-55), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-55-ux-interaction-design-book-detail-and-group-recommendations)

- **Jira Task:** Nirajan – Frontend – Group Feed Integration  
  ◦ [KAN-56 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-56), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-56-frontend-group-feed-integration)

- **Jira Task:** Nirajan – Backend API: Book Group Join/Leave & Post Routes 
  ◦ [KAN-57 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-57), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-57-backend-api-book-group-join-leave-post-routes)

- **Jira Task:** Nirajan – Mongoose Models & Slug Creation 
  ◦ [KAN-58 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-58), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-58-mongoose-models-slug-creation)


**Prashant Panta** "Implemented navbar sections for Home and Genre with routing and filtering. Created the trending books feature by building a backend endpoint that fetches from NYT Bestsellers API, added caching to reduce API calls, and built the frontend widget that displays top 5 books with loading and error handling. Fixed issues with genre book fetching from Google Books API."

**Commit Note:**
Whole File Commits for UI Tasks
For the navbar tasks (Home, Genre sections), I committed complete files rather than breaking them into many small commits because:

Repetitive patterns: The navbar tasks followed the same structure - add link → set up route → create page component. Breaking each into separate commits would just create many similar-looking commits.
For example, the genre section required defining 12 different genres with the same properties (id, name, subject, description, icon, color). This is basically configuration/data entry work - splitting it into multiple commits like "add Fiction genre," "add Fantasy genre," "add Mystery genre" wouldn't add value and would just clutter the commit history.

 I tried to keep commits practical rather than breaking up repetitive tasks into many tiny commits that don't work independently.

 - **Jira Task:** Prashant – Add “Home” Section to Navbar 
  ◦ [KAN-75 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-75), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-75-add-%E2%80%9Chome%E2%80%9D-section-to-navbar)

 - **Jira Task:** Prashant – Add “Genre” Section to Navbar 
  ◦ [KAN-76 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-76), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-76-add-%E2%80%9Cgenre%E2%80%9D-section-to-navbar)

- **Jira Task:** Prashant – Add “Trending” Section to Homepage
  ◦ [KAN-77 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-77), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-77-add-%E2%80%9Ctrending%E2%80%9D-section-to-homepage)

- **Jira Task:** Prashant – Fix the fetching error in genre section
  ◦ [KAN-84 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-84), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/bugfix/KAN-84-fix-the-fetching-error-in-genre-s)

## Sprint 3 — Contributions

**Prajwal Kunwar:** "Implemented age verification during registration, mature content warnings for minors accessing adult-rated books, comprehensive unit testing with automated reporting, and extended the notification system to include profile update notifications."

- **Jira Task:** Prajwal – Implement age verification during user registration  
  ◦ [KAN-90 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-90), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feat/KAN-90-age-verification-modal)

- **Jira Task:** Prajwal – Add mature content warning popup for minors  
  ◦ [KAN-91 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-91), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feat/KAN-91-mature-content-warning-popup)

- **Jira Task:** Prajwal – Extend notification system for profile updates  
  ◦ [KAN-92 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-92), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-92-extend-notification-system)

- **Jira Task:** Prajwal – Create comprehensive testing plan with unit tests  
  ◦ [KAN-93 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-93), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-93-testing-plan)

- **Jira Task:** Prajwal – Implement unit tests with Mocha and Mochawesome reporting  
  ◦ [KAN-94 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-94), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-94-test-execution)

  **Alan Garcia:** "Improved upon the recommendation feature by making it dynamic and including a users "currently-reading" and "finished" book collection to be considered for recommending books. Added route protection to improve user experience and safety measures."

  - **Jira Task:** Alan - Make recommendations to be dynamic
    ◦ [KAN-109 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-109), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-109-make-recommendations-dynamic)

  - **Jira Task:** Alan - Apply middleware to routes that require authentication
    ◦ [KAN-109 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-107), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-107-apply-middleware-to-routes-for-authentication)

  - **Jira Task:** Alan - Create ProtectedRoute Component that redirects to home page or login
    ◦ [KAN-109 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-111), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-111-create-protectedroute-component)

  - **Jira Task:** Alan - Include Currently Reading collection for User Interest Profile
    ◦ [KAN-109 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-110), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-110-include-currently-reading-collection-to-UIP)

  - **Jira Task:** Alan - Include Finished collections for User Interest Profile
    ◦ [KAN-109 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-108), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/feature/KAN-108-include-finished-collections-to-UIP)

  - **Jira Task:** Alan - Unit testing of book recommendations
    ◦ [KAN-109 (Jira)](https://cs3398-hutts-fall.atlassian.net/jira/software/projects/KAN/boards/1?selectedIssue=KAN-113), [Bitbucket](https://bitbucket.org/cs3398-hutts-f25/swe_project/branch/KAN-113-unit-testing-of-book-recommendations)


### Next Sprint(3) Goals
- **Nirajan**
  - **Route protection:"** Protect the routes and ensure UX order.(first landing page, then login page, then other features.)
  - **Book-based groups & discussions:** Will work on reply-to-post, like to post features.
  - **AI-integration search:** Look for ways to integrate AI (chatbot) into app.
- **Prajwal**
  - **Updating Notification System:** Will try to get notifications for possibly any changes that are made in the site.
  - **Make website dynamic:** Some of the code is still hardcoded, so will make the site dymanic.
  - **Improvement in UI:** The UI for our project can be made more appealing.

- **Aevin**
  - **Refactor user-related features:** Clean up Collections, Profile, and To-Read codebases - optimize backend endpoints, improve frontend component structure, and add better error handling and documentation.

  - **Enhance review display and validation:** Improve review submission feedback, add edit/delete functionality for user reviews, and refine the average rating calculation display.
  
  - **Integrate Collections with auth and recommendations:** Fix JWT/session issues with Nirajan's route protection and connect Collections data to Alan's recommendation system.

- **Alan**  
  - **Improve on Book Recommendations** Modify or extend the recommendation feature so that it also includes as input books from the user's currently reading and finished collections.
  - **Add recommended books** Include a button functionality to the recommended book cards so they can be added to the user's To-Read collection
  - **Add a recommended books page** Include a page on the website where more recommended books can be listed instead of just the 9 shown on the home page.
  - **Make recommendations dynamic** Some fo the code for books recommendation are hard coded for userID. Will make the feature dynamic.

- **Prashant**
  - **Section UI Formatting** I will implement the proper flex UI design in the books you might love section, right now it goes long down to the bottom.

  - **Add a different pop up section for trending page** Right now we can only see 5 trending books on trending now, create another pop up which will let us see more books 

  - **Friend's Interaction on Home Page** Right now the home page doesnt have friend's interaction, so try to add what your friends are doing (Athough everyone must make some contributions to make this task happen)
  
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
