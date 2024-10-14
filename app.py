import json
import os
from functools import wraps
import sqlite3

from flask import Flask, jsonify, request
from flask_cors import CORS
import jwt
import datetime

app = Flask(__name__)
CORS(app)

SECRET_KEY = os.getenv('JWT_KEY')
ADMIN_ALIAS = os.getenv('ADMIN_ALIAS')
ADMIN_PASSKEY = os.getenv('ADMIN_KEY')

if not all([SECRET_KEY,ADMIN_ALIAS,ADMIN_PASSKEY]):
    raise EnvironmentError("\n\nEnvironment variables not found!\nrequired variables: ADMIN_ALIAS, ADMIN_KEY, JWT_KEY\n\nPlease run: export <variable>=<value>\n\nDon't get afraid, you can set any value you want :)\n")

def verify_token(token):
    decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

        if decoded.get("user") == ADMIN_ALIAS:
            return {'auth': True}
        
    except jwt.ExpiredSignatureError:
        return {'auth': False, 'message': 'Token has expired'}
    except jwt.InvalidTokenError:
        return {'auth': False, 'message': 'Invalid token'}
    
    return {'auth': False, 'message': 'User is not admin'}
      
def protected_route(func):
    @wraps(func)
    def validator(*args, **kwargs):
        data = request.get_json()
        token = data.get('token')

        if not token:
            return jsonify({'auth': False, 'message': 'Token not provided'})
        
        status = verify_token(token)
        
        if status['auth']:
            return func(*args, **kwargs)
        
        return jsonify(status)
    return validator
    
def get_godown_connection():
    conn = sqlite3.connect('godowns.db') 
    conn.row_factory = sqlite3.Row
    return conn

def get_items_connection():
    conn = sqlite3.connect('items.db') 
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/root-godowns', methods=['POST'])
@protected_route
def get_root_godowns():
    conn = get_godown_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM godowns WHERE parent_godown IS NULL")
    godowns = cursor.fetchall()
    godown_list = [dict(godown) for godown in godowns]
    
    conn.close()
    
    return jsonify(godown_list)

@app.route('/sub-godowns/<id>', methods=['POST'])
@protected_route
def get_sub_godowns(id):
    conn = get_godown_connection()
    cursor = conn.cursor()
    
    if id is None:
        return jsonify({})
    
    cursor.execute("SELECT * FROM godowns WHERE parent_godown IS ?",(id,))
    sub_godowns = cursor.fetchall()
    sub_godown_list = [dict(sub_godown) for sub_godown in sub_godowns]
    
    conn.close()
    
    return jsonify(sub_godown_list)

@app.route('/godown-items/<id>', methods=['POST'])
@protected_route
def get_items(id):
    conn = get_items_connection()
    cursor = conn.cursor()
    
    if id is None:
        return jsonify({})
    
    available_items = []
    unavailable_items = []
    
    cursor.execute("SELECT * FROM items WHERE godown_id IS ? AND status IS ?",(id,"in_stock"))
    items = cursor.fetchall()
    available_items = [dict(item) for item in items]
    cursor.execute("SELECT * FROM items WHERE godown_id IS ? AND status IS ?",(id,"out_of_stock"))
    items = cursor.fetchall()
    unavailable_items = [dict(item) for item in items]
                
    filtered_items = available_items + unavailable_items
    return jsonify(filtered_items)

@app.route('/item/<id>', methods=['POST'])
@protected_route
def get_item_data(id):
    conn = get_items_connection()
    cursor = conn.cursor()
    
    if id is None:
        return jsonify({})
    
    cursor.execute("SELECT * FROM items WHERE item_id IS ?",(id,))
    item = cursor.fetchone()
    
    if item:
        item=dict(item)
        item["attributes"]={}
        attr_1 = item["attribute_1"].split("~")
        item["attributes"][attr_1[0]]=attr_1[1]
        item.pop("attribute_1")
        attr_2 = item["attribute_2"].split("~")
        item["attributes"][attr_2[0]]=attr_2[1]
        item.pop("attribute_2")
        attr_3 = item["attribute_3"].split("~")
        item["attributes"][attr_3[0]]=attr_3[1]
        item.pop("attribute_3")
        return(jsonify(item))
    else:
        return jsonify({
            "item_id": None,
            "name": "Product Name",
            "quantity": 0,
            "category": "Category",
            "price": 0.00,
            "status": "out_of_stock",
            "godown_id": "gid",
            "brand": "Brand",
            "attributes": {
            "color": "NaN",
            "size": "NaN",
            "type": "NaN"
            },
            "image_url": "https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png"
        })

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if 'passKey' not in data:
        return jsonify({'auth': False, 'message': 'passKey not provided'})#, 400

    alias = data['alias']
    passKey = data['passKey']

    if passKey == ADMIN_PASSKEY and alias == ADMIN_ALIAS:
        token = jwt.encode({
            'user': ADMIN_ALIAS, 
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({'auth': True, 'token': token, 'message': 'Login successful'})

    return jsonify({'auth': False, 'message': 'Invalid Alias or Passkey'})#, 403

@app.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({'auth': False, 'message': 'Token not provided'})#, 401

    return jsonify(verify_token(token))

if __name__ == '__main__':
    app.run(debug=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
