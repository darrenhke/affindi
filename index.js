const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

//TODO: Create Djkstra algorithm and route person without startDateTime factors
//TODO: Add in time factor
//TODO: Remove user from 

const trainMap = new Map()
const interMap = new Map()
const trainCodeList = []
const trainName = []
var interChangeIndex = 0

function readCSV(){
    return new Promise((resolve,reject)=>{
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
                console.log(interChangeIndex+' ' + row.stationName,' is an interchange connected via ',trainMap.get(row.stationName))
                interChangeIndex++

         }
        else{
                trainMap.set(row.stationName,new Array(row.stationCode))
        }
        // console.log(row)
    })
    .on('end', rowCount => {
        console.log(`Total amount of train stations amount to ${rowCount}`)
        console.log(`Total amount of interchanges amount to ${interMap.size}`)
        console.log(trainCodeList)
        resolve(rowCount)
    });
    }
)}

// Helper Function Create adjacency matrix
 function createAdjMatrix(rows,columns){
    console.log('Entry into createAdjMatrix func')
    //Create 2D array
    const zeros = Array.from(Array(rows), _ => Array(columns).fill(0));
    for(let i =0; i < rows; i++){
        var currentVerticeTrainCode = trainCodeList[i].slice(0,2) 
        console.log(i)
        for(let j =0; j < columns; j++){
            console.log(`Inner loop ${j}`)
            //Check if there is adjacent train station in the previous and exist
            if(trainCodeList[j-1]){
                var previousVertice = trainCodeList[j-1]
                var previousVerticeTrainCode = previousVertice.slice(0,2)
                var previousVerticeTrainNumber = previousVertice.slice(2,previousVertice.length)
            }

            if(trainCodeList[j+1]){
                var nextVertice = trainCodeList[j+1]
                var nextVerticeTrainCode = nextVertice.slice(0,2)
                var nextVerticeTrainNumber = nextVertice.slice(2,nextVertice.length)
            }
            // Check if previous station alphabet code is the same AND previous one is a number and the current vertice is being worked on
            if(currentVerticeTrainCode === previousVerticeTrainCode && i===j){
                //TODO: Add the values of the time between current and previous station 
                zeros[i][j-1] = 10
                console.log('Added previous')
            }
            // Check if next station alphabet code is the same AND next one is a number and the current vertice is being worked on
            if(currentVerticeTrainCode === nextVerticeTrainCode && i===j){
                //TODO: Add the values of the time between current and next station 
                zeros[i][j+1] = 10
                console.log('Added next')
            }
            //Check if this is the current vertice and check if the current train station is a interchange
            if(i===j && interMap.has(trainName[j])){
                interchangeTrainCodes = Object.values(interMap.get(trainName[j])).filter(value => value != trainCodeList[j])
                  console.log('Type of interchangeTrainCodes '+typeof interchangeTrainCodes +" "+ interchangeTrainCodes,'Length of traincodes'+ interchangeTrainCodes.length)
                for(let k = 0; k < interchangeTrainCodes.length;k++){
                    //Need to check code
                    zeros[i][trainCodeList.indexOf(interchangeTrainCodes[k+1]) ] =  7000
                    console.log(`Added interchange ${interchangeTrainCodes[k]}`)
                    console.log(`Added interchange ${trainCodeList.indexOf(interchangeTrainCodes[k])}`)
                }
                // To assign value of interchange wait time
                

              
            }
        }
    }
     return zeros[25]
    // return console.log(zeros[23])

}

async function driver(){
    var data = await readCSV()
    createAdjMatrix(166,166)
     .forEach((e,idx) => console.log(`Index ${idx} with element ${e}`))
    console.log(`Currently at train code ${trainName[25]} ${trainCodeList[25]}`)
}

driver()
