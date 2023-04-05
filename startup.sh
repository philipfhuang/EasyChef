python3 -m virtualenv venv -p $(which python3.10)
source venv/bin/activate
pip install -r requirements.txt
python3 easychef/manage.py makemigrations
python3 easychef/manage.py migrate