from flask import jsonify

def get_top_30(df):
    # Sort the DataFrame by 'streams', get the top 30, and reset the index
    temp = df.sort_values(by='streams', ascending=False).head(20).reset_index(drop=True)
    

    if 'track_name' in df.columns:
        temp = temp[['streams', 'track_name']]
    else:
        # Handle the case where 'track_name' is not a column
        print("Error: 'track_name' column not found in DataFrame")
        return jsonify([])  # Return an empty list in JSON format if the required column is missing

    # Convert DataFrame to dictionary for JSON response
    return jsonify(temp.to_dict('records'))



    