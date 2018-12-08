const {
    GraphQLNonNull,
    GraphQLScalarType,
    GraphQLDirective,
    DirectiveLocation
  } = require('graphql');
  const { SchemaDirectiveVisitor } = require('graphql-tools');
  
  const validator = require('validator');
  
  class RegexDirective extends SchemaDirectiveVisitor {
    visitInputFieldDefinition(field) {
      this.wrapType(field);
    }
  
    visitFieldDefinition(field) {
      this.wrapType(field);
    }
  
    wrapType(field) {
      if (
        field.type instanceof GraphQLNonNull &&
        field.type.ofType instanceof GraphQLScalarType
      ) {
        field.type = new GraphQLNonNull(new RegexType(field.type.ofType));
      } else if (field.type instanceof GraphQLScalarType) {
        field.type = new RegexType(field.type, this.args.pattern);
      } else {
        throw new Error(`Not a scalar type: ${field.type}`);
      }
    }
  }
  
  class RegexType extends GraphQLScalarType {
    constructor(type, pattern) {
      super({
        name: `RegexType`,
  
        serialize(value) {
          return type.serialize(value);
        },
  
        parseValue(value) {

          if (!validator.matches(value, pattern)) {
            throw new Error(`Field doesn't match given pattern`);
          }
  
          return type.parseValue(value);
        },
  
        parseLiteral(ast) {
          return type.parseLiteral(ast);
        }
      });
    }
  }
  
  module.exports = RegexDirective;
  