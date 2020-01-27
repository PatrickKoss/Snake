# Django rest api for snake

> The rest api for the snake game built with django and django rest framework.

## Structure
-   Main app for predicting the snake direction. It also handles the AI built.
-   User app for handeling the user management.
-   Leaderboard for handeling the scores.
-   Each App has a views.py for the logic what should be routerned in a route. router.py connects the views with a route.

## Prerequisites and Usage

-   Install python 3.
-   Install pip.
-   Install all python modules by pip install -r requirements or install them by hand with pip install nameOfTheModule.
-   Make migrations to setup the database by `python manage.py migrate` and `python manage.py makemigrations`

## Detailed Build Setup

```bash
# install dependencies
pip install -r requirements

# make migrations
python manage.py migrate
python manage.py makemigration

# run locally on 127.0.0.1
python manage.py runserver
```