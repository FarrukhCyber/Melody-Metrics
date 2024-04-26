from flask import jsonify

def get_keys_pie_chart_data(df):
        # Count the occurrences of each key
    key_counts = df['key'].value_counts().reset_index()
    key_counts.columns = ['key', 'count']
    # Convert DataFrame to dictionary for JSON response
    return jsonify(key_counts.to_dict('records'))
    