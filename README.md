# Bob and Dee brackets - mern

## Intro
While March Madness bracket scoring programs already exist, I created this web app specifically for my family who scores our yearly competition differently. Wanting to reward riskier predictions, we score each individual's picks with the following formula:
`points = (team seed)*2^round-1`

In the past, my dad has kept track of the family predictions and game outcomes manually, only automating the scoring through excel. Now, this web app will automate the entire process.

## ETL
Using a python script, I extracted data from a website holding all the tournament information including up-to-date game results. I then transformed the data into a json file with fields such as "team.name", "team.wins", and "team.seed." Finally, I loaded that data to my mongoDB database. This process is known as ETL, which stands for Extract, Transform, and Load. Every time someone accesses the leaderboard page, the ETL script runs and scrapes any new data from the extraction site to update the scores if there are new game results.

## MERN
I wanted to take this opportunity to learn a new development stack and chose the MERN stack to challenge myself with a new front-end framework and database structure (noSQL). Overall, the MERN stack proved especially versatile with UI development and organization. All the technology is open source and well documented, making development faster and easier.

## Acknowledgements
A big thanks to Professor Roller for inspiring me to use ETL as well as helping and encouraging me along the way. I also want to thank Dr. Nurkkala for providing insight into how to construct my mongoDB databases.

## Time
During January, around <b>160</b> hours were spent on this project.

| Tasks       | Hours       |
| ----------- | ----------- |
| UI planning | 1           |
| UX planning | 1           |
| Research    | 10          |
| API         | 10          |
| MongoDB     | 10          |
| Bug fixing  | 15          |
| Presentation| 20          |
| ETL         | 20          |
| Auth (fail) | 40          |
| UI/ React   | 45          |

<em>hours tracked by 1/26/20222<em>

-----------------------------

# How to begin program
The "mern" project folder has the two sub-folders of "client" and "server". To start the client, navigate to the folder and run `npm start`. To start the server, navigate to the server and run 'node server.js`.
