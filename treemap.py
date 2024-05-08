def get_key_distribution(df):
    key_count = df['key'].value_counts().reset_index()
    key_count.columns = ['key', 'count']
    return key_count.to_dict(orient='records')