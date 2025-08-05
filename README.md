# OpenMusic API

A RESTful API for music management built with Node.js, Hapi.js, and PostgreSQL.

## Features

- **User Management**: Registration and authentication
- **Album Management**: CRUD operations for albums
- **Song Management**: CRUD operations for songs with album association
- **Playlist Management**: Create, manage, and collaborate on playlists
- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control
- **Activity Tracking**: Track playlist activities

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Hapi.js
- **Database**: PostgreSQL
- **Authentication**: JWT (@hapi/jwt)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Migration**: node-pg-migrate
- **Linting**: ESLint

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd openMusic-API-versi-2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
# Server Configuration
PORT=5000
HOST=localhost

# Database Configuration
PGUSER=your_username
PGHOST=localhost
PGPASSWORD=your_password
PGDATABASE=openmusic
PGPORT=5432

# JWT Configuration
ACCESS_TOKEN_KEY=your_access_token_key
REFRESH_TOKEN_KEY=your_refresh_token_key
ACCESS_TOKEN_AGE=3600
```

5. Run database migrations:
```bash
npm run migrate
```

6. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /authentications` - Login
- `PUT /authentications` - Refresh token
- `DELETE /authentications` - Logout

### Users
- `POST /users` - Register new user

### Albums
- `POST /albums` - Create album
- `GET /albums/{id}` - Get album by ID
- `PUT /albums/{id}` - Update album
- `DELETE /albums/{id}` - Delete album

### Songs
- `POST /songs` - Create song
- `GET /songs` - Get all songs (with optional filters)
- `GET /songs/{id}` - Get song by ID
- `PUT /songs/{id}` - Update song
- `DELETE /songs/{id}` - Delete song

### Playlists
- `POST /playlists` - Create playlist
- `GET /playlists` - Get user's playlists
- `DELETE /playlists/{id}` - Delete playlist
- `POST /playlists/{id}/songs` - Add song to playlist
- `GET /playlists/{id}/songs` - Get songs in playlist
- `DELETE /playlists/{id}/songs` - Remove song from playlist

### Collaborations
- `POST /collaborations` - Add collaboration
- `DELETE /collaborations` - Remove collaboration

### Playlist Activities
- `GET /playlists/{id}/activities` - Get playlist activities

## Project Structure

```
src/
├── api/                    # API handlers and routes
│   ├── albums/
│   ├── authentications/
│   ├── collaborations/
│   ├── playlist-activities/
│   ├── playlists/
│   ├── songs/
│   └── users/
├── exceptions/             # Custom error classes
├── service/               # Business logic
│   └── postgres/         # Database services
├── tokenize/             # JWT token management
├── utils/                # Utility functions
├── validator/            # Input validation schemas
└── server.js             # Main server file
```

## Development

### Running in Development Mode
```bash
npm start
```

### Linting
```bash
npm run lint
```

### Database Migrations
```bash
npm run migrate
```

## Error Handling

The API uses custom error classes for different types of errors:
- `ClientError` - Base class for client errors
- `InvariantError` - Invalid input data
- `NotFoundError` - Resource not found
- `AuthorizationError` - Unauthorized access
- `AuthenticationError` - Authentication failed

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation with Joi
- CORS configuration
- SQL injection prevention with parameterized queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the ISC License. 