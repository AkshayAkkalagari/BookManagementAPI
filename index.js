require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");


//Initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
).then( () => console.log("connection established"));

/*
Route            /
Description      Get all the books
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/", async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
Route            /is
Description      Get specific book on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/is/:isbn",async(req,res) => {

  const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});
  
  //null => !1=0, !0=1 
  if(!getSpecificBook) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
  }

  return res.json({book: getSpecificBook});
});

/*
Route            /c
Description      Get specific book on category
Access           PUBLIC
Parameter        category
Methods          GET
*/

booky.get("/c/:category",async (req,res) => {
  const getSpecificBook = await BookModel.findOne({category: req.params.category});
  
  //null => !1=0, !0=1 
  if(!getSpecificBook) {
    return res.json({error: `No book found for the category of ${req.params.category}`});
  }

  return res.json({book: getSpecificBook});
});
 
/*
Route            /l
Description      Get specific book based on language
Access           PUBLIC
Parameter        language
Methods          GET
*/
booky.get("/l/:language", (req,res) => {
  const getSpecificBook = database.books.filter(
      (book) => book.language.includes(req.params.language)
  )

  if(getSpecificBook.length === 0) {
      return res.json({error: `No book found for the language of ${req.params.language}`});
  }

  return res.json({book: getSpecificBook});
});

/*
Route            /author
Description      Get all authors
Access           PUBLIC
Parameter        none
Methods          GET
*/

booky.get("/author",async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});
//////////////////////////////// PUT ////////////////////////////

/*
Route            /book/update
Description      update/add new title
Access           PUBLIC
Parameter        isbn
Methods          put
*/

booky.put("/book/author/update/:isbn", async (req,res) => {
  //updated book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      $addToSet: {
        authors: req.body.newAuthor
      }
    },
    {
      new: true
    }
  );

  //update auhtor database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor
    },
    {
      $addToSet: {
        books: req.params.isbn
      }
    },
    {
      new: true
    }
  );

  return res.json(
    {
      books: updatedBook,
      author: updatedAuthor,
      message: "New Author was added"
    }
  );
});



/*
Route            /author/book
Description      Get all authors based on books
Access           PUBLIC
Parameter        isbn
Methods          GET
*/

booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter(
      (author) => author.books.includes(req.params.isbn)
    );
  
    if(getSpecificAuthor.length === 0){
      return res.json({ error: `No author found for the book of ${req.params.isbn}`});
    }
    return res.json({authors: getSpecificAuthor});
});

/*
Route            /publication
Description      Get all publications
Access           PUBLIC
Parameter        none
Methods          GET
*/

booky.get("/publications",async (req,res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});

////////////    post    ///////////

/*
Route            /book/new
Description      add new books
Access           PUBLIC
Parameter        none
Methods          post
*/

booky.post("/book/new",async (req,res) => {
  const { newBook } = req.body;
  const addNewBook = BookModel.create(newBook);
  return res.json({
    books: addNewBook,
    message: "Book was added !!!"
  });
});

/*
Route            /author/new
Description      add new author
Access           PUBLIC
Parameter        none
Methods          post
*/

booky.post("/author/new",async (req,res) => {
  const { newAuthor } = req.body;
  const addNewAuthor = AuthorModel.create(newAuthor);
  return res.json(
    {
      author: addNewAuthor,
      message: "Author was added !!!"
    }
  );
});

/*
Route            /publications/new
Description      add new publications
Access           PUBLIC
Parameter        none
Methods          post
*/

booky.post("/publication/new",async (req,res) => {
  const { newPublication } = req.body;
  const addNewPublication = PublicationModel.create(newPublication);
  return res.json(
    {
      publication: addNewPublication,
      message: "publication was added !!!"
    }
  );
});

//////////////////////////////// PUT ////////////////////////////

/*
Route            /book/update
Description      update/add new title
Access           PUBLIC
Parameter        isbn
Methods          put
*/

booky.put("/book/update/:isbn", async (req,res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      title: req.body.bookTitle
    },
    {
      new: true
    }
  );

  return res.json({
    books: updatedBook
  });
});



/*
Route            /publications/update/book
Description      update/add new publications
Access           PUBLIC
Parameter        isbn
Methods          put
*/

booky.put("/publication/update/book/:isbn", (req,res) => {
  //update the publication database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //update the book database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      book.publications = req.body.pubID;
      return;
    }
  });

  return res.json(
    {
      books: database.books,
      publications: database.publication,
      message: "successfully updated publication"
    }
  );

});

////////////////////  delete  ////////////////////

/*
Route            /book/delete
Description      delete a book
Access           PUBLIC
Parameter        isbn
Methods          delete
*/

booky.delete("/book/delete/:isbn",async (req,res) => {
  //Whichever book that doesnot match with the isbn , just send it to an updatedBookDatabase array
  //and rest will be filtered out

  const updatedBookDatabase = await BookModel.findOneAndDelete(
    {
      ISBN: req.params.isbn
    }
  );

  return res.json ({
    Books: updatedBookDatabase
  });

});
  
/*
Route            /book/delete/author
Description      delete an author from a  book and vice versa
Access           PUBLIC
Parameter        isbn , authorID
Methods          delete
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  //Update the book database
   database.books.forEach((book)=>{
     if(book.ISBN === req.params.isbn) {
       const newAuthorList = book.author.filter(
         (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
       );
       book.author = newAuthorList;
       return;
     }
   });


  //Update the author database
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });

  return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted!!!!"
  });
});





booky.listen(3000,() => {
  console.log("Server is up and running");
});

