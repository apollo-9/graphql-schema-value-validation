const { GraphQLNonNull, GraphQLScalarType } = require('graphql');
const { SchemaDirectiveVisitor } = require('graphql-tools');

const validator = require('validator');

class JwtDirective extends SchemaDirectiveVisitor {
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
      field.type = new GraphQLNonNull(new JwtType(field.type.ofType));
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new JwtType(field.type);
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }
  }
}

class JwtType extends GraphQLScalarType {
  constructor(type) {
    super({
      name: `JwtType`,

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
  if (!validator.isJWT(value)) {
    throw new Error('JWT not valid');
  }
}

module.exports = JwtDirective;
