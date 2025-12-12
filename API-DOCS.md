# API Documentation

## Base URL
- Development: `http://localhost:3000/api`
- Production: `http://107.21.128.123/api`

## 1. Authentication (`/auth`)

| Method |  Endpoint  |      Description     |  Auth  |             Body            |
| :----- | :--------- | :------------------- | :----- | :-------------------------- |
| POST   | `/register`| Register new user    | Public | `{ name, email, password }` |
| POST   | `/login`   | Login user           | Public | `{ email, password }`       |
| POST   | `/refresh` | Refresh Access Token | Public | `{ refreshToken }`          |
| GET    | `/me`      | Get current profile  | User   | -                           |

## 2. Categories (`/categories`)

| Method | Endpoint | Description | Auth | Body |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/` | List all categories | Public | - |
| GET | `/:id` | Get category detail | Public | - |
| POST | `/` | Create category | Admin | `{ name }` |
| PUT | `/:id` | Update category | Admin | `{ name }` |
| DELETE | `/:id` | Delete category | Admin | - |

## 3. Events (`/events`)

| Method | Endpoint | Description | Auth | Body/Query |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/` | List events | Public | Query: `page`, `limit`, `search`, `category`, `sortBy` |
| GET | `/:id` | Get event detail | Public | - |
| POST | `/` | Create event | Admin | `{ title, date, price, stock, categoryId, ... }` |
| PUT | `/:id` | Update event | Admin | `{ title, date, price, stock, categoryId, ... }` |
| DELETE | `/:id` | Delete event | Admin | - |

## 4. Tickets (`/tickets`)

| Method | Endpoint | Description | Auth | Body |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/buy` | Buy a ticket | User | `{ eventId }` |
| GET | `/my-tickets` | List user's tickets | User | - |
| DELETE | `/:id` | Cancel ticket | Owner | - |