import { globalState } from "./globalState.js";

// Fetch the mode distribution from the Flask backend
async function fetchSongCount(columnName, filters) {

  const response = await fetch("/song_count", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({columnName: columnName, filters: filters }),
  });
  const data = await response.json();
  console.log("CHECK:", data);
  return data;
}

export async function createSongCount(columnName=NaN, filters=NaN) {
    try {

        const data = await fetchSongCount(columnName, filters);
        if (data && data.song_count !== undefined) {
            d3.select('#songCount').text(data.song_count.toLocaleString());
        } else {
            console.error('Song count not found in response');
        }
    } catch (error) {
        console.error('Failed to fetch song count:', error);
        d3.select('#songCount').text('Failed to load data');
    }
}

