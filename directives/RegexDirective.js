const { GraphQLNonNull, GraphQLScalarType } = require('graphql');
const { SchemaDirectiveVisitor } = require('graphql-tools');

const validator = require('validator');

class RegexDirective extends SchemaDirectiveVisitor {
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
        validate(value, pattern);

        return type.parseValue(value);
      },

      parseLiteral(ast) {
        validate(ast.value, pattern);

        return type.parseLiteral(ast);
      }
    });
  }
}

function validate(value, pattern) {
  if (!validator.matches(value, pattern)) {
    throw new Error(`Field doesn't match given pattern`);
  }
}

module.exports = RegexDirective;
