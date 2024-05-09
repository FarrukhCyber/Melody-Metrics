import { createKeysPieChart } from './keysPieChart.js'
import { createTop30BarChart } from './top30tracks.js'
import {createModesPieChart} from './modesPieChart.js'
import {createRadarChart} from './radarChart.js'
import { createTreemap } from './treemap.js'
import { createBubbleChart } from './bubbleChart.js'
import { createParallelCoordinatesPlot } from './pcp.js'
import { drawPercentage } from './percentage.js'
import { globalState } from "./globalState.js";


// var platform = 'playlist'

function renderPlots() {
    createTop30BarChart()
    createModesPieChart()
    createRadarChart()
    createTreemap()
    createBubbleChart()
    createParallelCoordinatesPlot(NaN, NaN, 'playlist' )
    drawPercentage()
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

        return
    }

    // For interactivity with MODES pieChart
    if (columnName == 'key') {
        console.log("inside key section of updatePlots")
        createTop30BarChart(columnName, filters)
        createModesPieChart(columnName, filters)
        createBubbleChart(columnName, filters)
        createParallelCoordinatesPlot(columnName, filters, platform)
        createRadarChart(columnName, filters)
        return
    }



}


globalState.subscribe(updatePlots);
renderPlots()

// export const TEST = {"hello": 12} 
