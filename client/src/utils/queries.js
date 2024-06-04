//gql imported from @apollo/clinet helps to parse queries /mutations as template literals, as in below code for me queries

import {gql} from "@apollo/client";

//all me queries that will be performed are exported out of queries.js
export const GET_ME = gql`

{
    me {
        id
        username
        email
        bookcount
        savedBooks{
            bookId
            authors
            description
            title
            image
            link
        }
    }
}

`;