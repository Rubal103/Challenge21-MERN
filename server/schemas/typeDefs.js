//added typeDefs(User, Book, Auth and input BookInput to handle mutations (login, addUser , saveBook, and removeBook))

const { gql } = require("apollo-server-express");

const typeDefs = gql`

type User {
    id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
  type Auth {
    token: ID!
    user: User
  } 

  input BookInput {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    
    addUser(username: String!, email: String!, password: String!): Auth

    saveBook(input: BookInput): User

    removeBook(bookId: ID!): User
  }



`