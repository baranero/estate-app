# Estate App

Create an account using e-mail or Google account and add your offers. Also browse offers from other users. Search for properties by phrase or other filters. Find your dream place.

## Demo

https://estate-app-kghi.onrender.com/

## Features

Here're some of the project's best features:
 - Add, edit and delete your offers,
 - Filter offers by name or parameters,
 - Add an account using email or google account, edit user details or delete account.

## Built with

Technologies used in the project:
- TypeScript: A statically typed superset of JavaScript.
- MongoDB: A NoSQL database for storing real estate data.
- Express: A Node.js framework for building the API.
- React: A JavaScript library for building the user interface.
- Node.js: A JavaScript runtime for running the server.
- Redux Toolkit: A state management library for React.
- Firebase: Used for authentication.
- Tailwind CSS: A utility-first CSS framework.
- Vite: A build tool for the client.

## Create environment variables

In estate-app/api create .env file:
```
MONGO = "add-your-connection-string-into-your-application-code"
```
```
JWT_SECRET = "random-letters-or-numbers"
```

In estate-app/client create .env file:
```
VITE_FIREBASE_API_KEY = "add-firebase-api-key"
```

## How to run
- Clone repository:
```
git clone https://github.com/baranero/estate-app.git
```
- Go to main folder:
```
cd estate-app
```
 - Install packages in main folder:
```
npm i
```
To run backend:
- Go to api folder:
```
cd api
```
 - Install packages in api folder:
```
npm i
```
- Start backend:
```
npm run dev
```
To run frontend:<br>
- Open another bash console and go to client folder:
```
cd estate-app/client
```
 - Install packages in client folder:
```
npm i
```
- Start frontend:
```
npm run dev
```
