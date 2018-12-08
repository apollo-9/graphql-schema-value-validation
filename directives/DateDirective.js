const { GraphQLNonNull, GraphQLScalarType } = require("graphql");
const { SchemaDirectiveVisitor } = require("graphql-tools");

const validator = require("validator");

class DateDirective extends SchemaDirectiveVisitor {
  visitInputFieldDefinition(field) {
    this.wrapType(field);
  }

  visitFieldDefinition(field) {
    this.wrapType(field);
  }

  visitArgumentDefinition(field) {
    this.wrapType(field);
  }

  wrapType(field) {
    if (
      field.type instanceof GraphQLNonNull &&
      field.type.ofType instanceof GraphQLScalarType
    ) {
      field.type = new GraphQLNonNull(new DateType(field.type.ofType));
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new DateType(field.type);
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }
  }
}

class DateType extends GraphQLScalarType {
  constructor(type) {
    super({
      name: `DateType`,

      serialize(value) {
        return type.serialize(value);
      },

      parseValue(value) {
        if (!validator.isISO8601(value)) {
          throw new Error("Date string not valid");
        }

        return type.parseValue(value);
      },

      parseLiteral(ast) {
        return type.parseLiteral(ast);
      }
    });
  }
}

module.exports = DateDirective;
