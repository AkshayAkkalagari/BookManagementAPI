const books = [
    {
        ISBN: "12345book",
        title: "tesla",
        PubDtae: "2021-08-05",
        language: "en",
        numPage: "250",
        author: [1,2],
        publications: [1],
        category: ["tech","space","education"]
    }
]

const author = [
    {
        id: 1,
        name: "Akshay",
        books: ["12345book", "secretbook"]
    },
    {
        id: 2,
        name: "elon musk",
        books: ["12345book"]
    }
]

const publications = [
    {
        id: 1,
        name: "writex",
        books: ["12345book"]
    },
    {
        id: 2,
        name: "writex2",
        books: []
    }
]


module.exports = {books, author, publications};
