from flask import Flask, jsonify, request,session
from flask_cors import CORS
import psycopg2
import psycopg2.extras
import base64
from base64 import b64decode

from configparser import ConfigParser
# App instance
app = Flask(__name__)
CORS(app)
config =ConfigParser()
config.read("env.ini")




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




#Function to create an api Post request to register and commit data entered to the database
@app.route("/api/register", methods=['POST'])
def register_user():

    try:
        data = request.get_json()

        # Retrieve data from the request
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        gender=data.get('gender')
        password = data.get('password')

        print(f"Received data: {data}")

        # Insert the data into the database using named placeholders
        cursor.execute('INSERT INTO users(fname,lname,email,password,gender) VALUES (%s,%s, %s ,%s,%s);', (first_name, last_name, email, password,gender))
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
            cursor.execute('SELECT id, fname FROM users where email = %s and password = %s', (email, password))
            result = cursor.fetchone()
            if result:
                    print(result["id"])
                    return jsonify({
            'message': 'Logged in successful',
            'flag':True,
            'id':result["id"],
            'fname':result["fname"]
                })
            else:
                    return jsonify({
            'message': 'Wrong Email or Password',
            'flag':False
                })
    except Exception as e:
        database_session.rollback()
        print(e)  # Print the error to the console for debugging
        return jsonify({
            'error': f'Error registering user: {str(e)}'
        }), 500




@app.route("/api/email", methods=['POST'])
def checkEmail():
    try:
        data = request.get_json()

        # Retrieve data from the request
        email = data.get('email')

        if email:
            cursor.execute('SELECT id,email FROM users WHERE email = %s', (email,))
            result = cursor.fetchone()
            if result:
                return jsonify({
                    'message': 'Valid Email',
                    'flag':True,
                    'result':dict(result)
                })
            else:
                return jsonify({
                    'message': 'Wrong Email',
                    'flag':False,
                })
    except Exception as e:
        database_session.rollback()
        print(e)  # Print the error to the console for debugging
        return jsonify({
            'error': f'Error checking email: {str(e)}'
        }), 500
    



@app.route("/api/userInfo", methods=['GET'])
def getUserInfo():
    try:
        data = request.args  # Use request.args for query parameters in a GET request

        id = data.get('userId')
        if id:
            cursor.execute('SELECT * FROM users WHERE id=%s', (id,))
            result = cursor.fetchone()
            if result:
                encoded_image = None

                if result["profile_pic"]:
                    # Convert the binary image data to base64 before sending it in the response
                    encoded_image = base64.b64encode(result["profile_pic"]).decode('utf-8')

                return jsonify({
                    'message': 'User found successfully',
                    'data': [result["id"], result["fname"], result["lname"], result["email"], result["pnumber"],
                             result["instagram"], result["facebook"], result["github"], result["gender"]],
                    'encoded_image': encoded_image
                })
            else:
                return jsonify({
                    'message': 'User not found',
                    'flag': False
                }), 404
        else:
            return jsonify({
                'message': 'Invalid request format',
                'flag': False
            }), 400
    except Exception as e:
        database_session.rollback()
        print(e)
        return jsonify({
            'error': f'Error User Info: {str(e)}'
        }), 500

@app.route("/api/newPassword", methods=['PATCH'])
def newPassword():
    try:
        data = request.get_json()

        # Retrieve data from the request
        id = data.get('id')
        new_password = data.get('newPassword')

        if id and new_password:
            # Update the user's password in the database
            cursor.execute('UPDATE users SET password = %s WHERE id = %s', (new_password, id))

            # Commit the changes
            database_session.commit()

            return jsonify({
                'message': 'Password updated successfully',
                'flag':True
            })
        else:
            return jsonify({
                'message': 'Invalid request format',
                'flag':False
            }), 400

    except Exception as e:
        database_session.rollback()
        print(e)
        return jsonify({
            'error': f'Error updating password: {str(e)}'
        }), 500
    

@app.route("/api/updateUser", methods=['PATCH'])
def update_user():
    try:
        # Retrieve data from the form data
        data = request.form
        id = data.get("userId")
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        pnumber = data.get('phone_number')
        profile_image = request.files['profile_image'].read() if 'profile_image' in request.files else None
        facebook = data.get('facebook')
        instagram = data.get('instagram')
        github = data.get('github')

        if id:
            cursor.execute('UPDATE users SET fname=%s, lname=%s,pnumber=%s, instagram=%s, facebook=%s, github=%s WHERE id=%s;', (first_name, last_name,pnumber, instagram, facebook, github, id))
            database_session.commit()
        
        if profile_image:
            cursor.execute('UPDATE users SET profile_pic = %s WHERE id = %s;', (psycopg2.Binary(profile_image), id))
            database_session.commit()





        return jsonify({
            'message': 'User updated successfully',
            'flag': True,
            'id':id,
            'name':first_name
        })

    except Exception as e:
        database_session.rollback()
        print(e)
        return jsonify({
            'error': f'Error updating user: {str(e)}'
        }), 500




#Function to create an api Post request to register and commit data entered to the database
@app.route("/api/createpost", methods=['POST'])
def createPost():

    try:
        data = request.get_json()

        # Retrieve data from the request
        user_id=data.get("id")
        post=data.get("post")

        print(f"Received data: {data}")

        # Insert the data into the database using named placeholders
        cursor.execute('INSERT INTO post(content,user_id) VALUES (%s,%s);', (post,user_id))
        print("Query executed successfully")

        # Commit the changes
        database_session.commit()

        print("Changes committed successfully")

        return jsonify({
            'message': 'Post created successful'
        })
    except Exception as e:
        database_session.rollback()
        print(e)  # Print the error to the console for debugging
        return jsonify({
            'error': f'Error in creating post: {str(e)}'
        }), 500



@app.route("/api/getPost", methods=['GET'])
def getPost():
    try:
        # Retrieve data from the request parameters (change this based on your frontend request)
        user_id = request.args.get("id")

        if user_id:
            # Execute a SELECT query to retrieve all posts for the specified user_id
            cursor.execute('SELECT * FROM post WHERE user_id = %s;', (user_id,))
            posts = cursor.fetchall()

            # Optionally, you can process the retrieved posts further or return them directly
            # For now, just return a success message
            return jsonify({
                'message': 'Posts retrieved successfully',
                'posts': posts
            })

    except Exception as e:
        database_session.rollback()
        print(e)  # Print the error to the console for debugging
        return jsonify({
            'error': f'Error retrieving posts: {str(e)}'
        }), 500


@app.route("/api/deletePost", methods=['DELETE'])
def deletePost():
    try:
        post_id = request.args.get("postid")

        if post_id:
            # Delete the post with the specified post_id from the database
            cursor.execute('DELETE FROM post WHERE id = %s', (post_id,))

            # Commit the changes
            database_session.commit()

            return jsonify({
                'message': 'Post deleted successfully',
                'flag': True
            })
        else:
            return jsonify({
                'message': 'Invalid request format',
                'flag': False
            }), 400

    except Exception as e:
        database_session.rollback()
        print(e)
        return jsonify({
            'error': f'Error deleting post: {str(e)}'
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=8080)
