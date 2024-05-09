import { globalState } from "./globalState.js";

// Fetch the mode distribution from the Flask backend
async function fetchDuration(columnName, filters) {

  const response = await fetch("/duration", {
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

export async function createSongDuration(columnName=NaN, filters=NaN) {
    try {

        const data = await fetchDuration(columnName, filters);
        if (data && data.duration !== undefined) {
            d3.select('#avgDuration').text(data.duration.toLocaleString());
        } else {
            console.error('Duration not found in response');
        }
    } catch (error) {
        console.error('Failed to fetch duration:', error);
        d3.select('#avgDuration').text('Failed to load data');
    }
}

