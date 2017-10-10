const express = require('express')
const graphqlHTTP = require('express-graphql')
const app = express()
const fetch = require('node-fetch')
const util = require('util')
const DataLoader = require('dataloader')
const parseXML = util.promisify(require('xml2js').parseString)
const schema = require('./schema')

const fetchAuthor = id =>
fetch(
    `https://www.goodreads.com/author/show.xml?id=${id}&key=PjMitv9zZjHUN0pYznUUiw`
)
.then(response => response.text())
.then(parseXML)

const fetchBook = id =>
fetch(`https://www.goodreads.com/book/show.xml?id=${id}&key=PjMitv9zZjHUN0pYznUUiw`)
.then(response => response.text())
.then(parseXML)


app.use('/graphql', graphqlHTTP( req => {
    
    const authorLoader = new DataLoader(keys => 
        Promise.all(keys.map(fetchAuthor)))
        
    const bookLoader = new DataLoader(keys => 
        Promise.all(keys.map(fetchBook)))

    return {
        schema,
        context: {
            authorLoader,
            bookLoader
        },
        graphiql: true
    }
}))

app.listen(4000)

console.log('Listening ...')