

[CursorSurroundingLines]
[README.md]
# User Authentication System

A comprehensive user authentication system built with Node.js, Express, and MongoDB.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Requirements](#requirements)
4. [Installation](#installation)
5. [Endpoints](#endpoints)
6. [Database Schema](#database-schema)
7. [Security](#security)
8. [Contributing](#contributing)
9. [License](#license)

## Overview

This project provides a robust user authentication system with features such as registration, login, password reset, and role-based access control. The system is built using Node.js, Express, and MongoDB, and follows best practices for security and scalability.

## Features

* User registration with email and password
* User login with email and password
* Password reset with email verification
* Role-based access control (admin and user roles)
* JSON Web Token (JWT) authentication
* Refresh token mechanism for token renewal
* Email sending using Mailtrap

## Requirements

* Node.js (version 14 or higher)
* MongoDB (version 4 or higher)
* Express (version 4 or higher)
* Mongoose (version 5 or higher)
* Bcrypt (version 5 or higher)
* Jsonwebtoken (version 9 or higher)
* Nodemailer (version 6 or higher)
* Mailtrap (account required for email sending)

## Installation

1. Clone the repository using `git clone https://github.com/isommie/user-authentication-system.git`
2. Install dependencies using `npm install` or `yarn install`
3. Create a `.env` file with the following environment variables:
	* `MONGO_URI`: MongoDB connection string
	* `JWT_SECRET`: JWT secret key
	* `JWT_REFRESH_SECRET`: JWT refresh secret key
	* `MAILTRAP_USER`: Mailtrap username
	* `MAILTRAP_PASS`: Mailtrap password
4. Start the server using `npm start` or `yarn start`


## Endpoints

### Authentication

* `POST /register`: Register a new user
* `POST /login`: Login an existing user
* `POST /forgot-password`: Request password reset
* `POST /reset-password/:token`: Reset password

### User

* `GET /me`: Get current user information
* `GET /admin`: Get admin dashboard (requires admin role)

### Tokens

* `POST /refresh-token`: Refresh token

## Database Schema

The database schema is defined using Mongoose and consists of a single collection for users.

```javascript
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});
```

## Security

The system uses the following security measures:

* Password hashing using Bcrypt
* JWT authentication with secret key
* Refresh token mechanism for token renewal
* Email verification for password reset
* Role-based access control


## Contributing

Contributions are welcome! Please submit a pull request with a detailed description of the changes.

## License

This project is licensed under the MIT License.

[EndOfDocument README.md]
[/CursorSurroundingLines]