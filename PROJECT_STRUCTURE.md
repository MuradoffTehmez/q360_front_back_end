# Q360 Platform Project Structure

## Backend (Django)

```
q360_backend/
├── accounts/                 # User management, authentication
│   ├── models.py            # User, Profile models
│   ├── views.py             # User management views
│   ├── serializers.py       # User serialization
│   ├── urls.py              # Account-related URLs
│   └── admin.py             # Admin configurations
├── departments/             # Department management
│   ├── models.py            # Department models
│   ├── views.py             # Department views
│   ├── serializers.py       # Department serialization
│   └── urls.py              # Department URLs
├── evaluations/             # 360-degree evaluations
│   ├── models.py            # Evaluation models
│   ├── views.py             # Evaluation views
│   ├── serializers.py       # Evaluation serialization
│   └── urls.py              # Evaluation URLs
├── ideas/                   # Idea bank functionality
│   ├── models.py            # Idea models
│   ├── views.py             # Idea views
│   ├── serializers.py       # Idea serialization
│   └── urls.py              # Idea URLs
├── notifications/           # Notification system
│   ├── models.py            # Notification models
│   ├── views.py             # Notification views
│   ├── serializers.py       # Notification serialization
│   └── urls.py              # Notification URLs
├── reports/                 # Reporting engine
│   ├── models.py            # Report models
│   ├── views.py             # Report views
│   ├── serializers.py       # Report serialization
│   └── urls.py              # Report URLs
├── q360/                    # Main project folder
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL configuration
│   └── wsgi.py              # WSGI configuration
├── manage.py                # Django management script
├── requirements.txt         # Python dependencies
└── .env                     # Environment variables
```

## Frontend (React)

```
q360_frontend/
├── public/                  # Static assets
│   ├── index.html           # Main HTML file
│   └── favicon.ico          # Favicon
├── src/
│   ├── assets/              # Images, icons, and other assets
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Common components (buttons, inputs, etc.)
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── evaluation/      # Evaluation form components
│   │   ├── reports/         # Report visualization components
│   │   └── layout/          # Layout components (header, sidebar, etc.)
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication pages (login, signup)
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── evaluations/     # Evaluation pages
│   │   ├── ideas/           # Idea bank pages
│   │   ├── notifications/   # Notification center
│   │   ├── reports/         # Report pages
│   │   ├── profile/         # User profile pages
│   │   └── admin/           # Admin panels
│   ├── services/            # API services
│   ├── store/               # Redux store
│   │   ├── index.js         # Store configuration
│   │   └── slices/          # Redux slices for different features
│   ├── utils/               # Utility functions
│   ├── hooks/               # Custom hooks
│   ├── routes/              # Routing configuration
│   ├── themes/              # Theme configurations (light/dark)
│   ├── App.js               # Main App component
│   └── index.js             # Entry point
├── package.json             # Node.js dependencies
├── tailwind.config.js       # Tailwind CSS configuration
└── .env                     # Environment variables
```