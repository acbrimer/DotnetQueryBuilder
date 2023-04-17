import NodeSQLParser from "node-sql-parser";

const parser = new NodeSQLParser.Parser();

class QueryExpressionParser {
  Astify(sql: string) {
    return parser.astify(sql);
  }

  Parse(sql: string) {
    const isSelect = sql.trimStart().toUpperCase().startsWith("SELECT");
    const ast: NodeSQLParser.Select = parser.astify(
      isSelect ? sql : `SELECT ${sql}`,
      {
        database: "TransactSQL",
      }
    ) as NodeSQLParser.Select;
    if (isSelect) return this.ToQE(ast);
    return this.ToQE(ast.columns[0]);
  }

  ToQEPredicate(expr: any): any {
    if (
      expr.operator.toLowerCase() === "and" ||
      expr.operator.toLowerCase() === "or"
    ) {
      return {
        _type: expr.operator.toLowerCase(),
        expressions: [expr.left, expr.right].flatMap((e: any) =>
          this.ToQEPredicate(e)
        ),
      } as any;
    }
    return {
      _type: "predicate",
      operator: expr.operator,
      left:
        expr.left && expr.left.type === "binary_expr"
          ? this.ToQEPredicate(expr.left)
          : this.ToQE(expr.left),
      right:
        expr.right && expr.right.type === "binary_expr"
          ? this.ToQEPredicate(expr.right)
          : this.ToQE(expr.right),
    } as any;
  }

  ToQE(ast: any): any {
    const expr = Object.keys(ast).includes("expr") ? ast.expr : ast;
    const alias = Object.keys(ast).includes("as") ? ast.as : null;

    if (expr.type === "select") {
      let fromClause = null;
      let joinClause = null;
      if (expr.from && expr.from.length > 0) {
        const firstTable = expr.from[0];
        if (Object.keys(firstTable).includes("expr"))
          fromClause = this.ToQE(firstTable);
        else
          fromClause = {
            _type: "table",
            schema: firstTable.db,
            table: firstTable.table,
            alias: firstTable.as,
          } as any;
      }

      if (expr.from && expr.from.length > 1) {
        joinClause = [];
        for (let j = 1; j < expr.from.length; j++) {
          const tableExp = expr.from[j];
          const target = Object.keys(tableExp).includes("expr")
            ? this.ToQE(tableExp)
            : {
                _type: "table",
                schema: tableExp.db,
                table: tableExp.table,
                alias: tableExp.as,
              };
          if (Object.keys(tableExp).includes("expr"))
            joinClause.push(this.ToQE(tableExp));
          else
            joinClause.push({
              _type: "join",
              condition: this.ToQEPredicate(tableExp),
              target: target,
            });
        }
      }

      return {
        _type: "select",
        columns: expr.columns.map((c: any) => this.ToQE(c)),
        fromClause: fromClause,
        joinClause: joinClause,
        whereClause:
          expr.where && expr.where !== null
            ? this.ToQEPredicate(expr.where)
            : null,
      } as any;
    }

    if (expr.type === "number") {
      return {
        _type: "constant",
        value: expr.value,
        commonType: Number.isInteger(expr.value) ? "integer" : "decimal",
      } as any;
    }

    if (expr.type === "single_quote_string") {
      return {
        _type: "constant",
        value: expr.value,
        commonType: "string",
      } as any;
    }

    if (expr.type === "column_ref") {
      return {
        _type: "column",
        name: expr.column,
        table: expr.table || null,
        alias: alias,
      } as any;
    }

    if (expr.type === "binary_expr") {
      return {
        _type: "binary",
        operator: expr.operator,
        left: this.ToQE(expr.left),
        right: this.ToQE(expr.right),
        alias: alias,
      } as any;
    }

    if (expr.type === "aggr_func") {
      return {
        _type: "aggregate",
        function: expr.name,
        expression: this.ToQE(expr.args),
        alias: alias,
      } as any;
    }

    if (expr.type === "function") {
      if (expr.name.toUpperCase() === "CONCAT")
        return {
          _type: "concat",
          arguments: expr.args.value.map((e: any) => this.ToQE(e)),
          alias: alias,
        } as any;
    }
    return null;
  }
}

export default QueryExpressionParser;
