import parse from './expr-parser.mjs';
import AppError from './app-error.mjs';
import { cellRefToCellId }  from './util.mjs';
import { indexToColSpec } from './util.mjs';
import LIMITS from './limits.mjs';

//use for development only
import { inspect } from 'util';


class CellInfo{
constructor(id, expr, value=0, dependents = new Set(), ast)
{
 this.id = id;
 this.expr = expr;
 this.value = value;
 this.dependents = dependents;
 this.ast = ast;
}
}


export default class Spreadsheet {



  //factory method
  static async make() { return new Spreadsheet(); }


  constructor() {
    //@TODO
   
   for(let i = 1; i <= LIMITS.MAX_N_ROWS; i++){
      for(let j = 0; j < LIMITS.MAX_N_COLS; j++){
     
   
    let c = indexToColSpec(j);
    let temp_id_string = c + String(i);
    const cellinfo = new CellInfo(temp_id_string, 'no expr', 0, new Set(), ' ');

}
   }

}
  

  /** Set cell with id baseCellId to result of evaluating formula
   *  specified by the string expr.  Update all cells which are
   *  directly or indirectly dependent on the base cell.  Return an
   *  object mapping the id's of all dependent cells to their updated
   *  values.  User errors must be reported by throwing a suitable
   *  AppError object having code property set to `SYNTAX` for a
   *  syntax error and `CIRCULAR_REF` for a circular reference
   *  and message property set to a suitable error message.
   */
  async eval(baseCellId, expr) {
    const updates = {};
    
   CellInfo.id = baseCellId;
   CellInfo.expr = expr
   updates[CellInfo.id] = CellInfo.expr;
   const ast_from_parse = parse(CellInfo.expr, CellInfo.id)
//   console.log(inspect(ast_from_parse, false, Infinity));
//   function num_from_ast1(ast_from_parse){
//     function num_from_ast2(ast_from_parse){
//return ast_from_parse.value;
//}
//}

   console.log("The node's value: ", ast_from_parse.value);


   return updates;
  }



  //@TODO add methods
}

//Map fn property of Ast type === 'app' to corresponding function.
const FNS = {
  '+': (a, b) => a + b,
  '-': (a, b=null) => b === null ? -a : a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  min: (...args) => Math.min(...args),
  max: (...args) => Math.max(...args),
}


//@TODO add other classes, functions, constants etc as needed

