# Godown Manager

Godown Manager is a containerized application built with Vite (React + Tailwind) to monitor the real-time status of godowns (warehouses). An admin alias and a passkey secure authentication with JSON Web Token (JWT).

Visit [https://godown-manager.vercel.app](https://godown-manager.vercel.app). The required credentials are -
`Admin alias`: admin
`Pass key`: 12345678

## Table of Contents
- [Approach](#approach)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Authentication](#authentication)
- [Notes](#notes)

## Approach

- At first, I just made a basic API service using flask. Then tried to fetch and show only the parent godowns.
- Used Vite to setup React. Used TailwindCSS and Fontawesome.
- Updated the API and frontend till it was able to fetch and show the Subgodowns and Items in each Godown.
- Added a Main section to show the selected item's data.
- Added loading animations and verbose for better UX.
- Added JWT authentication. Protected the routes in frontend. Added authentication to API calls also.
- Made SQLite database from the JSON files. Replaced JSON-based database with SQLite.
- Added Navigation Bar at top.
- Made the Godown List to be able to dissapear when not required (added button in NavBar).
- Added search feature in frontend and search API endpoint in backend.
- Added Dockefiles and docker-compose.
- Deployed backend and frontend on Vercel.

Now for installation on a local machine, go through the following...

## Prerequisites
Make sure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Environment Variables
Before starting the app, you can modify the environment variables in the `.env` file. These variables control the application's configuration.

```
#These credentials will be required to unlock the Godown app 
ADMIN_ALIAS=admin
ADMIN_PASSKEY=12345
JWT_SECRET="MahSupaSecretKey#6699"

```
You **must** change these values before deploying the app in a production environment.

## Installation

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/premagarwals/godown-manager.git
   cd godown-manager
   ```

2. Make sure Docker is running on your system.

3. Open the `.env` file in the root directory and adjust the variables as needed.

## Running the App

1. Start Docker by running:
   ```bash
   docker-compose up --build
   ```

2. Once the containers are up and running, open your browser and visit:
   ```
   http://localhost:5173
   ```

3. You should now see the real-time status of the godown.

## Authentication

To enter the 'godown status dashboard' you need to login with an admin alias and passkey which is defined in the `.env` file. This application uses JWT for managing authentication and authorization.

- **Admin Alias:** Use the `ADMIN_ALIAS` value from the `.env` file.
- **Admin Passkey:** Use the `ADMIN_KEY` from the `.env` file.

As a part of that login, a JWT token will be generated which could be used each time a subsequent request is made to the API.

**Notes:**

- Since this application is containerized, Docker is required to be running before bringing up services.
- The default environment variables are also not very secure. Change them in the `.env` file before deploying the application.
- To stop the application, either use `Ctrl+C` in the terminal or run:
  ```bash
  docker-compose down
  ```
