# Todo Application

A modern, full-stack todo application built with React frontend and Rails API backend. This application provides a clean, intuitive interface for managing tasks with features like authentication, task creation, editing, and detailed task views.

## 🚀 Features

### Core Features
- **User Authentication**: Secure login and registration system with JWT tokens
- **Task Management**: Create, read, update, and delete todos
- **Task Details**: Click on any todo to view detailed information
- **Priority Levels**: Set priority levels (Low, Medium, High, Urgent)
- **Status Tracking**: Track task status (Pending, Started, Completed)
- **Due Date Management**: Set and track due dates with visual indicators
- **Responsive Design**: Works seamlessly across desktop and mobile devices

### UI/UX Features
- **Modern Interface**: Clean, intuitive design with Tailwind CSS
- **Visual Indicators**: Color-coded priority levels and status indicators
- **Hover Effects**: Smooth animations and interactive elements
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Proper loading indicators for better UX
- **Task Overview**: Dashboard with task statistics and progress tracking

## 🛠️ Tech Stack

### Backend
- **Ruby on Rails 8.0.2**: API framework
- **MongoDB**: NoSQL database with Mongoid ODM
- **JWT**: JSON Web Tokens for authentication
- **BCrypt**: Password hashing
- **Rack CORS**: Cross-origin resource sharing
- **Puma**: Web server

### Frontend
- **React 19.1.0**: UI library
- **Vite**: Build tool and development server
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Toastify**: Toast notifications
- **Axios**: HTTP client

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Ruby 3.0+** (for backend)
- **Node.js 18+** (for frontend)
- **MongoDB** (for database)
- **Git** (for version control)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Todo
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:
```bash
cd backend
bundle install
```

Set up the database:
```bash
# Create MongoDB database (if not already created)
# MongoDB should be running on your system
```

Configure environment variables:
```bash
# Create .env file if needed for any environment-specific configurations
```

Start the Rails server:
```bash
rails server
# or
bin/dev
```

The backend API will be available at `http://localhost:3000`

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Create environment variables:
```bash
# Create .env file in frontend directory
VITE_API_URL=http://localhost:3000/api/v1
```

Start the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/v1/login` - User login
- `POST /api/v1/register` - User registration
- `PATCH /api/v1/users/:id` - Update user profile
- `DELETE /api/v1/users/:id` - Delete user account

### Todos
- `GET /api/v1/todos` - Get all todos for authenticated user
- `GET /api/v1/todos/:id` - Get specific todo details
- `POST /api/v1/todos` - Create new todo
- `PUT /api/v1/todos/:id` - Update todo
- `DELETE /api/v1/todos/:id` - Delete todo

## 🎯 Usage

### Getting Started
1. Open the application in your browser
2. Register a new account or login with existing credentials
3. Start creating and managing your todos

### Creating Tasks
- Click the "Add Task" button to open the task creation form
- Fill in the task details (title, description, due date, priority)
- Click "Create Task" to save

### Managing Tasks
- **View Details**: Click on any task card to see detailed information
- **Edit Task**: Click the edit icon on a task card or use the edit button in the detail view
- **Delete Task**: Click the delete icon on a task card or use the delete button in the detail view
- **Toggle Status**: Use the checkbox to mark tasks as completed/pending

### Task Overview
The dashboard provides:
- Total number of tasks
- Number of completed tasks
- Number of pending tasks
- Number of tasks due today
- Visual progress indicators

## 🏗️ Project Structure

```
Todo/
├── backend/                 # Rails API backend
│   ├── app/
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # Database models
│   │   └── services/       # Business logic services
│   ├── config/             # Rails configuration
│   └── test/               # Backend tests
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── routes/         # Routing configuration
│   │   └── services/       # API service functions
│   └── public/             # Static assets
└── README.md              # This file
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
rails test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
The backend includes Kamal deployment configuration. To deploy:

```bash
cd backend
kamal deploy
```

### Frontend Deployment
Build the frontend for production:

```bash
cd frontend
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🔧 Development

### Running in Development Mode
1. Start MongoDB
2. Start the backend: `cd backend && rails server`
3. Start the frontend: `cd frontend && npm run dev`

### Code Quality
- Backend: Uses RuboCop for code formatting
- Frontend: Uses ESLint for code linting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information about the problem
3. Include steps to reproduce the issue

## 🔮 Future Enhancements

- [ ] Search and filter functionality
- [ ] Task categories and tags
- [ ] File attachments for tasks
- [ ] Collaborative task sharing
- [ ] Push notifications for due dates
- [ ] Dark mode theme
- [ ] Export/import functionality
- [ ] Advanced analytics and reporting

---

**Happy Task Management! 🎉**