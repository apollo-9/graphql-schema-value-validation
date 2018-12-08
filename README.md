# GraphQL schema value validation

![Build Status](https://travis-ci.org/apollo-9/graphql-schema-value-validation.svg?branch=develop)

This package provides custom directives for validating values in GraphQL schema. If value do not satisfy directive restriction, query will throw an error.

## Install

```
npm install graphql-schema-value-validation
```

## Directives list

Used directives should be added to schema, as listed below:

#### @length

```
directive @length(min: Int, max: Int) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION
```

#### @notEmpty

```
directive @notEmpty on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION
```

#### @range

```
directive @range (min: Int, max: Int) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION
```

#### @email

```
directive @range (min: Int, max: Int) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION
```

#### @regex

```
directive @regex (pattern: String) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION
```

#### @date

```
directive @date on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION
```

#### @url

```
directive @url on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION
```

#### @jwt

```
directive @jwt on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION
```

## Usage

Just import the implementation of the directive:

```
const {
  LengthDirective
} = require('graphql-schema-value-validation');
```

then pass it to `makeExecutableSchema` via the `code block schemaDirectives` argument:

```
const schema = makeExecutableSchema({
  typeDefs,
  schemaDirectives: {
      length: LengthDirective
  },
  resolvers
});
```

and use it in schema:

```
type Query {
  books(title: String @length(min: 1, max: 12)): [Book]
}

type Book {
  title: String
  publishDate: String
  publisherUrl: String
  author: Author
}
```

[Licence](https://github.com/apollo-9/graphql-schema-value-validation/blob/master/LICENCE)
