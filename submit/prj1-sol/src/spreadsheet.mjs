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
  
   const ast_from_parse = parse(CellInfo.expr, CellInfo.id);
  let ret_aux =  eval_aux(ast_from_parse);
  updates[CellInfo.id] = ret_aux;
  return updates;





//  TEST CASE 1
// console.log("\n\tThe type of this ast node is: ",ast_from_parse.type);
   console.log("***** Start the AST *****");
   console.log();
   console.log(ast_from_parse);
   console.log("Type of ast value is: ",typeof ast_from_parse.value);
   console.log();
   console.log("***** End the AST *****");
   console.log();

// auxiliary eval method
function eval_aux(ast_node)
{
/*
   console.log("***** Start the AST *****");
   console.log(ast_node);
   console.log("***** End the AST *****");
*/
   let temp = 0;
/*
   let ret_kids = eval_kids(ast_node)
   console.log("\t\t***********************");
   console.log("\t\tThese are the kids ");
   console.log(ret_kids);
   console.log("\t\t***********************");
*/
  if(ast_node.type === 'num')
  {
     	   temp = ast_node.value;
  }
    else  if(ast_node.type === 'app')
     {
        //   let temp1 = eval_kids(ast_node.kids)
	  // console.log(temp1);
          // temp = check_fn(ast_node, CellInfo.id, CellInfo.expr,updates);
	  // console.log(temp);
	  let tmp1 = 0;
	  let tmp2 = 0;
	  let flag_num = 0;
	  let fn_ast = ast_node.fn;
        for(let i = 0; i < ast_node.kids.length; i++)
	{
          if(ast_node.kids[i].type === 'num' )
	  {
	  ast_node.kids[i] = ast_node.kids[i].value;
	  console.log("Kid ",i," = ",ast_node.kids[i]);
	  flag_num = 1
          }
	  else if(ast_node.kids[i].type === 'app')
	  {
	  tmp1 = eval_aux(ast_node.kids[i]);
          }
        }
	if(flag_num === 1)
	{
	temp = check_fn(ast_node, fn_ast);
	console.log("the result of this expression is : ",temp);
	}
     }
 
return temp;
}

// fn function
function check_fn(ast_node, fn_ast)
{
        let t = 0;
        switch(fn_ast)
	   {
		case '+':
		      t=FNS['+'](...ast_node.kids);
		      break;
		      
		case '-':
		      t = FNS['-'](ast_from_parse.kids[0].value,ast_from_parse.kids[1].value);
		      break;
		      
		case '*':
		      t = FNS['*'](ast_from_parse.kids[0].value,ast_from_parse.kids[1].value);
		      break;
		      
		case '/':
		      t = FNS['/'](ast_from_parse.kids[0].value,ast_from_parse.kids[1].value);
		      break;
		      
		case 'min':
		      t=FNS['min'](ast_from_parse.kids[0].value,ast_from_parse.kids[1].value);
		      break;
		      
		case 'max':
		      t=FNS['max'](ast_from_parse.kids[0].value,ast_from_parse.kids[1].value);
		      break;
		      
		default:
			console.log("This is a default case within app\n");
			break;

           }
	   return t;
}// fn function



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

