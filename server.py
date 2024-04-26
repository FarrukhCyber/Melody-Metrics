from flask import Flask, jsonify, request, render_template
from sklearn.manifold import MDS
import pandas as pd
from sklearn.decomposition import PCA
import numpy as np
from sklearn.preprocessing import StandardScaler
# from flask_cors import CORS
from sklearn.cluster import KMeans
from sklearn.metrics import mean_squared_error, pairwise_distances
import random
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
# CORS(app)
'''
ONLY define routes in this file. 
For any data processing, make a relevant function in separate file and call that function in the route.

'''

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/test', methods=['GET'])
def test():
    return "Hello"

if __name__ == '__main__':
    app.run(debug=True)
