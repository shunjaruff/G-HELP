To test the system, download or clone the project-

Have Node.js, MongoDB installed in your system

open the cmd and nevigate to g-help Project folder, from here do npm start, this starts your Node.js server and listen at 3000

open cmd and cd to bin directory of mongoDB. type mongod --dbpath path to your g-help\data and hit enter.

open another cmd and cd to bin directory of mongoDB. type mongo hit enter and then type use g-help. your db is now data directory of g-help

goto localhost:3000/ghelp in your browser to test

other available pages are 
                /registermentor
                /assignmentor
                /hostfamily
                /addevent
