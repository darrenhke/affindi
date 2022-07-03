const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const trainMap = new Map()
const interMap = new Map()
const trainCodeList = []
const trainName = []
var interChangeIndex = 0

fs.createReadStream(path.resolve(__dirname, 'assets', 'StationMap.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
        trainCodeList.push(row.trainCode)
        trainName.push(row.stationName)
        if(trainMap.has(row.stationName)){
                currentValue = trainMap.get(row.stationName)
                trainMap.set(row.stationName, [currentValue+ ',' +row.stationCode])
                interMap.set(row.stationName, [currentValue+ ',' +row.stationCode])
                console.log(interChangeIndex+' ' + row.stationName,' is an interchange connected via ',trainMap.get(row.stationName))
                interChangeIndex++

         }
        else{
                trainMap.set(row.stationName,[row.stationCode])
        }
        // console.log(row)
    })
    .on('end', rowCount => {
        console.log(`Total amount of train stations amount to ${rowCount}`)
        console.log(`Total amount of interchanges amount to ${interMap.size}`)
    });


// Helper Function Create adjacency matrix
function createAdjMatrix(rows,columns){
    //Create 2D array
    var rows = rows
    var columns = columns
    const zeros = (rows, columns) => [...Array(rows)].map(e => Array(columns).fill(0));

    for(let i =0; i < rows.length; i++){
        var currentVerticeTrainCode = trainCodeList[i].slice(0,2) 
        for(let j =0; i < columns.length; j++){
            //Check if there is adjacent train station in the previous 
            var previousVertice = trainCodeList[j-1]
            var previousVerticeTrainCode = previousVertice.splice(0,2)
            var previousVerticeTrainNumber = previousVertice.splice(2,previousVertice.length)

            var nextVertice = trainCodeList[j+1]
            var nextVerticeTrainCode = nextVertice.splice(0,2)
            var nextVerticeTrainNumber = nextVertice.splice(2,previousVertice.length)
            // Check if previous station alphabet code is the same AND previous one is a number and the current vertice is being worked on
            if(currentVerticeTrainCode === previousVerticeTrainCode && previousVerticeTrainNumber === typeof number  && i===j){
                //TODO: Add the values of the time between current and previous station 
            }
            // Check if next station alphabet code is the same AND next one is a number and the current vertice is being worked on
            if(currentVerticeTrainCode === nextVerticeTrainCode && nextVerticeTrainNumber === typeof number  && i===j){
                //TODO: Add the values of the time between current and next station 
            }
            //Check if this is the current vertice and check if the current train station is a interchange
            if(i===j && interMap.has(trainName[j])){
                interchangeTrainCodes = interMap.get(trainName[j])
                interchangeTrainCodes.forEach((value) => {
                    // To assign value of interchange wait time
                    //columns[trainCodeList.indexOf(value)] = 
                })
            }
        }
    }
    return zeros

}