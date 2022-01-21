#<script src="https://gist.github.com/oxguy3/3b5d53909d793eb6d76058d036a4f217.js"></script>
#Scraper for NCAA tournament games on Sports-Reference.com. Prints a JSON array of all games (excluding play-in rounds)
#scrape-march-madness.py

#!/usr/bin/env python3
#
# MIT License
#
# Copyright 2020 Hayden Schiff
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

from tkinter import Y
from turtle import update
from bs4 import BeautifulSoup
from datetime import date
import pymongo
import requests
import sys
import json
import time

myclient = pymongo.MongoClient("mongodb+srv://mern:mongodb@brackets.l3ri0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
mydb = myclient["myFirstDatabase"]
mycol = mydb["teams"]
#mycol.drop()
# print(myclient.list_database_names())

# print to stderr (because stdout is where the data goes)
def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

# allows keep-alive for performance
session = requests.Session()

games = []
# Current year not filled with data yet
# year = date.today().year
year = 2018


with session:
    payload = {}#{'limit': limit}
    url = 'https://www.sports-reference.com/cbb/postseason/'+str(year)+'-ncaa.html'
    req = session.get(url, params=payload)
    eprint(req.url)

    # parse each tourney round from html response
    soup = BeautifulSoup(req.text, 'html.parser')

    bracketsNode = soup.find(id="brackets")
    bracketsChildren = bracketsNode.find_all(True, recursive=False)

    for bracketNode in bracketsChildren:
        rounds = bracketNode.find_all('div', class_='round')
        roundNum = 1
        for round in rounds:
            roundChildren = round.find_all(True, recursive=False)

            for gameNode in roundChildren:
                game = {}
                game['year'] = year
                game['bracket'] = bracketNode.get('id')
                game['round'] = roundNum

                gameChildren = gameNode.find_all(True, recursive=False)

                if (len(gameChildren) != 3):
                    continue

                # parse each team
                def parseTeam(teamNode):
                    team = {}
                    classes = teamNode.get("class")
                    team['won'] = (classes != None) and ("winner" in teamNode.get("class"))
                    teamChildren = teamNode.find_all(True, recursive=False)
                    team['seed'] = teamChildren[0].get_text()
                    team['name'] = teamChildren[1].get_text()
                    team['score'] = teamChildren[2].get_text()
                    return team
                game['teamA'] = parseTeam(gameChildren[0])
                game['teamB'] = parseTeam(gameChildren[1])

                locationLink = gameChildren[2].contents[0]
                boxScore = locationLink.get("href")
                boxScore = boxScore[len("/cbb/boxscores/"):len(boxScore)-len(".html")]
                game['boxScore'] = boxScore
                game['date'] = boxScore[0:len("0000-00-00")]
                game['location'] = locationLink.get_text()[len("at "):]

                games.append(game)

            roundNum += 1
    time.sleep(0.5)
print(json.dumps(games))
mycol.drop()
mycol = mydb["teams"]
mycol.insert_many(games)


#######################################################
## Now query through that data and count up team wins##
#######################################################

# Grab picks table
colPicks = mydb["picks"]

# find winning teams from both teamA and teamB fields
teamAwins = (mycol.find({"teamA.won": True},{"teamA.name": 1, "teamA.seed": 1, "_id": 0}))
teamBwins = (mycol.find({"teamB.won": True},{"teamB.name": 1, "teamB.seed": 1, "_id": 0}))

# create SEED dictionary to hold teams and seed
seedDict={}

winnerList = []

for team in teamAwins:
    winnerList.append(team['teamA']['name'])
    if (team['teamA']['name'] in seedDict):
        pass
    else:
        seedDict[team['teamA']['name']] = team['teamA']['seed']

for team in teamBwins:
    winnerList.append(team['teamB']['name'])
    if (team['teamB']['name'] in seedDict):
        pass
    else:
        seedDict[team['teamB']['name']] = team['teamB']['seed']

# count of how many times each team won
winCount = {}
for item in winnerList:
    if (item in winCount):
        winCount[item] += 1
    else:
        winCount[item] = 1

for key, value in winCount.items():
    print ("% s : % d"%(key, value))

# for each user('picks') get all picks and put in dictionary
for r in colPicks.find({}):
    #print(r['_id'])
    pickCount = {}
    for count in r['choices']:
        if (count in pickCount):
            pickCount[count] += 1
        else:
            pickCount[count] = 1
        
    # restart points
    totalPoints = 0

    # compare picks dictionary with wins dictionary
    # works without seed information
    for team in winCount:
        if team in pickCount:
            if (pickCount[team] <= winCount[team]):
                totalPoints += int(seedDict[team])*2^int(pickCount[team])
            else:
                totalPoints += int(seedDict[team])*2^int(winCount[team])
    
    #print(r['name'], "scored", totalPoints)

    # Update totalPoints in picks collection
    colPicks.update_one({
        '_id': r['_id']
        },{
        '$set': {
            'points': totalPoints
        }
        }, upsert=False)

    ## FOR FUTURE - instead of updating, make new table and add new entry at each update. Then make graph on new tab in website to show how people do throughout the tournament.





