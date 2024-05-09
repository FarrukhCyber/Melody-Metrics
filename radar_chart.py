from flask import jsonify

def get_radar_chart_data(df):
    # Sort the dataset by streams and pick the top 3
    top_songs = df.sort_values(by='streams', ascending=False).head(3)
    print("TOP SONGS:", top_songs)
    
    # Select the relevant attributes for the radar chart
    radar_data = top_songs[['track_name', 'danceability_%', 'valence_%', 'energy_%', 
                            'acousticness_%', 'instrumentalness_%', 'liveness_%', 'speechiness_%']]
    
    radar_data = radar_data.rename(columns={'danceability_%': 'danceability',
                        'valence_%': 'valence',
                        'energy_%': 'energy',
                        'acousticness_%': 'acousticness',
                        'instrumentalness_%': 'instrumentalness',
                        'liveness_%': 'liveness',
                        'speechiness_%': 'speechiness',
                        })

    
    # Convert the data to a list of dictionaries (one for each song), suitable for JSON serialization
    radar_json = radar_data.to_dict(orient='records')
    return jsonify(radar_json)