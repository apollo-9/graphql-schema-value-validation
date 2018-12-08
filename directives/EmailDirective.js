const { GraphQLNonNull, GraphQLScalarType } = require("graphql");
const { SchemaDirectiveVisitor } = require("graphql-tools");

const validator = require("validator");

class EmailDirective extends SchemaDirectiveVisitor {
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
      field.type = new GraphQLNonNull(new EmailType(field.type.ofType));
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new EmailType(field.type);
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }
  }
}

class EmailType extends GraphQLScalarType {
  constructor(type) {
    super({
      name: `EmailType`,

      serialize(value) {
        return type.serialize(value);
      },

      parseValue(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email not valid");
        }

        return type.parseValue(value);
      },

      parseLiteral(ast) {
        return type.parseLiteral(ast);
      }
    });
  }
}

module.exports = EmailDirective;
