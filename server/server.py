from flask import Flask, jsonify, request,session
from flask_cors import CORS
import psycopg2
import psycopg2.extras
from configparser import ConfigParser
# App instance
app = Flask(__name__)
CORS(app)
config =ConfigParser()
config.read("env.ini")


# Initial list of people
# only used to test the HTTP requests
people_list = ['Jack', 'Harry', 'Barry']


# connecting to the data base
database_session=psycopg2.connect(
    database=config["Database_info"]["dataBaseName"], #enter the name of the database
    port=5432, #Enter the port your database connect to
    host='localhost', 
    user='postgres',
    password= config["Database_info"]["dataBasePassword"] #Enter the password for your postgres
)

#creating a session for the database access
cursor = database_session.cursor(cursor_factory=psycopg2.extras.DictCursor)


# dummy route to test the api requests
@app.route("/api/home", methods=['GET', 'POST'])
def return_home():
    if request.method == 'GET':
        # Handle GET request
        return jsonify({
            'message': "oh  yeeaahh",
            'people': people_list
        })
    elif request.method == 'POST':
        # Handle POST request
        data = request.get_json()

        if 'new_people' in data and isinstance(data['new_people'], list):
            # Update the people list with the new data
            people_list.clear()
            people_list.extend(data['new_people'])

            return jsonify({
                'message': 'People list updated successfully',
                'people': people_list
            })
        else:
            return jsonify({
                'error': 'Invalid request format'
            }), 400
        

#Function to create an api Post request to register and commit data entered to the database
@app.route("/api/register", methods=['POST'])
def register_user():

    try:
        data = request.get_json()

        # Retrieve data from the request
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        password = data.get('password')

        print(f"Received data: {data}")

        # Insert the data into the database using named placeholders
        cursor.execute("""
            INSERT INTO Users (first_name, last_name, email, password)
            VALUES (%(first_name)s, %(last_name)s, %(email)s, %(password)s)
        """, {'first_name': first_name, 'last_name': last_name, 'email': email, 'password': password})

        print("Query executed successfully")

        # Commit the changes
        database_session.commit()

        print("Changes committed successfully")

        return jsonify({
            'message': 'Registration successful'
        })
    except Exception as e:
        database_session.rollback()
        print(e)  # Print the error to the console for debugging
        return jsonify({
            'error': f'Error registering user: {str(e)}'
        }), 500



#Function to create an API Request of type POST to post a request to the database
# and Check if the email and password sent are in database or not
@app.route("/api/signin", methods=['POST'])
def login():
    
    try:
        data = request.get_json()

        # Retrieve data from the request
        email = data.get('email')
        password = data.get('password')

        if email:
            cursor.execute('SELECT id, first_name FROM users where email = %s and password = %s', (email, password))
            result = cursor.fetchone()
            if result:
                    return jsonify({
            'message': 'Logged in successful'
                })
            else:
                    return jsonify({
            'message': 'Wrong Email or Password'
                })
    except Exception as e:
        database_session.rollback()
        print(e)  # Print the error to the console for debugging
        return jsonify({
            'error': f'Error registering user: {str(e)}'
        }), 500



if __name__ == "__main__":
    app.run(debug=True, port=8080)
