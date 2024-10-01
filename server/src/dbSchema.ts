// import { Database, Statement } from 'sqlite';
// import sqlite3 from 'sqlite3';
// import {
//    ZodArray,
//    ZodNumber,
//    ZodOptional,
//    ZodString,
//    ZodType,
//    ZodObject,
//    ZodDefault,
// } from 'zod';

// export type DB = Database<sqlite3.Database, sqlite3.Statement>;

// export function createSchema(db: DB) {}

// export const tableColumns = new Map<string, string[]>();

// export const inserts = new Map<
//    string,
//    (rec: Record<string, any>[]) => Promise<number>
// >();

// export async function mkInsert(db: DB, tableName: string) {
//    const cached = inserts.get(tableName);
//    if (cached) return cached;

//    const columns = tableColumns.get(tableName)!;
//    const marks = `(${columns.map((x) => '?').join(',')})`;
//    const multi = `${marks},`.repeat(19) + marks;
//    const sqlStr = `insert into ${tableName} ( ${columns.join(
//       ','
//    )} ) values ${multi}`;

//    console.log(sqlStr);
//    const sql = await db.prepare(sqlStr);

//    let id = 0;
//    const fn = async (recs: Record<string, any>[]) => {
//       const thisId = id++;
//       await sql.bind(
//          recs
//             .map((rec) => columns.map((x) => (x === '"$id"' ? thisId : rec[x])))
//             .flat()
//       );
//       sql.run();
//       return thisId;
//    };

//    inserts.set(tableName, fn);
//    return fn;
// }

// export async function createTable(
//    db: Database,
//    tableName: string,
//    zodObject: ZodObject<any> | ZodOptional<any> | ZodDefault<any>,
//    parentTables: string[] = []
// ) {
//    const ids = ['id', ...parentTables];
//    const columns: string[] = ids.map((x) => `"$${x}"`);
//    tableColumns.set(tableName, columns);

//    const columnsPrefix = ids.map((x) => `"$${x}" number`).join(',');

//    if (zodObject instanceof ZodOptional || zodObject instanceof ZodDefault) {
//       createTable(db, tableName, zodObject._def.innerType, parentTables);
//       return;
//    }
//    let sql = `create table if not exists ${tableName} ( ${columnsPrefix}`;
//    for (const columnName in zodObject.shape) {
//       const type = zodObject.shape[columnName as keyof typeof zodObject.shape];
//       const sqlType = getSqlType(type);
//       if (sqlType === 'zodObject') {
//          createTable(db, columnName, type, [tableName]);
//       } else {
//          columns.push(columnName);
//          sql += ', ' + columnName + ' ' + getSqlType(type);
//       }
//    }
//    sql += ')';

//    console.log(sql, '\n');
//    await db.exec(sql);
//    await mkInsert(db, tableName);
// }

// function getSqlType(type: ZodType) {
//    if (type instanceof ZodOptional || type instanceof ZodDefault)
//       return getSqlType(type._def.innerType);
//    if (type instanceof ZodNumber) return 'number';
//    if (type instanceof ZodString) return 'string';
//    if (type instanceof ZodArray) return 'json_array';
//    if (type instanceof ZodObject) return 'zodObject';
//    debugger;
// }
