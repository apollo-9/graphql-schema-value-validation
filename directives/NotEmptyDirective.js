const { GraphQLNonNull, GraphQLScalarType } = require('graphql');
const { SchemaDirectiveVisitor } = require('graphql-tools');

class NotEmptyDirective extends SchemaDirectiveVisitor {
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
      field.type = new GraphQLNonNull(new NotEmptyType(field.type.ofType));
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new NotEmptyType(field.type);
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }
  }
}

class NotEmptyType extends GraphQLScalarType {
  constructor(type) {
    super({
      name: `NotEmptyType`,

      // For more information about GraphQLScalar type (de)serialization,
      // see the graphql-js implementation:
      // https://github.com/graphql/graphql-js/blob/31ae8a8e8312/src/type/definition.js#L425-L446

      serialize(value) {
        return type.serialize(value);
      },

      parseValue(value) {
        validate(value);

        return type.parseValue(value);
      },

      parseLiteral(ast) {
        validate(ast.value);

        return type.parseLiteral(ast);
      }
    });
  }
}

function validate(value) {
  if (!value) {
    throw new Error(`Field's value can not be empty`);
  }
}

module.exports = NotEmptyDirective;
