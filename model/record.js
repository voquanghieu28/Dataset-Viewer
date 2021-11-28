// Import node modules
const fs        = require('fs')
const readline  = require('readline')

const INPUT_FILE_PATH = './csv/InternationalCovid19Cases.csv'   // Path of the input file (the original file from the course)
const EXPORT_FILE_PATH = './public/covid.csv'                   // File location to export the csv file
const NUMBER_OF_LINES = 100                                     // Lines reading limitaion

/** Class representing a record */
class Record {

    /** @access private id */
    #id 

    /** @access private country code */
    #countryCode

    /** @access private date of the record */
    #date

    /** @access private number of cases */
    #cases

    /** @access private number of deaths */
    #deaths

    /** @access private country name in English */
    #nameFrench

    /** @access private country name in French */
    #nameEnglish

    /**
     * 
     * @param {number} id the record id
     * @param {string} countryCode the country code
     * @param {Date} date the date of the record
     * @param {number} cases the number of cases
     * @param {number} deaths the number of deaths
     * @param {string} nameFrench the country name in French
     * @param {string} nameEnglish the country name in English
     */
    constructor(id, countryCode, date, cases, deaths, nameFrench, nameEnglish) {
        this.#id             = id
        this.#countryCode    = countryCode
        this.#date           = date
        this.#cases          = cases
        this.#deaths         = deaths
        this.#nameEnglish    = nameEnglish
        this.#nameFrench     = nameFrench
    }

    /**
     * Get country code
     * @return {string} the country code
     */
    getCountryCode() { return this.#countryCode }

    /**
     * Get the country name in English
     * @return {string} the country name in English
     */
    getNameEnglish() { return this.#nameEnglish }

    /**
     * Get the country name in French
     * @return {string} the country name in French
     */
    getNameFrench() { return this.#nameFrench }

    /**
     * Get the number of deaths
     * @return {number} the number of deaths
     */
    getDeaths() { return this.#deaths }

    /**
     * Get the number of total cases
     * @return {number} the number of total cases
     */
    getCases() { return this.#cases }

    /**
     * Get the date of the record
     * @return {number} the date of the record
     */
    getDate() { return this.#date }

    /**
     * Get the record id
     * @return {number} the country code
     */
    getID() { return this.#id }


    /**
     * Set the new English name
     * @param {string} name the new English name
     */
    setNameEnglish(name) { this.#nameEnglish = name }

    /**
     * Set the new French name
     * @param {string} name the new French name
     */
    setNameFrench(name) { this.#nameFrench = name }

    /**
     * Set the new number of deaths
     * @param {number} deaths the new number of deaths
     */
    setDeaths(deaths) { this.#deaths = deaths }

    /**
     * Set the new number of cases
     * @param {number} cases the new number of cases
     */
    setCases(cases) { this.#cases = cases }

    /**
     * Set the new Date of the record 
     * @param {Date} date the Date of the record 
     */
    setDate(date) { this.#date = date }

    /**
     * Set the new record id
     * @param {number} id the new record id
     */
    setID(id) { this.#id = id }

    /**
     * Set the new country code
     * @param {string} date the new country code
     */
    setCountryCode(countryCode) { this.#countryCode = countryCode }

    /**
     * @return the JSON format of the record object
     */
    toJSON() {
        return {
            id             : this.#id,
            countryCode    : this.#countryCode,
            date           : this.#date,
            cases          : this.#cases,
            deaths         : this.#deaths,
            nameFrench     : this.#nameFrench,
            nameEnglish    : this.#nameEnglish,
            countryCode    : this.#countryCode
            
        }
    }

    /**
     * Saving list of records to CSV files
     * @param {Array} list 
     * @param {function} cb
     */
    static saveRecordsToFile (list, cb) {
        let allString = "id,date,cases,deaths,name_fr,name_en\n"

        list.forEach((element) => {     
            let line = element.getCountryCode() + "," 
                    +  element.getDate().toISOString().substring(0,10) + "," 
                    +  element.getCases() + "," 
                    +  element.getDeaths() + "," 
                    +  element.getNameFrench() + ","
                    +  element.getNameEnglish() + "\n"       
            allString+=line
        })

        fs.writeFile(EXPORT_FILE_PATH, allString, 'utf8', () => {
            cb()
        });
    }

    /**
     * Helper function to read csv file. Receives a path of the csv file, number of lines and a callback
     * @param {String} filePath 
     * @param {number} numberOfLines
     * @param {Function} cb 
     */
    static readCSV(filePath, numberOfLines, cb) {
        const list  = []        // List holding records while reading file
        let   num   = 0         // Temp variable to count the rows 
        let   firstCountryCode  // Stored the first country code

        const readFileByLine = readline.createInterface({
            input: fs.createReadStream(filePath)
                    .on('error', (err) => console.log('!!!! File not found / Error while reading file'))
        })

        // Reading by line
        readFileByLine.on('line', line => {
            
            // Parsing the csv String line to an array of String
            let lineData = line.split(',')
            
            // Ignore the first row
            if (num==0) return num++

            // If first row, set the country code to firstCountryCode
            if (num==1) firstCountryCode = lineData[0] 

            // If the country code is different from previous one, then stop reading file. Because we just want a few record from one country.
            if (lineData[0]!=firstCountryCode || num>numberOfLines-1) {
                cb(list, num)
                readFileByLine.removeAllListeners() //num>99 
            }      
            
            // Create new data transfer object (Record)
            let record = new Record (
                num,
                lineData[0], 
                new Date(lineData[1]), 
                parseInt(lineData[2]), 
                parseInt(lineData[3]), 
                lineData[4], 
                lineData[5]
            )
            
            list.push(record)   // Add the record to the array
            num++               // Increment num
        })

        // On error handling
        readFileByLine.on('error', (err) => cb(null, num, err) ) 
    }

    static getRecordsFromFile(cb) {
        Record.readCSV(INPUT_FILE_PATH, NUMBER_OF_LINES, cb)
    }
    
}

/**
 * A module to create Record object
 * @module Record
 */
module.exports = Record
