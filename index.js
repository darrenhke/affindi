const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');



const trainMap = new Map()
const interMap = new Map()
var interChangeIndex = 0
fs.createReadStream(path.resolve(__dirname, 'assets', 'StationMap.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
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

// interchangeCount(interChangeSet)