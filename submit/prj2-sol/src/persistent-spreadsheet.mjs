import AppError from './app-error.mjs';
import MemSpreadsheet from './mem-spreadsheet.mjs';

//use for development only
import { inspect } from 'util';

import mongo from 'mongodb';
import { runInThisContext } from 'vm';

//use in mongo.connect() to avoid warning
const MONGO_CONNECT_OPTIONS = { useUnifiedTopology: true };

const DB_NAME = 'spreadsheets';


/**
 * User errors must be reported by throwing a suitable
 * AppError object having a suitable message property
 * and code property set as follows:
 *
 *  `SYNTAX`: for a syntax error.
 *  `CIRCULAR_REF` for a circular reference.
 *  `DB`: database error.
 */

export default class PersistentSpreadsheet {

  //factory method
  static async make(dbUrl, spreadsheetName) {
    try {
      //@TODO set up database info, including reading data
      const client = await mongo.connect(dbUrl, MONGO_CONNECT_OPTIONS);
      const db = client.db();
      //console.log('DB name: ',client.db().databaseName);
      const col = db.collection(spreadsheetName);
      
      const memss = new MemSpreadsheet();

      //console.log('Collection Name: ',col.collectionName);
      return new PersistentSpreadsheet({client, col, memss});
    }
    catch (err) {
      const msg = `cannot connect to URL "${dbUrl}": ${err}`;
      throw new AppError('DB', msg);
    }
    return new PersistentSpreadsheet({client, col, memss});
  }

  //assign;

  constructor(props) {
    //@TODO
    this.assign = Object.assign(this, props);
  }

  /** Release all resources held by persistent spreadsheet.
   *  Specifically, close any database connections.
   */
  async close() {
    //@TODO
    try{
      await this.client.close();
    }
    catch(err){
      throw new AppError('DB',err.toString());
    }
  }

  /** Set cell with id baseCellId to result of evaluating string
   *  formula.  Update all cells which are directly or indirectly
   *  dependent on the base cell.  Return an object mapping the id's
   *  of all dependent cells to their updated values.
   */
  async eval(baseCellId, formula) {
    
    const x = await this.preprocess();
    
    //console.log('logging x of eval: ', x);
    const results = this.memss.eval(baseCellId, formula);
    //console.log('logging results of eval: ', results);
    //console.log('Properties of x in eval: ',Object.getOwnPropertyNames(x));
    try {
      //@TODO
      
      
      
      // write function to check if this cell is already initialised in db
      //const temp = await this.col.find({id:baseCellId}).toArray();

      const x  = await this.indb(baseCellId);
      //console.log('Checking if it already exists in  db: ');
      //console.log(x)

      // if(!x)
      // {
      //   await this.col.insertOne({id: baseCellId, formula: formula});
      // }
      
      //const ret = this.memss.getCell(baseCellId);


      const query = {id: baseCellId};
      const update = {$set: {id: baseCellId, formula: formula}};
      const options =  {upsert: true};
      await this.col.updateOne(query, update, options);
    
    }
    catch (err) {
      //@TODO undo mem-spreadsheet operation
      this.memss.undo();
      const msg = `cannot update "${baseCellId}: ${err}`;
      throw new AppError('DB', msg);
    }
    return results;
  }

  /** return object containing formula and value for cell cellId 
   *  return { value: 0, formula: '' } for an empty cell.
   */
  async query(cellId) {
    
    const x = await this.preprocess();
    //console.log('logging in persistent', x);
    
    return this.memss.query(cellId); 
  }

  /** Clear contents of this spreadsheet */
  async clear() {
    try {
      //@TODO
      const x = await this.preprocess();
      await this.col.deleteMany({});
    }
    catch (err) {
      const msg = `cannot drop collection ${this.spreadsheetName}: ${err}`;
      throw new AppError('DB', msg);
    }
    /* @TODO delegate to in-memory spreadsheet */
    this.memss.clear();
  }

  /** Delete all info for cellId from this spreadsheet. Return an
   *  object mapping the id's of all dependent cells to their updated
   *  values.  
   */


  async delete(cellId) {

    //const x = await this.preprocess();
    let results = this.memss.delete(cellId);//{};
    

    try {
      //@TODO
      await this.col.deleteOne({id: cellId});
    }
    catch (err) {
      //@TODO undo mem-spreadsheet operation
      this.memss.undo();
      const msg = `cannot delete ${cellId}: ${err}`;
      throw new AppError('DB', msg);
    }
    return results;
  }


  
  /** copy formula from srcCellId to destCellId, adjusting any
   *  relative cell references suitably.  Return an object mapping the
   *  id's of all dependent cells to their updated values. Copying
   *  an empty cell is equivalent to deleting the destination cell.
   */


   

  async copy(destCellId, srcCellId) {
    const x = await this.preprocess();
    const srcFormula = /* @TODO get formula by querying mem-spreadsheet */ {};//this.memss.adjust(destCellId, srcCellId);//
    if (!srcFormula) {
      return await this.delete(destCellId);
    }
    else {
      const results = /* @TODO delegate to in-memory spreadsheet */{}; //this.memss.copy(destCellId, srcCellId); 
      try {
        //@TODO
        // const query = {id: destCellId};
        // const update = {$set: {id: destCellId, formula: srcFormula}};
        // const options = {upsert: true};
        // await this.col.updateOne(query, update, options);
      }
      catch (err) {
  //@TODO undo mem-spreadsheet operation
  //this.memss.undo();
	const msg = `cannot update "${destCellId}: ${err}`;
	throw new AppError('DB', msg);
      }
      return results;
    }
  }
  




  /** Return dump of cell values as list of cellId and formula pairs.
   *  Do not include any cell's with empty formula.
   *
   *  Returned list must be sorted by cellId with primary order being
   *  topological (cell A < cell B when B depends on A) and secondary
   *  order being lexicographical (when cells have no dependency
   *  relation). 
   *
   *  Specifically, the cells must be dumped in a non-decreasing depth
   *  order:
   *     
   *    + The depth of a cell with no dependencies is 0.
   *
   *    + The depth of a cell C with direct prerequisite cells
   *      C1, ..., Cn is max(depth(C1), .... depth(Cn)) + 1.
   *
   *  Cells having the same depth must be sorted in lexicographic order
   *  by their IDs.
   *
   *  Note that empty cells must be ignored during the topological
   *  sort.
   */




  async dump() {
    const x = await this.preprocess();
    return /* @TODO delegate to in-memory spreadsheet */ []; //this.memss.dump();
  }





  async preprocess()
  {
    //console.log('Test print in preprocess');
    const x = await this.col.find({}).toArray();
    for(let i = 0; i < x.length; i++)
    {
      //this.memss.eval()
      this.memss.eval(x[i].id, x[i].formula);
    }
    //console.log('Logging x in find_db: ',x);
    return x;
  }

  async indb(baseCellId)
  {
    const x = await this.col.find({id: baseCellId}).toArray();
    return x;
  }

  


}

//@TODO auxiliary functions
