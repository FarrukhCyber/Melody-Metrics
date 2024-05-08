def get_genre_distribution(df):
    genre_counts = {}
    # genres = df['genre'].split(", ").strip()
    for genres in df['genre']:
        if type(genres) is not str:
            continue
        split_genres = genres.split(", ")
        for genre in split_genres:
            if genre in genre_counts:
                genre_counts[genre] += 1
            else:
                genre_counts[genre] = 1
    return [{"genre": genre, "count": count} for genre, count in genre_counts.items()]
    