from flask import jsonify

def get_modes_pie_chart_data (df):
    mode_counts = df['mode'].value_counts().to_dict()
    return jsonify(mode_counts)