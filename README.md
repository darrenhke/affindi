# Affinidi Take Home Assignment

## Assumptions and Limitations
If starting from the base case assignment, navigation from source to destination can be employed considering that all edges between vertices have an equal weight. Bellman–Ford Algorithm could be used to determine the shortest path from source to destination in this instance.

Assuming that we will begin the assignment with completing the bonus segment in mind. I employed Dijkstra’s shortest path algorithm and for simplicity, the adjacency matrix variation. Understand that there exists a more efficient variation that uses a adjacency list that runs a 0(E Log V) [E - Edges and V - Vertices] compared to the adjacency matrix that runs at 0(V^2) which runs one magnitude slower. This algorithm can be used to find the shortest distance between a source and all other destinations vertices.

For Dijkstra’s algorithm a shortest path tree will be generated with a source used as the root. Two sets are maintained.
First set contains vertices included in the shortest path tree. Second set will include vertices not yet included in the shortest path tree. Throughout each step of the algorithm, we will find a vertex that is in the other set and has a minimum distance from the source updated.

Since the year is 2022, assume all provided stations in StationMap.csv are reachable less Night Trains that shut down in accordance to bonus part constraints.

There are a total of 26 interchanges that need to be factored in when travelling find the shortest route. When interchange vertice is the visited, add weight to previous or next in the train line and trainlines where the interchange vertice name matches.

As time passes the routes should be updated as periods switch from weekday peak to off-peak. This would result in an update to the adjacency matrix when these period cross over providing a more/less optimal route. Furthermore, destinations can be completely cut-off when off-peak transition to night trains.

3 period transitions exists for weekdays:
1. Night Period to Peak Period
2. Peak Period to Non-Peak Period
2. Non-Peak Period to Night Period

2 period transitions exists for weekends:
1. Night Period to Non-Peak Period
2. Non-Peak Period to Night Period 

After analyzing the duration of the travel time of day, traffic frequency, I have used a fixed weight of 10 in the adjacent matrix for each vertice and calculated the shortest travel time base on the time period. I understand that the above method defeats the purpose of utilising dijkstra algorithm as it is used for weight edges. 

Nonetheless, the attached solution can be improved upon to factor rerouting after the train has traverse *x* stops and has crossed a transition period  by recalculating the adjacency matrix as stated above to provide true shortest path.


## Program Structure

## Program Steps 
1. Parse the csv file - determine no. of interchanges that exists
2. Build Adjacency Matrix
3. Run Dijkstra Algorithm SPT on the graph
4. Reverse traversal of destination vertex list to show path to take
5. Traverse list to find and check time periods to add/subtract time to current shortest route time 



## Installation
Application was built using Node v16.4.2 
The application was built in node.js using libraries fast-csv for file parsing and moment.js for dateTime handling.

1. Install node module packages with `npm i`
2. Application can be run with command `node index.js EW27 NE7 06:00`


## License
[MIT](https://choosealicense.com/licenses/mit/)