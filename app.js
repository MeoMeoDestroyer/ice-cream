// Import the express module

import express from 'express';


// Create an instance of an Express application

const app = express();


// Define the port number where our server will listen

const PORT = 3006;


// Define a default "route" ('/')
 app.use(express.static('public'));
 app.set('view engine', 'ejs');
app.set('views', './views'); // folder where your .ejs files live
 app.use(express.urlencoded({extended:true}));

// req: contains information about the incoming request

// res: allows us to send back a response to the client

app.get('/', (req, res) => {

  res.render('home');
});
app.get('/', (req, res) => {

  res.render('admin');
});
app.get('/', (req, res) => {

  res.render('confirm');
});


// Start the server and listen on the specified port

app.listen(PORT, () => {

    console.log(`Server is running at http://localhost:${PORT}`);

});

