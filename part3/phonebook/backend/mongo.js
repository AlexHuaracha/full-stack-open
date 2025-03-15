const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


const url = `mongodb+srv://fullstack:${password}@cluster0.g4ujl.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Phonebook', personSchema)

const person = new Person({
    name: name,
    number: number,
})

// Save the person to the database
if (process.argv.length > 4) {
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

// Fetch all persons from the database
if (process.argv.length < 4) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })    
}



// 