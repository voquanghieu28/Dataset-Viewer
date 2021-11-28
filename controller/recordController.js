// Node modules
const fs = require('fs');

// Array holding list of records
let recordlist = []

// Data transfer object
const Record = require("../model/record.js")

// Keeping track of the record ID in memory
let CURRENT_RECORD_INDEX = 0;

// Read csv file, and set the result to the recordList
Record.getRecordsFromFile((result, lastIndex, err) => {
    recordlist = result
    CURRENT_RECORD_INDEX=++lastIndex
})   

// Rendering the home page with data
exports.getAllPage = (req, res) => res.render('home', {data : recordlist})

// Rendering add page
exports.getAddPage = (req, res) => res.render('add') 

// Rendering edit page with edit record object
exports.getEditPage = (req, res) => {
    const editRecord = recordlist.find(record => record.getID().toString() == req.query.id);
    res.render('edit', {record : editRecord.toJSON()}) 
}

// Delete record and rendering home page
exports.deleteRecord = (req, res) => {
    if (req.query.id ) 
        recordlist = recordlist.filter(obj =>  obj.getID().toString() != req.query.id)

    res.render('home', {data : recordlist}) 
}

// Add a new record and redirect to home page
exports.addRecord = (req, res) => {
   
    let newRecord = new Record(
        CURRENT_RECORD_INDEX++,
        req.body.code,
        new Date(req.body.date),
        parseInt(req.body.cases),
        parseInt(req.body.deaths),
        req.body.nameFrench,
        req.body.nameEnglish
    )

    recordlist.push(newRecord)
    res.render('home', {data : recordlist}) 
}
    
// Edit a record and redirect to home page
exports.editRecord = (req, res) => {

    let editRecord = new Record(
        req.body.id,
        req.body.code,
        new Date(req.body.date),
        parseInt(req.body.cases),
        parseInt(req.body.deaths),
        req.body.nameFrench,
        req.body.nameEnglish
    )

    let editIndex = recordlist.findIndex((record) => record.getID().toString()==req.body.id)
    console.log(req.body)
    recordlist[editIndex] = editRecord

    res.render('home', {data : recordlist}) 
}

// Save record to file and redirect to download page to download file
exports.saveRecords = (req, res) => 
   Record.saveRecordsToFile(recordlist, () =>res.render('download') )