
interface IDbColumnDefinition {
  tableSchema: string;
  tableCatalog: string | null;
  tableName: string;
  columnName: string;
  description: string | null;
  nativeType: string | null;
  dotnetType: string | null;
  ordinalPosition: number | null;
  hasDefault: boolean | null;
  columnDefault: string | null;
  characherMaximumLength: number | null;
  numericPrecision: number | null;
  numericScale: number | null;
  dateTimePrecision: number | null;
  isPrimaryKey: boolean | null;
  isForeignKey: boolean | null;
  foreignKeyName: string | null;
  foreignKeySequence: number | null;
  foreignKeyReferenceCatalog: string | null;
  foreignKeyReferenceSchema: string | null;
  foreignKeyReferenceTable: string | null;
  foreignKeyReferenceColumn: string | null;
  isNullable: boolean | null;
  isAutoIncrementable: boolean | null;
  isUnique: boolean | null;
}
