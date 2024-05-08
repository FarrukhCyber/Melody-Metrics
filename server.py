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
from keys_pie_chart import get_keys_pie_chart_data
from top30_tracks import get_top_30

app = Flask(__name__)
# CORS(app)
'''
ONLY define routes in this file. 
For any data processing, make a relevant function in separate file and call that function in the route.

'''

# LOAD THE DATASET
DATASET_PATH = './data/updated_file.csv'
df = pd.read_csv(DATASET_PATH)


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/test', methods=['GET'])
def test():
    return "Hello"

@app.route('/keys', methods=['GET'])
def keys_pie_chart():
    return get_keys_pie_chart_data(df)

@app.route('/top30', methods=['GET'])
def top30():
    print('here')   

    return get_top_30(df)

if __name__ == '__main__':
    app.run(port=5001, debug=True)
