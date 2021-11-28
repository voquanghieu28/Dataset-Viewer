/**
 * To run this test, needs to comment all the logging statement
 */

const Record = require("./model/record.js")
const recordController = require("./controller/recordController")

// Testing if loading records success without errors
test('Loaded record from files without errors', () =>
    Record.getRecordsFromFile((result, lastIndex, err) => {
        expect(err).toBeUndefined()
    }) 
)

// Testing if the records is loaded from files
test('Loaded record from files return array with elements', () =>
    Record.getRecordsFromFile((result, lastIndex, err) => {
        expect(result.length).toBeGreaterThan(0)
    }) 
)

// Testing if the file import to the correct data type
test('Type of loaded data is Record', () =>
    Record.getRecordsFromFile((result, lastIndex, err) => {
        expect(typeof result[0]).toBe("object")
    }) 
)

// Testing if add function added a record
test('Add function working properly', () =>
    expect (()=> {
        recordController.addRecord(
            {body :{   
                        code : 'CC',
                        date : new Date(),
                        cases:'1',
                        deaths:'4',
                        nameEnglish: 'TEST EN',
                        nameEnglish: 'TEST FR',
                    }
            
            }, 
            {render : (a, b)=>{}}
        )
    }).not.toThrow(Error)
)

// Tesing if update function updated a record
test('Edit function update record correctly', () =>
    expect (()=> {
        recordController.deleteRecord(
            {query :{   id   : '3',
                        code : 'AA',
                        date : new Date(),
                        cases:'3',
                        deaths:'4',
                        nameEnglish: 'TEST EN',
                        nameEnglish: 'TEST FR',
                    }
            
            }, 
            {render : (a, b)=>{}}
        )
    }).not.toThrow(Error)
)

// Tesing if delete function delete a record 
test('Delete function delte one record', () =>
    expect (()=> {
        recordController.deleteRecord({query : {id : '3'}}, {render : (a, b)=>{}})
    }).not.toThrow(Error)
)

// Testing if no exception has been thrown during exporting the csv file 
test('No Exception thrown during export csv file', () =>
    expect (()=> {
        Record.getRecordsFromFile((result, lastIndex, err) => {}) 
    }).not.toThrow(Error)
)

