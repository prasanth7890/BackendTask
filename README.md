This is a simple e-commerce API built with Node.js, Express and MongoDB.

### Getting Started

#### Prerequisites

    Node.js installed
    MongoDB Atlas cluster created

#### Installation

- Clone the repository
- Run `npm install` to install dependencies
- Create a `.env` file with your MongoDB connection URI

#### Runing the App

`npm run start`

This will start the Express server on port 3000.

#### API Endpoints

- Products

  - GET /products - Get all products
  - GET /products/:id - Get single product
  - POST /products - Create new product
  - PUT /products/:id - Update product
  - DELETE /products/:id - Delete product

- Variants
  - GET /variants - Get all variants
  - GET /variants?productId=xxx - Get variants for a product
  - GET /variants/:id - Get single variant
  - POST /variants/:productId - Create new variant
  - PUT /variants/:id - Update variant
  - DELETE /variants/:id - Delete variant
- Search
  - GET /search?term="searchtermhere" - searches product name, description, or variant name.

#### Architectural Decisions

- Used MongoDB as the database for flexibility and scalability. The document model fits the product/variant structure well.
- Structured the app with an MVC pattern - models for data, controllers for business logic, routes for handling requests. This provides separation of concerns.
- Implemented a REST API design for a clean and standard interface to the backend. Easy to understand and develop against.
- Used Mongoose ODM for elegant data modeling with validation, middleware, query building. Makes working with MongoDB simple.
- Built reusable controllers for products and variants to contain CRUD logic. Keeps route handlers thin.
- Utilized promises and async/await to handle async flow. Using promises is idiomatic for Node.js.
- Removing Products/Variants can also removes them completely from Database and Product's Variants List also.
- Validation handled by Zod library. Allows reusable validation schemas.
- Express for simple and fast routing and middleware capabilities. It's perfect for REST APIs.
- Jest for unit tests, SuperTest for integration tests. Enables test driven development.
- MongoDB transactions used to ensure data consistency where applicable.

Let me know if you need me to expand on rationale for any of these decisions!

#### Assumptions

- Products and variants are stored in separate collections in the database rather than embedding variants within products. This provides more flexibility for access.
- Both products and variants can be accessed independently through dedicated endpoints.
- Variants belong to a product, through the productId foreign key property on Variants.
- Products/variants are not deleted in a cascading fashion. Delete endpoints just remove the individual document.
- Search endpoint matches against name, description for products and just name for variants for simplicity.
- Search performs a simple substring match, not full text search.
- Authentication/authorization is out of scope, all endpoints are unprotected.
- Only basic CRUD operations are implemented for MVP purposes. Additional business logic can be added later.

### Testing

Jest and Supertest are used for testing the API.

Due to timeConstraints and first time using Jest and SuperTest, please run each testfiles one at a time.

#### Running Tests

- go to tests folder: `cd tests`
- Run `npx jest <TestFile>`
