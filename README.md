# G-HELP
To test the system, download or clone the project-

Have Node.js, MongoDB installed in your system

Open the cmd and nevigate to g-help Project folder, from here do **_npm start_**, this starts your Node.js server and listen at 3000

Open cmd and cd to bin directory of mongoDB. type **_mongod --dbpath path to your g-help\data_** and hit enter.

Open another cmd and cd to bin directory of mongoDB. type **_mongo_** hit enter and then type **_use g-help_**. your db is now data directory of g-help

Go to **_localhost:3000/ghelp_** in your browser to test

Other available pages are 

                /registermentor
                /assignmentor
                /hostfamily
                /addevent

