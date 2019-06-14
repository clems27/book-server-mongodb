const express = require('express')
const mongodb = require('mongodb')

const app = express()

const uri = process.env.DATABASE_URI

app.get('/api/books', function(request, response) {
  // Make this work!
  const client = new mongodb.MongoClient(uri)

  client.connect(function() {
    const db = client.db("literature")
    const booksCollection = db.collection("books")
    const searchObject = {}
     if(request.query.author){
       searchObject.author=request.query.author
    }
    
    if(request.query.title){
       searchObject.title=request.query.title
    }
    
    if(request.query.author_birth_year){
       searchObject.author_birth_year=parseInt(request.query.author_birth_year)
    }
    if(request.query.author_death_year){
       searchObject.author_death_year= parseInt(request.query.author_death_year)
    }
    if(request.query.url){
       searchObject.url=request.query.url
    }
    booksCollection.find(searchObject).toArray(function(error, books){
      response.json(error || books)
    client.close()
    })
  })
})

app.get('/api/books/:id', function(request, response) {
  // Make this work, too!
    const client = new mongodb.MongoClient(uri)  
    const stringId = request.params.id
    if(!isValidHex(stringId)){
        return response.status(400).json({Error:'Invalid Id'})

    }
    const id = new mongodb.ObjectID(stringId) 
    const searchObject = { _id: id }

  client.connect(function() {
    const db = client.db("literature")
    const booksCollection = db.collection("books")
    booksCollection.findOne(searchObject, function(error, books) {
      if(books===null){
      return response.status(404).json({Error:`book not found`})
      }
      response.status(200).json(error || books)
      client.close()
    })
  })
})

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
})

app.get('/books/:id', function(request, response) {
  response.sendFile(__dirname + '/book.html');
})

app.get('/authors/:name', function(request, response) {
  response.sendFile(__dirname + '/author.html');
})

function isValidHex(stringId) {
return stringId.length===24;
}


app.listen(process.env.PORT)