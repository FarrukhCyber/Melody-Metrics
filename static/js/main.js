import { createKeysPieChart } from './keysPieChart.js'
import { createTop30BarChart } from './top30tracks.js'
import {createModesPieChart} from './modesPieChart.js'
import {createRadarChart} from './radarChart.js'
import { createTreemap } from './treemap.js'
import { createBubbleChart } from './bubbleChart.js'
import { createParallelCoordinatesPlot } from './pcp.js'
import { drawPercentage } from './percentage.js'
import { globalState } from "./globalState.js";
import { createSongCount } from './updateSongCount.js'
import { createSongDuration } from './updateDuration.js'


// var platform = 'playlist'

function renderPlots(columnName, filters) {
    createTop30BarChart(columnName, filters)
    createModesPieChart(columnName, filters)
    createRadarChart(columnName, filters)
    createTreemap(columnName, filters)
    createBubbleChart(columnName, filters)
    createParallelCoordinatesPlot(columnName, filters, 'playlist' )
    drawPercentage(columnName, filters)
    createSongCount(columnName, filters)
    createSongDuration(columnName, filters)
}


function updatePlots(columnName, filters, wasReset, platform) {
    console.log("INSIDE UPDATE PLOT")
    console.log("PASSED:", filters, columnName)

    // for reset
    if (wasReset) {
        console.log("inside reset check")
        renderPlots()
        return
    }

    // for handling charts and playlist of pcp
    if(columnName == 'pcp') {
        // platform = filters[0][0][0] // dont know what is going on
        console.log("platform in updatePlots:", platform)
        createParallelCoordinatesPlot(NaN, NaN, platform)
    }


    // For interactivity with barplot
    if (columnName == 'track_name') {
        console.log("inside track_name section of updatePlots")
        createModesPieChart(columnName, filters)
        createTreemap(columnName, filters)
        createBubbleChart(columnName, filters)
        createParallelCoordinatesPlot(columnName, filters, platform)
        createRadarChart(columnName, filters)
        createSongCount(columnName, filters)
        drawPercentage(columnName, filters)
        createSongDuration(columnName, filters)

        return
    }

    // For interactivity with MODES pieChart
    if (columnName == 'mode') {
        console.log("inside mode section of updatePlots")
        createTop30BarChart(columnName, filters)
        createTreemap(columnName, filters)
        createBubbleChart(columnName, filters)
        createParallelCoordinatesPlot(columnName, filters, platform)
        createRadarChart(columnName, filters)
        createSongCount(columnName, filters)
        drawPercentage(columnName, filters)
        createSongDuration(columnName, filters)

        return
    }

    // For interactivity with key pieChart
    if (columnName == 'key') {
        console.log("inside key section of updatePlots")
        createTop30BarChart(columnName, filters)
        createModesPieChart(columnName, filters)
        createBubbleChart(columnName, filters)
        createParallelCoordinatesPlot(columnName, filters, platform)
        createRadarChart(columnName, filters)
        createSongCount(columnName, filters)
        drawPercentage(columnName, filters)
        createSongDuration(columnName, filters)
        return
    }



}

//============= BPM FILTER ===========================================

document.addEventListener('DOMContentLoaded', function() {
    const bpmValues = [0, 65, 67, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 160, 161, 162, 163, 164, 165, 166, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 186, 188, 189, 192, 196, 198, 200, 202, 204, 206];
    const dropdownButton = document.getElementById('dropdownMenuButton1');
    const bpmDropdown = document.getElementById('bpmDropdown');
    const blinker = document.getElementById('blinker');

    bpmValues.forEach(bpm => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.classList.add('dropdown-item');
        a.href = '#';
        a.textContent = bpm === 0 ? 'Select BPM' : `${bpm} BPM`;
        a.onclick = function() {
            updateBlinkingSpeed(bpm);
            dropdownButton.textContent = bpm === 0 ? 'Select BPM' : `${bpm} BPM`;
            dropdownButton.appendChild(document.createElement("span")).classList.add("caret");
            if (bpm === 0) {
                renderPlots(NaN, NaN); // Call renderPlots with NaN when "Select BPM" is selected
            } else {
                renderPlots('bpm', [[bpm]]);
            }
        };
        li.appendChild(a);
        bpmDropdown.appendChild(li);
    });

    let blinkingInterval = null;

    function updateBlinkingSpeed(bpm) {
        const blinkSpeed = bpm === 0 ? null : 60000 / bpm;
        if (blinkingInterval) clearInterval(blinkingInterval);
        if (blinkSpeed !== null) {
            blinkingInterval = setInterval(() => {
                blinker.style.visibility = (blinker.style.visibility === 'hidden' ? 'visible' : 'hidden');
            }, blinkSpeed / 2);
        } else {
            blinker.style.visibility = 'hidden';
        }
    }
});
//====================================================================


// =========================DATE FILTER===================================================
async function fetchValidation(columnName, filters) {

    const response = await fetch("/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({columnName: columnName, filters: filters}),
      });
      const data = await response.json();
      console.log("CHECK %:", data);
      return data;
}

const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const resetDatesButton = document.getElementById('resetDates');

// Add event listeners to the input elements
startDateInput.addEventListener('change', checkAndHandleDateChange);
endDateInput.addEventListener('change', checkAndHandleDateChange);

// Add event listener to the reset button
resetDatesButton.addEventListener('click', resetDates);

// Function to check if both dates are selected and handle the date change
function checkAndHandleDateChange() {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (startDate && endDate) {
    handleDateChange(startDate, endDate);
  }
}

// Function to handle the date change event
async function handleDateChange(startDate, endDate) {
  // Do something with the selected start and end dates
  console.log('Start Date:', startDate);
  console.log('End Date:', endDate);

  const {valid} = await fetchValidation('date', [[startDate, endDate]])
  if (valid) {
      console.log("valid")
      renderPlots('date', [[startDate, endDate]]);
  }
  else {
    alert("In correct dates or there are no songs in the range")
  }

  // You can call a function or perform any other desired operation here
  // For example, you could pass the selected dates to a function like:
  // filterDataByDate(startDate, endDate);
}

// Function to reset the start and end date inputs
function resetDates() {
  console.log("Dates reset")
  startDateInput.value = '';
  endDateInput.value = '';
  renderPlots(NaN, NaN);
}

// =================================================================================
globalState.subscribe(updatePlots);
globalState.subscribe(updatePlots);
renderPlots(NaN, NaN)

