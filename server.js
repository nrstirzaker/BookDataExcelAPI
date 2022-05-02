'use strict'

const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const {GraphQLObjectType,GraphQLSchema,GraphQLInt,GraphQLString,GraphQLList,GraphQLFloat} = graphql
//const { typeDefs: scalarTypeDefs } = require('graphql-scalars');



const sheetWrapper = require('./sheetWrapper')
const searchResults = require('./ApiSearchUtils')

const { ScalarNameTypeDefinition } = require('graphql-scalars');
const { Date } = require('graphql-scalars/scalars/iso-date');
//const {  Currency } = require('graphql-scalars')
const URL = require('url').URL;
let headers = [];
let sheet = [];

let fullURL = ''
const app = express()
const port = 3000

app.get('/api/headers', (req, res) => {
  res.send(headers);
})



const Book = new GraphQLObjectType({
  name:"Book",
  fields:() => ({
    "Position":{type:GraphQLString},
    "ISBN":{type:GraphQLString},
    "Title":{type:GraphQLString},
    "SERIES":{type:GraphQLString},
    "Author":{type:GraphQLString},
    "Imprint":{type:GraphQLString},
    "UK_Publisher_Group":{type:GraphQLString},
    "Volume":{type:GraphQLInt},
    "Value":{type:Currency},
    "RRP":{type:GraphQLFloat},
    "ASP":{type:GraphQLString},
    "Binding":{type:GraphQLString},
    "Publ_Date":{type:Date},
    "Product_Class":{type:GraphQLString},
    "Language":{type:GraphQLString},
    "Original_Language":{type:GraphQLString},
    "Edition_Description":{type:GraphQLString},
    "Edition_Statemement":{type:GraphQLString},
    "Release_ID":{type:GraphQLString},
    "Imprint":{type:GraphQLString},
    "UK_Division":{type:GraphQLString},
    "UK_Publ_Grp":{type:GraphQLString},
    "UK_Consolidated_Publ_Grp":{type:GraphQLString},
    "International_Publ_Grp":{type:GraphQLString},
    "BIC_Code_1":{type:GraphQLString},
    "BIC_Desc_1":{type:GraphQLString},
    "BIC_Code_2":{type:GraphQLString},
    "BIC_Desc_2":{type:GraphQLString},
    "BIC_Qualifier_1":{type:GraphQLString},
    "BIC_Qualifier_2":{type:GraphQLString},
    "Audience_Code_1":{type:GraphQLString},
    "Audience_Code_2":{type:GraphQLString},
    "THEMA_Qualifier":{type:GraphQLString},
    "THEMA_Subject_1":{type:GraphQLString},
    "THEMA_Subject_2":{type:GraphQLString},
    "LCode":{type:GraphQLString},
    "Current_Imprint_Name":{type:GraphQLString},
    "Original_Imprint_Name":{type:GraphQLString},
    "Publisher_Name":{type:GraphQLString},
    "PUB_COUNTRY_DESC":{type:GraphQLString},
    "Onix_Format_Code":{type:GraphQLString},
    "Onix_Format_Description":{type:GraphQLString}
  })
})

const RootQuery = new GraphQLObjectType({
  name:"RootQueryType",
  fields:{
    getAllBooks:{
      type: new GraphQLList(Book),
      resolve(parent,args){
        return sheet
      }
    }
  }

})


const schema = new graphql.GraphQLSchema({query: RootQuery})

app.use('/graphql',graphqlHTTP({
  schema,
  graphiql:true
}))

app.get('/api/search', (req, res) => {

  const params = req.query;
  const invalidParamKeys = getAnyInvalidParams(headers, params);
  if (invalidParamKeys.length > 0) {
    res.send("The following key(s) are invalid: " + invalidParamKeys);
    return;
  }

  let result = searchResults.filterUsingAllParams(sheet, params);
  res.send(result);

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  sheetWrapper.extractColumnHeaders().then(data => {
    headers = data;
  })
  sheetWrapper.parse().then(data => {
    sheet = data;
  })

})



function getAnyInvalidParams(headers, params) {

  const output = [];
  const keys = Object.keys(params);
  for (var key of keys) {
    if (!headers.find(header => header.toLowerCase() === key.toLowerCase())) {
      output.push(key);
    }
  }

  return output;


}