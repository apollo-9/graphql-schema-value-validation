const { GraphQLNonNull, GraphQLScalarType } = require("graphql");
const { SchemaDirectiveVisitor } = require("graphql-tools");
const validator = require("validator");

class LengthDirective extends SchemaDirectiveVisitor {
  visitInputFieldDefinition(field) {
    this.wrapType(field);
  }

  visitFieldDefinition(field) {
    this.wrapType(field);
  }

  visitArgumentDefinition(field) {
    this.wrapType(field);
  }

  // Replace field.type with a custom GraphQLScalarType that enforces the
  // length restriction.
  wrapType(field) {
    if (
      field.type instanceof GraphQLNonNull &&
      field.type.ofType instanceof GraphQLScalarType
    ) {
      field.type = new GraphQLNonNull(
        new LimitedLengthType(field.type.ofType, this.args.max, this.args.min)
      );
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new LimitedLengthType(
        field.type,
        this.args.max,
        this.args.min
      );
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }
  }
}

class LimitedLengthType extends GraphQLScalarType {
  constructor(type, maxLength, minLength = 1) {
    super({
      name: `LimitedLengthType`,

      // For more information about GraphQLScalar type (de)serialization,
      // see the graphql-js implementation:
      // https://github.com/graphql/graphql-js/blob/31ae8a8e8312/src/type/definition.js#L425-L446

      serialize(value) {
        return type.serialize(value);
      },

      parseValue(value) {
        if (!validator.isLength(value, { min: minLength, max: maxLength })) {
          throw new Error(
            `Field's length must be between ${minLength} and ${maxLength} characters`
          );
        }

        return type.parseValue(value);
      },

      parseLiteral(ast) {
        return type.parseLiteral(ast);
      }
    });
  }
}

module.exports = LengthDirective;
