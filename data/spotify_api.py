import requests
import base64
import pandas as pd

client_id = '9777e7968e5549faa3fae450b8a57972'
client_secret = 'a9f2e418cd764f449087caed98b803ac'

# Encode the client ID and client secret
client_creds = f"{client_id}:{client_secret}"
client_creds_b64 = base64.b64encode(client_creds.encode()).decode()

# Obtain the token
auth_url = 'https://accounts.spotify.com/api/token'
auth_headers = {
    'Authorization': f'Basic {client_creds_b64}'
}
auth_data = {
    'grant_type': 'client_credentials'
}

auth_response = requests.post(auth_url, headers=auth_headers, data=auth_data)
access_token = auth_response.json().get('access_token')
# print(access_token)


def search_track(track_name, access_token):
    search_url = "https://api.spotify.com/v1/search"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    params = {
        'q': track_name,
        'type': 'track',
        'limit': 1  # You can adjust the limit based on how many results you want
    }
    response = requests.get(search_url, headers=headers, params=params)
    results = response.json()
    tracks = results.get('tracks', {}).get('items', [])
    if tracks:
        return tracks[0]['id']  # Returns the ID of the first matching track
    else:
        return None  # No match found
    
def fetch_track_data(track_id, access_token):
    track_url = f"https://api.spotify.com/v1/tracks/{track_id}"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.get(track_url, headers=headers)
    return response.json()  # This will return a JSON with track details including duration

def fetch_artist_genre(artist_id, access_token):
    artist_url = f"https://api.spotify.com/v1/artists/{artist_id}"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.get(artist_url, headers=headers)
    artist_data = response.json()
    return artist_data.get('genres', [])  # This returns a list of genres associated with the artist






# Load your CSV file
df = pd.read_csv('spotify-2023.csv')  # Replace 'path_to_your_file.csv' with your actual file path
# Add empty columns for the new data
df['Genre'] = None
df['Duration_ms'] = None


for index, row in df.iterrows():
    track_name = row['track_name']  # Ensure the column name matches your CSV
    track_id = search_track(track_name, access_token)  # Use the function to search by track name

    if track_id:
        track_data = fetch_track_data(track_id, access_token)
        if track_data:
            df.at[index, 'Duration_ms'] = track_data.get('duration_ms')
            # Assuming you want the genre of the first listed artist
            artist_id = track_data['artists'][0]['id']
            genres = fetch_artist_genre(artist_id, access_token)
            df.at[index, 'Genre'] = ', '.join(genres)  # Join genres with a comma if there are multiple
            print(track_name, track_data.get('duration_ms'), df.at[index, 'Genre'])

    else:
        print(f"Track not found for: {track_name}")

df.to_csv('updated_file.csv', index=False)  # Save the updated DataFrame to a new CSV file





