// Import node modules
const path      = require('path')
const express   = require("express")
const bodyParser = require('body-parser');

// Controller modules
const recordController = require('./controller/recordController')

// Port configuration
const PORT = process.env.PORT || 3000

// Express server
const app = express()

// Body parser to parse http request
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use('/public', express.static(path.join(__dirname, 'public'  )))

// Starting server on specified port
app.listen(PORT, () => console.log(`---> STARTING COVID SERVER ON PORT ${PORT}`))

// Set views folder path
app.set('views', path.join(__dirname, 'views'))

// Setting template engine, using EJS in this project
app.set('view engine', 'ejs')


// GET route /home
app.get('/home', recordController.getAllPage)

// GET route /add
app.get('/add', recordController.getAddPage)

// GET route /add
app.get('/edit', recordController.getEditPage)

// GET route /add
app.get('/delete', recordController.deleteRecord)

// POST route /add
app.post('/add', recordController.addRecord)

// POST route /edit
app.post('/edit', recordController.editRecord)

// GET route /save
app.get('/save', recordController.saveRecords)

