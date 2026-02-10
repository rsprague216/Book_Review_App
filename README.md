# Full-Stack App - React + Vite + TailwindCSS + Django

A modern full-stack application template with React frontend and Django backend.

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS v4** - Utility-first CSS framework

### Backend
- **Django 6** - Python web framework
- **Django REST Framework** - API toolkit
- **Django CORS Headers** - Cross-origin resource sharing

## Project Structure

```
.
├── backend/          # Django backend
│   ├── api/          # API app
│   ├── config/       # Django project settings
│   ├── manage.py     # Django management script
│   └── venv/         # Python virtual environment
├── frontend/         # React + Vite frontend
│   ├── src/          # Source files
│   ├── public/       # Static assets
│   └── package.json  # Node dependencies
└── README.md         # This file
```

## Getting Started

### Prerequisites
- Python 3.14+
- Node.js 22+
- npm 10+

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

The backend will be available at [http://localhost:8000](http://localhost:8000)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

The frontend will be available at [http://localhost:5173](http://localhost:5173)

## API Endpoints

- `GET /api/hello/` - Test endpoint that returns a welcome message

## Development

### Backend
- API views are in [backend/api/views.py](backend/api/views.py)
- URL routing in [backend/api/urls.py](backend/api/urls.py)
- Settings in [backend/config/settings.py](backend/config/settings.py)

### Frontend
- Main app component in [frontend/src/App.jsx](frontend/src/App.jsx)
- Tailwind styles in [frontend/src/index.css](frontend/src/index.css)
- Vite config in [frontend/vite.config.js](frontend/vite.config.js)

## Features

- Hot module replacement (HMR) for instant updates
- TailwindCSS v4 for modern styling
- CORS configured for local development
- Django REST Framework for API development
- SQLite database (default)

## Next Steps

1. Create additional API endpoints in the backend
2. Build out your React components
3. Add authentication (JWT, OAuth, etc.)
4. Set up a production database (PostgreSQL, MySQL)
5. Configure environment variables
6. Add testing (pytest for backend, Vitest for frontend)

## License

This project is open source and available under the MIT License.
