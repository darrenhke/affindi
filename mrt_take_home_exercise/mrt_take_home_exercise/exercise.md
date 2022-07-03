Zendesk Backend Exercise
==========================

## Problem Statement

You are provided data on the stations and lines of Singapore's urban rail system, including planned additions over the next few years. Your task is to use this data to build a routing service, to help users find routes from any station to any other station on this future network.

Develop an app should to find and display one or more routes from a specified origin to a specified destination, ordered by some efficiency heuristic of your choice.  But make sure you document and is able to defend the heurisitcs behind your algorithm. Routes should have one or more steps, like "Take [line] from [station] to [station]" or "Change to [line]". You may add other relevant information to the results.  

For the line names to be displayed, using the two-letter code is sufficient.

You may use any language/framework. You may also convert the data into another format as needed.  You may package your app in anway you see fit, it can be a command line program, a web app, an API, etc.

## Data Description

The included file, StationMap.csv, describes Singapore's future rail network. Here is an extract:

```
EW23,Clementi,12 March 1988
EW24,Jurong East,5 November 1988
EW25,Chinese Garden,5 November 1988
EW26,Lakeside,5 November 1988
```

Each line in the file has 3 fields, station code, station name, and date of opening.

Note that there may be interchange stations (where train lines cross) like Buona Vista, and these are listed each time they appear in a line. For e.g., for Buona Vista, it's listed as EW21 and CC22 both. Additionally, position numbers are not always sequential; the gaps represent spaces left for future stations, and may be ignored for this exercise.

Trains can be assumed to run in both directions on every line.

## Bonus

Travel times between stations change based on the time of day, due to increased/decreased traffic and frequency in the following manner:

Peak hours (6am-9am and 6pm-9pm on Mon-Fri)
	NS and NE lines take 12 minutes per station
	All other train lines take 10 minutes
	Every train line change adds 15 minutes of waiting time to the journey

Night hours (10pm-6am on Mon-Sun)
	DT, CG and CE lines do not operate
	TE line takes 8 minutes per stop
	All trains take 10 minutes per stop
	Every train line change adds 10 minutes of waiting time to the journey

Non-Peak hours (all other times)
	DT and TE lines take 8 minutes per stop
	All trains take 10 minutes per stop
	Every train line change adds 10 minutes of waiting time to the journey

To account for these constraints, your application should expose a new method that accepts a source, destination and start time ("YYYY-MM-DDThh:mm" format, e.g. '2019-01-31T16:00') and returns one or more routes ordered by an efficiency heuristic with clear steps involved, as well as the total travel time for each route generated. If no route is available between the selected stations, this should also be communicated clearly.

## Submission

Just make sure to include clear instructions to setup the necessary environments, how to launch your app, and with various usage your app supports.  You can assume that the code will be tested on a relatively mordern windows or macOS.  Any additional packages needed needs to be specified in your documentation.   
A running web server is not necessary, but your app may be run using one.

## Evaluation

Your submission will be judged on:
- code quality and architecture
- good programming practices such as clean code, clear comments, tests
- quality of the route suggestions
- code packaging including project structure, API design
- ease of use

## Notes

1. The input and output in examples.md is only a sample representation. It's up to you how you want to structure your implementation. You can choose a different output structure, as long as the information is clearly conveyed and there are clear steps involved in the suggested route.

2. Other than the problem statement listed above, please make any and all design decisions needed for your implementation. Assumptions should be listed in your readme, or code.
