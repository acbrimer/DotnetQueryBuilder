import QueryExpressionVisitor from "./QueryExpressionVisitor";

const POSTGRES_SQL_IDENTIFIERS: string[] = ['"', '"'];

class PostgresExpressionVisitor extends QueryExpressionVisitor {
  get _sqlIdentifiers() {
    return POSTGRES_SQL_IDENTIFIERS;
  }
}

export default PostgresExpressionVisitor;
