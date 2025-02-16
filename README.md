# Flashcard Learning App with the Leitner System
![image](https://github.com/user-attachments/assets/8615793b-8c9c-40dc-bf32-fcbbecf690fc)

The Flashcard Learning App is built with the MERN stack (MongoDB, Express.js, React, Node.js) and incorporates the powerful Leitner System, a spaced repetition technique designed to optimize long-term memory retention.

## 🚀 Project Overview

The app allows users to:
* Login and Register with proper authentication using jwt tokens
* Create, review, and manage flashcards.
* Progress through flashcards based on their performance.
* Follow a structured learning process with spaced repetition intervals.
* Users can post their doubts on the community which can be seen by all
* CRUD operations can be performed on the flashcards and posts

## 🏗️ Tech Stack

* Frontend: React, React Hooks, Axios, Tailwind CSS / Daisy UI
* Backend: Node.js, Express.js, MongoDB, Mongoose

## 🛠️ Setup Instructions

### 1) Clone the repository:
 ```
git clone https://github.com/ApekshaHatle/ALFREDTASK.git
```
```
cd ALFREDTASK
```
### 2) Setup .env in ALFREDTASK folder
```
MONGO_URI=...
PORT=...
JWT_SECRET=...
NODE_ENV=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```
### 3) Install dependencies
```
npm install
```
```
cd frontend
npm install
```
### 4) Run the Project
```
cd frontend
npm run dev
```
```
cd ..
npm run dev
```

### 5) Output
Go to 
```
http://localhost:3000/login
```
