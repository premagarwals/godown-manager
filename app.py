import json
import os

from flask import Flask, jsonify, request, abort
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

def load_godowns():
    with open('godown.json', 'r') as file:
        godowns = json.load(file)
    return godowns

def load_items():
    with open('items.json', 'r') as file:
        items = json.load(file)
    return items

@app.route('/root-godowns', methods=['GET'])
def get_root_godowns():
    items = load_godowns()
    filtered_items = [item for item in items if item.get('parent_godown') is None]
    return jsonify(filtered_items)

@app.route('/sub-godowns/<id>', methods=['GET'])
def get_sub_godowns(id):
    items = load_godowns()
    
    if id is None:
        abort(404)
    
    filtered_items = [item for item in items if item.get('parent_godown') == id]
    return jsonify(filtered_items)

@app.route('/godown-items/<id>', methods=['GET'])
def get_items(id):
    items = load_items()
    
    if id is None:
        abort(404)
    
    available_items = []
    unavailable_items = []
    
    for item in items:
        if item.get('godown_id') == id:
            if item.get('status') == "in_stock":
                available_items.append(item)
            else:
                unavailable_items.append(item)
                
    filtered_items = available_items + unavailable_items
    return jsonify(filtered_items)

@app.route('/item/<id>', methods=['GET'])
def get_item_data(id):
    items = load_items()
    
    if id is None:
        abort(404)
    
    for item in items:
        if item.get('item_id') == id:
            return jsonify(item)
    else:
        abort(404)

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

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

        if decoded.get("user") == ADMIN_ALIAS:
            return jsonify({'auth': True})

    except jwt.ExpiredSignatureError:
        return jsonify({'auth': False, 'message': 'Token has expired'})#, 401
    except jwt.InvalidTokenError:
        return jsonify({'auth': False, 'message': 'Invalid token'})#, 401

    return jsonify({'auth': False, 'message': 'User is not admin'})#, 403

if __name__ == '__main__':
    app.run(debug=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
