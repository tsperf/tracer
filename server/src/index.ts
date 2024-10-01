// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';
// import { typeLine, traceLine } from './traceData';

// import * as dbSchema from './dbSchema';
// import { loadTrace } from './traceDir';
// import { printTree, runLiveTrace } from './tsTrace';
import * as server from './server'

async function main() {
  // const db = await open({
  //    filename: '/tmp/database.db',
  //    driver: sqlite3.Database,
  // });
  // await db.exec('PRAGMA journal_mode=MEMORY;');
  // //    await db.exec('PRAGMA journal_mode=OFF;');
  // await dbSchema.createTable(db, 'TypeLine', typeLine);
  // await dbSchema.createTable(db, 'TraceLine', traceLine);
  // await db.exec('begin transaction');
  // await loadTrace();
  // await db.exec('end transaction');

  // runLiveTrace('/home/hw/projects/tracer/playground', '/tmp/tsTrace');
  // printTree();
  server.init()
}

main()
