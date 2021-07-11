# Turning Heads API
Back-end repo for "Turning Heads".<br>
"Turning Heads" is a simple MERN Stack blog application where many people can share articles with each other.

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#app-functionality">App Functionality</a></li>
        <li><a href="#testing-fearures">Testing Fearures</a></li>
        <li><a href="#app-technologies">App Technologies</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a>
    <ul>
        <li><a href="#deployment">Deployment</a></li>
        <li><a href="#api-endpoints">API endpoints</a></li>
      </ul>
    </li>
    <li><a href="#front-end">Front-End </a></li>
  </ol>
</details>

## About The Project

## App Functionality
Turning Heads provides many functionalities to the app guest and registered user:

 <ul>
  <li>A guest can:
    <ol>
      <li>Reqister </li>
      <li>View all the articles with details </li>
      <li>Contact with the admin</li>
    </ol>
    </li>
 </ul>
  
   <ul>
  <li>Registered user can: 
    <ol>
      <li>Login</li>
      <li> View all the articles with details </li>
      <li> View his own articles </li>
      <li> View anyone's article in detail </li>
      <li> Modify or delete his articles </li>
      <li> Add comment on anyone's article </li>
      <li> Modify his comment </li>
      <li> Delete comments from his articles </li>
      <li> Reset his account passwotd </li>
      <li> Follow another user </li>
      <li> Unfollow followed user </li>
      <li> Check followers and following </li>
    </ol>
    </li>
</ul>

## Testing Fearures
 <ul>
  <li>Unit test:
    <ol>
      Generation of jwt auth token test
    </ol>
    </li>
 </ul>
 
  <ul>
  <li>Integration tests:
    <ol>
      <li>Getting all the blogs test </li>
      <li>Getting unexisting blog test </li>
      <li>Posting from unassigned user test</li>
      <li>Unvalid article value test</li>
      <li>Posting is done when article is valid test</li>
    </ol>
    </li>
 </ul>

 
## App Technologies
<ul>
<li> Backend development Using (ExpressJs - NodeJS)</li>
<li> No SQL Database using mongodb</li>
<li> Front End development using React Redux</li>
</ul>

## Getting Started

## Prerequisites
Before you start, make sure you have <a href="https://nodejs.org/en/download/">NodeJS</a> installed.

## Installation
1. Clone the repo
   ```sh
   git clone https://github.com/SomaiaElbaradey/Turning-Heads-API
   ```
2. Use the Node package manager <a href="https://www.npmjs.com/">npm</a> to install the required packages
   ```sh
   npm install
   ```
3. To get the development server running, type the following in your Command Prompt
   ```JS
   node index.js
   ```
   
## Running tests
- To get the app tests running, type the following in your Command Prompt
   ```JS
   npm test
   ```
     

## Usage

## Deployment
The API deployed at Heroku:<a href="https://turning-heads.herokuapp.com/"> Turning Heads API </a>

## API endpoints

1. User Features
    - Registration: POST /api/user/register
       ```JS
       Body:
       {
              "mail": "example@example.com",
              "password": "Password",
              "username": "username",
              "firstName": "first name",
              "lastName": "last name"
       } 
       ```
       
     - Login: POST /api/user/login
       ```JS
       Body:
       {
              "mail": "example@example.com",
              "password": "Password",
       } 
       ```
    - Reset Password: POST /api/user/resetPassword
       ```JS
       Body:
        {
        "mail": "example@example.com",
        "newPassword": "newPassword"
        }
       ```
       
    - Unfollow user: PATCH /api/user/unfollow/:id
    - Follow user: POST /api/user/newFollow/:id
    - Know if you follow specific user: GET /api/user/isFollowed/:id
    - Followers for specific user: GET /api/user/followers/:id
    - Followings for specific user: GET /api/user/following/:id

       
 2. Articles Features
    - Get all articles: GET /api/blog
    - Get all articles for one user: GET /api/blog/:id
    - Get one specific article: GET /api/blog/get/:id
    - Publish new article: POST /api/blog/
       ```JS
       Body:
       {
          "title": "article title",
          "body": "article body",
          "imgUrl": "article image url",
          "tags": ["article tag 01", "article tag 02"]
        }
        Header:
        "x-login-token": "your login token"
       ```
     - Delete one specific article: DELETE /api/blog/:id
       ```JS
        Header:
        "x-login-token": "your login token"
       ```
      - Modify existing article: PATCH /api/blog/:id
         ```JS
         Body:
         {
            "title": "modified article title",
            "body": "article body",
            "imgUrl": "article image url",
            "tags": ["article tag 01", "article tag 02"]
          }
          Header:
          "x-login-token": "your login token"
         ```
         
 3. Comments Features
    - Get all Comments for one article: GET /api/blog/comments/:id
    - Get one specific comment: GET /api/blog/comment/:id/:comment
    - Add comment on specific article: POST /api/blog/comment/:id
       ```JS
       Body:
       {
          "username": "the name of commenter",
          "body": "comment body"
        }
        Header:
        "x-login-token": "your login token"
       ```
     - Delete one specific comment on your own article: DELETE /api/blog/comment/:id/:comment
       ```JS
        Header:
        "x-login-token": "your login token"
       ```
      - Modify my own comment on one article: PATCH /api/blog/comment/:id/:comment
         ```JS
         Body:
         {
            "body": "modified comment"
          }
          Header:
          "x-login-token": "your login token"
         ```


## Front End 
Front-end repo: <a href="https://github.com/SomaiaElbaradey/Turning-Heads">Turning Heads - Front Repo</a> 

