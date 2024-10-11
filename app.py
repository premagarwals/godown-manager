import json

from flask import Flask, jsonify, abort
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
