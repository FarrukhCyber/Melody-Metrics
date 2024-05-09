from flask import Flask, jsonify, request, render_template
from sklearn.manifold import MDS
import pandas as pd
from sklearn.decomposition import PCA
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
# from flask_cors import CORS
from sklearn.cluster import KMeans
from sklearn.metrics import mean_squared_error, pairwise_distances
import random
from sklearn.preprocessing import LabelEncoder
from keys_pie_chart import get_keys_pie_chart_data
from top30_tracks import get_top_30
from modes_pie_chart import get_modes_pie_chart_data
from radar_chart import get_radar_chart_data
from treemap import get_key_distribution
from bubble_chart import get_genre_distribution
# from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

app = Flask(__name__)
# CORS(app)
'''
ONLY define routes in this file. 
For any data processing, make a relevant function in separate file and call that function in the route.

'''
def convert_to_float(x):
    try:
        return pd.to_numeric(x.replace(',', ''))
    except AttributeError:
        return x

# LOAD THE DATASET
DATASET_PATH = './data/updated_file.csv'
df = pd.read_csv(DATASET_PATH)

# temp = df.drop(["genre", "track_name", "artist(s)_name"], axis=1)

# categorical_features = ["key", "mode"]
# numerical_features = ["artist_count" ,"released_year","released_month","released_day","in_spotify_playlists","in_spotify_charts","streams","in_apple_playlists","in_apple_charts","in_deezer_playlists","in_deezer_charts","in_shazam_charts","bpm","danceability_%","valence_%","energy_%","acousticness_%","instrumentalness_%","liveness_%","speechiness_%","duration_ms"]

# for column in numerical_features:
#     temp[column] = temp[column].apply(convert_to_float)

# temp.dropna(inplace=True)

# preprocessor = ColumnTransformer(
#     transformers=[
#         ('num', StandardScaler(), numerical_features),
#         ('cat', OneHotEncoder(), categorical_features)
#     ])

# prepared_data = preprocessor.fit_transform(temp)

# kmeans = KMeans(n_clusters=5, random_state=42)
# temp['cluster'] = kmeans.fit_predict(prepared_data)

# print("TEMP:\n", temp)



@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/test', methods=['GET'])
def test():
    return "Hello"

# @app.route('/keys', methods=['GET'])
# def keys_pie_chart():
#     return get_keys_pie_chart_data(df)

@app.route('/top30', methods=['GET'])
def top30():
    return get_top_30(df)

@app.route('/modes', methods=['POST'])
def modes_pie_chart():
    columnName = request.get_json().get('columnName')
    filters = request.get_json().get('filters')
    print("In modes: ", columnName, filters)
    
    filtered_df = df
    if filters and columnName:
        filtered_df = df[df[columnName].isin(filters[0])] # filters[0] because filters is a list of lists
        
    return get_modes_pie_chart_data(filtered_df)


@app.route('/radar', methods=['POST'])
def radar_chart():
    columnName = request.get_json().get('columnName')
    filters = request.get_json().get('filters')
    print("In radar: ", columnName, filters)
    
    filtered_df = df
    if filters and columnName:
        filtered_df = df[df[columnName].isin(filters[0])] # filters[0] because filters is a list of lists
        
    return get_radar_chart_data(filtered_df)



@app.route('/treemap', methods=['POST'])
def treemap():
    columnName = request.get_json().get('columnName')
    filters = request.get_json().get('filters')
    print("In treemap: ", columnName, filters)
    
    filtered_df = df
    if filters and columnName:
        filtered_df = df[df[columnName].isin(filters[0])] # filters[0] because filters is a list of lists
        
    data = get_key_distribution(filtered_df)
    return jsonify(data)


@app.route('/bubblechart', methods=['POST'])
def bubble_chart():
    columnName = request.get_json().get('columnName')
    filters = request.get_json().get('filters')
    print("In bubblechart: ", columnName, filters)
    
    filtered_df = df
    if filters and columnName:
        filtered_df = df[df[columnName].isin(filters[0])] # filters[0] because filters is a list of lists
        
    data = get_genre_distribution(filtered_df)
    return jsonify(data)


@app.route('/pcp', methods=['POST'])
def pcp():

    # Filtering not possible in case of selected songs        
    columnName = request.get_json().get('columnName')
    filters = request.get_json().get('filters')
    print("In pcp: ", columnName, filters)

    
    filtered_df = df
    if (filters and columnName) and columnName != 'track_name':
        filtered_df = df[df[columnName].isin(filters[0])] # filters[0] because filters is a list of lists
        
    temp = filtered_df.drop(["genre", "track_name", "artist(s)_name"], axis=1)

    categorical_features = ["key", "mode"]
    numerical_features = ["artist_count" ,"released_year","released_month","released_day","in_spotify_playlists","in_spotify_charts","streams","in_apple_playlists","in_apple_charts","in_deezer_playlists","in_deezer_charts","in_shazam_charts","bpm","danceability_%","valence_%","energy_%","acousticness_%","instrumentalness_%","liveness_%","speechiness_%","duration_ms"]

    for column in numerical_features:
        temp[column] = temp[column].apply(convert_to_float)

    temp.dropna(inplace=True)

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(), categorical_features)
        ])

    prepared_data = preprocessor.fit_transform(temp)

    kmeans = KMeans(n_clusters=5, random_state=42)
    temp['cluster'] = kmeans.fit_predict(prepared_data)
    
    platform = request.get_json().get('platform')
    features = []
    if platform == 'playlist':
        features = ["in_spotify_playlists", "in_apple_playlists", "in_deezer_playlists", "cluster"]
    elif platform == 'chart':
        features = ["in_spotify_charts", "in_apple_charts", "in_deezer_charts", "in_shazam_charts", "cluster"]

    return jsonify(temp[features].to_dict(orient='records'))
    # return jsonify(temp[features].to_json(orient='records'))

@app.route('/get_percentage', methods=['GET'])
def get_percentage():
    # columnName = request.get_json().get('columnName')
    # filters = request.get_json().get('filters')
    # print("In bubblechart: ", columnName, filters)
    
    # filtered_df = df
    # if filters and columnName:
    #     filtered_df = df[df[columnName].isin(filters[0])] # filters[0] because filters is a list of lists
        
    # # Example calculation: find percentage of data above a certain threshold ======= perform ur calculations over here
    # threshold = 5
    # total_count = filtered_df.shape[0]
    # filtered_count = filtered_df[filtered_df['value'] > threshold].shape[0]
    # percentage = (filtered_count / total_count) * 100

    # Return the calculated percentage
    return jsonify({'percentage': 95})

@app.route('/song_count', methods=['GET'])
def song_count():
    # Load your data
    # df = pd.read_csv('./data/songs.csv')  # Assume your data file is named 'songs.csv'

    # # Count the songs (customize this if you need to filter the data)
    # count = df.shape[0]

    # Return the count
    return jsonify({'song_count': 800})

@app.route('/sonority_index', methods=['GET'])
def sonority_index():
    # Load your data
    # df = pd.read_csv('./data/songs.csv')  # Assume your data file is named 'songs.csv'

    # # Count the songs (customize this if you need to filter the data)
    # count = df.shape[0]
    print('hi')
    # Return the count
    return jsonify({'index': 5.5})



if __name__ == '__main__':
    app.run(port=5001, debug=True)
