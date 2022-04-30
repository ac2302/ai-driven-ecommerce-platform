from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from os import path
from random import randint
from os import remove
import threading
import json

import reccomendations.predict
import chatbot.chat as chtbt
import spam_filter.filter as spm_fltr

print('imported packages')

app = Flask(__name__)
CORS(app)


@app.route("/reccomendations", methods=["GET"])
def reccomend():
    return jsonify(reccomendations.predict.get_rules())


@app.route("/chatbot", methods=['POST'])
def chatbot():
    msg = json.loads(request.data)['msg']
    return chtbt.chat(msg)


@app.route("/spam-filter", methods=['POST'])
def spam_filter():
    review = json.loads(request.data)['review']
    return jsonify(spm_fltr.filter(review))


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
