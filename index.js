const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

//TODO: Create Djkstra algorithm and route person without startDateTime factors
//TODO: Find route from start to end destination
//TODO: Add in time factor

const trainMap = new Map()
const interMap = new Map()
const trainCodeList = []
const trainName = []
const parents = new Array(166)
const pathListIndex = []

let dist = new Array()
var currentVertices = 0 

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

// Helper Function Create adjacency matrix
 function createAdjMatrix(rows,columns){
    // console.log('Entry into createAdjMatrix func')
    //Create 2D array
    const zeros = Array.from(Array(rows), _ => Array(columns).fill(0));
    for(let i =0; i < rows; i++){
        var currentVerticeTrainCode = trainCodeList[i].slice(0,2) 
        // console.log(i)
        for(let j =0; j < columns; j++){
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
                //TODO: Add the values of the time between current and previous station 
                zeros[i][j-1] = 10
            }
            // Check if next station alphabet code is the same AND next one is a number and the current vertice is being worked on
            if(currentVerticeTrainCode === nextVerticeTrainCode && i===j){
                //TODO: Add the values of the time between current and next station 
                zeros[i][j+1] = 10
            }
            //Check if this is the current vertice and check if the current train station is a interchange
            if(i===j && interMap.has(trainName[j])){
                interchangeTrainCodes = Object.values(interMap.get(trainName[j])).filter(value => value != trainCodeList[j])
                //   console.log('Type of interchangeTrainCodes '+typeof interchangeTrainCodes +" "+ interchangeTrainCodes,'Length of traincodes'+ interchangeTrainCodes.length)
                for(let k = 0; k < interchangeTrainCodes.length;k++){
                    //Need to check code
                    zeros[i][trainCodeList.indexOf(interchangeTrainCodes[k]) ] =  10
                    // console.log(`Added interchange ${interchangeTrainCodes[k]}`)
                    // console.log(`Added interchange ${trainCodeList.indexOf(interchangeTrainCodes[k])}`)
                }
                // To assign value of interchange wait time
            }
        }
    }
     return zeros
    // return console.log(zeros[23])

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
	console.log("Train \t\t\t\t Distance from Source \t\t\t Path");
	// for(let i = 0; i < currentVertices; i++)
	// {
	// 	console.log( i ," ",trainName[i] + " \t\t\t\t " +
	// 			dist[i]+"\t\t\t"+printPath(i,parents,array));
	// }
    process.stdout.write(trainName[target]+ "\t\t\t\t"+dist[target]+"\t\t\t\t")
    printPath(target,parents)
    
    
    console.log(`\nTrain from ${trainName[src]} to ${trainName[target]} takes ${dist[target]} mins minimally`)
}

function printPath(currentVertex,parents,){
    if(currentVertex == -1){
        return;
    }
    printPath(parents[currentVertex],parents)
    process.stdout.write(trainCodeList[currentVertex] +" ")
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
	for(let count = 0; count < V - 1 && !minDistanceFound; count++)
	{
		
		// Pick the minimum distance vertex
		// from the set of vertices not yet
		// processed. u is always equal to
		// src in first iteration.
		let u = minDistance(dist, sptSet);
		// Mark the picked vertex as processed
		sptSet[u] = true;
		
		// Update dist value of the adjacent
		// vertices of the picked vertex.
		for(let v = 0; v < V; v++)
		{
			
			// Update dist[v] only if is not in
			// sptSet, there is an edge from u
			// to v, and total weight of path
			// from src to v through u is smaller
			// than current value of dist[v]
			if (!sptSet[v] && graph[u][v] != 0 && dist[u] != Number.MAX_VALUE && dist[u] + graph[u][v] < dist[v])
			{
                parents[v] = u
                //shortestDistances[vertexIndex] = shortestDistance + edgeDistance
				dist[v] = dist[u] + graph[u][v];
			}
		}
	}
	// Print the constructed distance array
	printSolution(dist,src,target);
}


async function driver(){
    await readCSV()
    var matrix =  await createAdjMatrix(166,166)
    var timeTaken = await dijkstra(matrix,79,128,166)
}

driver()
