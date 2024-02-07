# Easy Chef: A Social Media Platform for Sharing Recipes

Easy Chef is a social media platform designed for users to share and discover recipes. It is implemented with React.js for the frontend and Django Rest Framework for the backend.

## Features

- **Recipe Sharing:** Users can post their own recipes along with images and descriptions.
- **Recipe Discovery:** Users can explore a variety of recipes posted by others.
- **User Profiles:** Each user has a profile page where their posted recipes are displayed.
- **Social Interactions:** Users can like, comment on, and save recipes they find interesting.
- **Search Functionality:** Users can search for recipes based on keywords, ingredients, or categories.

## Technologies Used

- **Frontend:**
  - **React.js:** A JavaScript library for building user interfaces.
  - **React Router:** For handling navigation within the React application.
  - **Ant Design:** <a href="https://ant.design/">https://ant.design/</a>
  - **Semi Design:** <a href="https://semi.design/">https://semi.design/</a>
  
- **Backend:**
  - **Django Rest Framework:** A powerful and flexible toolkit for building Web APIs in Django.
  - **Django ORM:** Object-Relational Mapping for interacting with the database.
  - **Django Authentication:** Built-in authentication system for user management and security.
  
- **Database:**
  - **MySQL:** Used to store user data, recipes, comments, and other application-related information.

## Getting Started

To set up Easy Chef on your local machine, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the frontend directory: `cd frontend`
3. Install frontend dependencies: `npm install`
4. Start the frontend server: `npm start`
5. Open another terminal window.
6. Navigate to the backend directory: `cd backend`
7. Install backend dependencies: `pip install -r requirements.txt`
8. Set up the database according to Django settings.
9. Run database migrations: `python manage.py migrate`
10. Start the backend server: `python manage.py runserver`

Now, you should be able to access Easy Chef by visiting `http://localhost:3000` in your web browser.
