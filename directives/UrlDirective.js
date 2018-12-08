const { GraphQLNonNull, GraphQLScalarType } = require("graphql");
const { SchemaDirectiveVisitor } = require("graphql-tools");

const validator = require("validator");

class UrlDirective extends SchemaDirectiveVisitor {
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
      field.type = new GraphQLNonNull(new UrlType(field.type.ofType));
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new UrlType(field.type);
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }
  }
}

class UrlType extends GraphQLScalarType {
  constructor(type) {
    super({
      name: `UrlType`,

      serialize(value) {
        return type.serialize(value);
      },

      parseValue(value) {
        if (!validator.isURL(value)) {
          throw new Error("URL not valid");
        }

        return type.parseValue(value);
      },

      parseLiteral(ast) {
        return type.parseLiteral(ast);
      }
    });
  }
}

module.exports = UrlDirective;
