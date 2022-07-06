const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const moment = require('moment')

//TODO: Create Djkstra algorithm and route person without startDateTime factors
//TODO: Find route from start to end destination
//TODO: Change argument to locations instead of traincode
//TODO: Write conditions to remove the weight if starting from a wrong station

const trainMap = new Map()
const interMap = new Map()
const trainCodeList = []
const trainName = []
const parents = new Array(166)
const pathListIndex = []

var dist = new Array()
var currentVertices = 0 
var timeTaken = 0


function readCSV(){
    return new Promise((resolve)=>{
    fs.createReadStream(path.resolve(__dirname, 'assets', 'StationMap.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
        trainCodeList.push(row.stationCode)
        trainName.push(row.stationName)
        if(trainMap.has(row.stationName)){
                currentValue = trainMap.get(row.stationName)
                trainMap.set(row.stationName, currentValue.concat(row.stationCode))
                interMap.set(row.stationName, currentValue.concat(row.stationCode))
                // console.log(interChangeIndex+' ' + row.stationName,' is an interchange connected via ',trainMap.get(row.stationName))
                //Count the number of interchanges in Singapore
         }
        else{
                trainMap.set(row.stationName,new Array(row.stationCode))
        }
        // console.log(row)
    })
    .on('end', rowCount => {
        console.log(`Total amount of train stations amount to ${rowCount}`)
        console.log(`Total amount of interchanges amount to ${interMap.size}`)
        currentVertices = rowCount
        // console.log(trainCodeList)
        resolve(rowCount)
    });
    }
)}

//TODO: Create addition function argument dateTime to determine weight to use per edge
// Helper Function to create adjacency matrix
 function createAdjMatrix(vertices){
    // console.log('Entry into createAdjMatrix func')
    //Create 2D array
    const graph = Array.from(Array(vertices), _ => Array(vertices).fill(0));
    for(let i =0; i < vertices; i++){
        var currentVerticeTrainCode = trainCodeList[i].slice(0,2) 
        // console.log(i)
        for(let j =0; j < vertices; j++){
            //Check if there is adjacent train station in the previous and exist
            if(trainCodeList[j-1]){
                var previousVertice = trainCodeList[j-1]
                var previousVerticeTrainCode = previousVertice.slice(0,2)
            }

            if(trainCodeList[j+1]){
                var nextVertice = trainCodeList[j+1]
                var nextVerticeTrainCode = nextVertice.slice(0,2)
            }
            // Check if previous station alphabet code is the same AND previous one is a number and the current vertice is being worked on
            if(currentVerticeTrainCode === previousVerticeTrainCode && i===j){
                //TODO: To add switch-case to calculate weight of edge i.e current time period and current stationline, put all weight as 10 for base assignment
                graph[i][j-1] = 10
            }
            // Check if next station alphabet code is the same AND next one is a number and the current vertice is being worked on
            if(currentVerticeTrainCode === nextVerticeTrainCode && i===j){
                //TODO: To add switch-case to calculate weight of edge i.e current time period and current stationline
                graph[i][j+1] = 10
            }
            //TODO: To add switch-case to calculate weight of edge i.e current time period and current stationline, put all weight as 10 for base assignment
            if(i===j && interMap.has(trainName[j])){
                interchangeTrainCodes = Object.values(interMap.get(trainName[j])).filter(value => value != trainCodeList[j])
                //   console.log('Type of interchangeTrainCodes '+typeof interchangeTrainCodes +" "+ interchangeTrainCodes,'Length of traincodes'+ interchangeTrainCodes.length)
                for(let k = 0; k < interchangeTrainCodes.length;k++){
                    //Need to check code
                    graph[i][trainCodeList.indexOf(interchangeTrainCodes[k])] =  10                   
                }
                // To assign value of interchange wait time
            }
        }
    }
     return graph
}

// A utility function to find the vertex with minimum distance value, from the set of vertices
// not yet included in shortest path tree
function minDistance(dist,sptSet)
{
	// Initialize min value
	let min = Number.MAX_VALUE;
	let min_index = -1;
	
	for(let v = 0; v < currentVertices; v++)
	{
		if (sptSet[v] == false && dist[v] <= min)
		{
			min = dist[v];
			min_index = v;
		}
	}
	return min_index;
}

// A utility function to print
// the constructed distance array
function printSolution(dist,src,target)
{
    timeTaken = dist[target]
	console.log("Train \t\t\t\t Distance from Source \t\t\t Path");
    process.stdout.write(trainName[target]+ "\t\t\t\t"+dist[target]+"\t\t\t\t")
    getPath(target,parents)
    console.log(`\nTrain from ${trainName[src]} to ${trainName[target]} takes ${timeTaken} mins minimally`)
    console.log("\b")
}

function getPath(currentVertex,parents,){
    if(currentVertex == -1){
        return;
    }
    pathListIndex.push(currentVertex)
    getPath(parents[currentVertex],parents)
    process.stdout.write(trainCodeList[currentVertex] +" ")

}

function printPath(pathList){
    let orderedPathList = pathList.reverse()

    if(trainName[orderedPathList[orderedPathList.length - 1]] == trainName[orderedPathList[orderedPathList.length - 2]]){
        orderedPathList.pop()
    }

    for(let i =0; i< orderedPathList.length-1;i++ ){
        let currentStation = orderedPathList[i]
        let nextStation = orderedPathList[i+1]
        let currentTrainCodeLetters = trainCodeList[currentStation].slice(0,2)
        let currentTrain = trainName[currentStation]
        let nextTrainCodeLetters = trainCodeList[nextStation].slice(0,2)
        let nextTrain = trainName[nextStation]
        
        if(nextTrainCodeLetters == currentTrainCodeLetters){
            console.log(`Take ${currentTrainCodeLetters} from ${currentTrain} to ${nextTrain}`)
        }
        if(nextTrainCodeLetters != currentTrainCodeLetters){
            console.log(`Change from ${currentTrainCodeLetters} line to ${nextTrainCodeLetters} line`)
        }
    }   
}

//Utility function to calculate the time from src to destination station factoring peak/off-peak and night trains
function calculatimeTimeTaken(pathList,srcTime){
    let pathLength = pathList.length
    let lastIndexPathList = pathLength - 1
    let currentTime = srcTime
    let actualTimeTaken = 0
    let timeFormat = 'HH:mm'
    let iteration = 0
    let noRouteFound = false
    // || noRouteFound == false

    if(trainName[pathList[lastIndexPathList]] == trainName[pathList[lastIndexPathList-1]]){
        orderedPathList.pop()
    }

    for(let i = 0 ;i <pathList.length - 1;i++ ){
        let currentStation = pathList[i]
        let nextStation = pathList[i+1]
        let currentTrainCodeLetters = trainCodeList[currentStation].slice(0,2)
        let currentTrain = trainName[currentStation]
        let nextTrainCodeLetters = trainCodeList[nextStation].slice(0,2)
        let nextTrain = trainName[nextStation]

        let dayOfWeek = currentTime.day()
        let currentHour = currentTime.hour()

        switch(true){
            //Peak Period Case
            case (currentTime.isBetween(moment('06:00',timeFormat),moment('09:00',timeFormat)) || currentTime.isBetween(moment('18:00',timeFormat),moment('21:00',timeFormat)) && (dayOfWeek !== 6) || (dayOfWeek  !== 0)):{
                let peakStations = ['NS','NE']
                if(currentTrainCodeLetters.includes(nextTrainCodeLetters) && peakStations.includes(currentTrainCodeLetters)){
                    actualTimeTaken += 12
                    currentTime.add(12,'minutes')
                    break
                }
                //Currently going through an interchange
                if(currentTrain.includes(nextTrain)){
                    actualTimeTaken += 15
                    currentTime.add(15,'minutes')
                    break
                }
                
            }
            //Night Period Case
            case (currentHour > 22) && currentHour < 6:{
                console.log('Entering night case with hour '+currentHour)
                let nonNightStations = ['CG','DT','CE']
                if(nonNightStations.includes(currentTrainCodeLetters)){
                    // console.log("No Route found to destination")
                    noRouteFound =true 
                    break
                }
                if(currentTrainCodeLetters.includes(nextTrainCodeLetters) && currentTrainCodeLetters.includes('TE')){
                    actualTimeTaken += 8
                    //Minus current time for TE lines in non-peak hours
                    currentTime.add(8,'minutes')
                    break
                }
                
            }
            //Non-Peak Period Case
            default:{
                let noPeakTrainCode = ['DT','TE']
                //Check if current train station code is the same as next train code letters. Check also with they are DT or TE line
                if(currentTrainCodeLetters.includes(nextTrainCodeLetters) && noPeakTrainCode.includes(currentTrainCodeLetters)){
                    console.log('Entering off-peak case with hour '+currentHour)
                    actualTimeTaken += 8
                    currentTime.add(8,'minutes')
                    break
                }else{
                    currentTime.add(10,'minutes')
                    actualTimeTaken += 10 
                    break
                }
                
                 
                               
            }
        }
        console.log("Time:" +currentTime +' Index'+i + " " + actualTimeTaken);
        // (`${i}, time taken passed`)
    }

    return console.log(actualTimeTaken)
}


// Function that implements Dijkstra's
// single source shortest path algorithm
// for a graph represented using adjacency
// matrix representation
function dijkstra(graph, src,target,V)
{
    dist = new Array(V);
	let sptSet = new Array(V);
	
	// Initialize all distances as
	// INFINITE and stpSet[] as false
	for(let i = 0; i < V; i++)
	{
		dist[i] = Number.MAX_VALUE;
		sptSet[i] = false;
	}
	
	// Distance of source vertex
	// from itself is always 0
    parents[src] = -1
	dist[src] = 0;
	minDistanceFound = false
	// Find shortest path for all vertices
	for(let count = 0; count < V - 1 && !minDistanceFound; count++){
		
		// Pick the minimum distance vertex from the set of vertices not yet processed. u is always equal to src in first iteration.
		let u = minDistance(dist, sptSet);
		// Mark the picked vertex as processed
		sptSet[u] = true;
		
		// Update dist value of the adjacent vertices of the picked vertex.
		for(let v = 0; v < V; v++){
			// Update dist[v] only if is not in sptSet, there is an edge from u to v, and total weight of path from src to v through u is smaller than current value of dist[v]
			if (!sptSet[v] && graph[u][v] != 0 && dist[u] != Number.MAX_VALUE && dist[u] + graph[u][v] < dist[v]){
                parents[v] = u
				dist[v] = dist[u] + graph[u][v];
			}
		}
	}
	// Print the constructed distance array
	printSolution(dist,src,target);
}


async function driver(){
    await readCSV()
    var matrix =  await createAdjMatrix(166)
    var timeTaken = await dijkstra(matrix,53,68,166)
    printPath(pathListIndex)
    calculatimeTimeTaken(pathListIndex,moment('2019-01-31T06:00'),150)
}

driver()
