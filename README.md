# NBA Management API 🏀

## Video Demo:  <URL HERE>

## Description
>Welcome to the NBA Management API! <br>
This project is a backend solution designed to manage a few aspects of NBA teams, players, and their positions. The API is a RESTful service that allows users to interact with NBA-related data through HTTP server requests and perform CRUD (Create, Read, Update, and Delete) operations.

### Project Overview
> The NBA Management API is built using modern web technologies to ensure scalability and performance. It provides a robust platform for managing user authentication, player profiles, team rosters, and making it an ideal solution for basketball enthusiasts.

### Key Features
- **Login Feature**: Secure authentication process to ensure that only authorized users can access the API and its endpoints, by JWT token management
- **Player Management:** Manage player profiles, including personal and professional details, positions, and team associations. 
- **Team Management:** Handle team data, including roster management, team details, and historical data.
- **Position Management:** Define and manage player positions, allowing for flexible assignment, as users can have more than one position.
- **User Management:** Manage users who have access to the API by an authentication process, ensuring secure and controlled access to data.
- **Hashing Technique**: Whenever a user create his account and logs in, his password will be encrypted and hashed, for cybersecurity measures.

### Project Structure
- **src/**
    - **controllers:** Contains the controller files that define the API endpoints and handle HTTP requests.
        - **authController:** Manages user authentication and session management with JWT tokens.
        - **healthController:** Provides a health check endpoint to monitor API status.
        - **playerController:** Handles CRUD operations for player data.
        - **positionController:** List all positions and players assigned to them.
        - **teamController:** Handles team data and roster management.
        - **userController:** Manages user sensitive data and permissions.
    - **entities:** Defines the data models using TypeORM decorators, representing tables in the PostgreSQL database.
        - **Player:** Represents player data and attributes.
        - **Position**: Represents player position(s) and team.
        - **Team:** Manages team information and associations.
        - **User:** Handles user data and authentication details.
    - **middlewares:** Includes middleware functions for handling authentication, validation, and error handling.
        - **authenticationHandler:** Ensures secure access to API endpoints by checking if the request was sent with the JWT token on its header.
        - **errorHandler:** Manages server error responses and logging.
        - **fieldValidation:** Validates incoming request data.
    - **repositories:** Implements the data access layer, providing methods to interact with the database.
        - **playerRepository:** Handles database operations for players.
        - **positionRepository:** Manages position-related database interactions.
        - **teamRepository:** Handles database operations for teams.
        - **userRepository:** Manages user data retrieval and storage.
    - **routes:** Configures the API routes, mapping HTTP requests to the appropriate controller methods.
    - **seeders:** Scripts that seed the database with static and/or dynamic data.
    - **helpers:** A few useful files and helper functions.
- **root/:** Contains configuration files for the database connection and environment variables.
    - .env: Stores environment variables for configuration.
    - seed.ts: Script to seed the database with initial data.
    - server.ts: Entry point for starting the server.

### Design and Technology Choices 
- **PostgreSQL:** A robust database for managing relational data and ensuring high performance and data integrity.
- **Express.js:** A simple and flexible backend framework for building RESTful APIs.
- **Node.js:** Provides the runtime environment for executing JavaScript on the server.
- **TypeScript:** Offers static typing, which helps catch early errors and improve code readability and maintainability.
- **TypeORM:** Used as the Object-Relational Mapping (ORM) tool to integrate the application entities with the database.
- **Postman**: For testing and documenting the API endpoints, it provides a interface to send and inspect HTTP requests and responses.

#### NPM Dependencies/Libraries
- **TypeORM:** Facilitates database operations and schema management.
- **TypeScript:** Enables static typing and modern JavaScript features.
- **TS-Node:** Allows TypeScript to be run directly in Node.js.
- **Nodemon:** Automatically restarts the server during development when file changes are detected.
- **Express:** Framework for building web applications and APIs.
- **Cors:** Middleware for enabling Cross-Origin Resource Sharing.
- **Dotenv:** Loads environment variables from a .env file.
- **Pg:** PostgreSQL client for Node.js.
- **Class Transformer:** Transforms plain objects into class instances and vice versa.
- **Class Validator:** Provides decorators for validating Entities class properties.
- **JWT:** Used for creating and verifying JSON Web Tokens for the API routes, mapping HTTP requests tntication.
- **BcryptJS:** Library for hashing passwords securely.
- **Faker:** Generates fake data for testing and seeding the database.


## Installation and Setup
1. Clone the repository to your local machine.
2. Navigate to the project directory/root.
3. Install the dependencies: `npm install`.
4. Set up your environment variables in a .env file.
5. Run the development server: `npm run dev`.
6. Access the API at http://localhost:`port`.