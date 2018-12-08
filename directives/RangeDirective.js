const { GraphQLNonNull, GraphQLScalarType } = require("graphql");
const { SchemaDirectiveVisitor } = require("graphql-tools");

class RangeDirective extends SchemaDirectiveVisitor {
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
        new RangeType(field.type.ofType, this.args.min, this.args.max)
      );
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new RangeType(field.type, this.args.min, this.args.max);
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }
  }
}

class RangeType extends GraphQLScalarType {
  constructor(type, minValue, maxValue) {
    super({
      name: `RangeType`,

      // For more information about GraphQLScalar type (de)serialization,
      // see the graphql-js implementation:
      // https://github.com/graphql/graphql-js/blob/31ae8a8e8312/src/type/definition.js#L425-L446

      serialize(value) {
        return type.serialize(value);
      },

      parseValue(value) {
        if (value >= minValue && value < maxValue) {
          return type.parseValue(value);
        } else {
          throw new Error(
            `Field's value should be between ${minValue} and ${maxValue}`
          );
        }
      },

      parseLiteral(ast) {
        return type.parseLiteral(ast);
      }
    });
  }
}

module.exports = RangeDirective;
