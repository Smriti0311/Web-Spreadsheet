import assert from 'assert';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import {AppError} from 'cs544-ss';

/** Storage web service for spreadsheets.  Will report DB errors but
 *  will not make any attempt to report spreadsheet errors like bad
 *  formula syntax or circular references (it is assumed that a higher
 *  layer takes care of checking for this and the inputs to this
 *  service have already been validated).
 */

//some common HTTP status codes; not all codes may be necessary
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

export default function serve(port, ssStore) {
  const app = express();
  app.locals.port = port;
  app.locals.ssStore = ssStore;
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}

const CORS_OPTIONS = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  exposedHeaders: 'Location',
};

const BASE = 'api';
const STORE = 'store';


function setupRoutes(app) {
  app.use(cors(CORS_OPTIONS));  //needed for future projects
  //@TODO add routes to handlers
  app.use(bodyParser.json());
  app.get(`/${BASE}/${STORE}/:id`,doGet(app));
  app.delete(`/${BASE}/${STORE}/:ssname/:id`,doDelete(app));
  app.delete(`/${BASE}/${STORE}/:id`, doClear(app));
  app.patch(`/${BASE}/${STORE}/:id`, doUpdateAll(app));


 //must be last
 app.use(do404(app));
 app.use(doErrors(app));
  
}

/****************************** Handlers *******************************/

//@TODO

function doUpdateAll(app){
  return (async function(req, res){
    try {
      const id = req.params.id;
      const ssname = req.params.ssname;
      const body = req.body;
      //console.log('req params is ',id);
      //console.log('req body is ', body);
      //console.log('type of collection name = ',typeof ssname);
      let results = {}
      for(let b of body){
        //console.log('type of Cell id ',typeof b[0]);
        //console.log('type of Cell formula', typeof b[1]);
        results = await app.locals.ssStore.updateCell(id, b[0], b[1].toString());
      }
      res.status(NO_CONTENT).json(results);
      
    }
    catch (err){
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}




  
function doGet(app){
 return (async function(req, res){
 try {
 const testss = req.params.id;
 //console.log("testss is",testss);
 const results = await app.locals.ssStore.readFormulas(testss);
 res.json(results);

 }
 catch(err) {
 const mapped = mapError(err);
 res.status(mapped.status).json(mapped);
    }
  });
 }


 function doDelete(app){
   return (async function(req, res){
     try{
       const id = req.params.id;
       const ssname = req.params.ssname;
       console.log('The id is ',id);
       console.log('The ssname is ',ssname);
       //const results = {};
       const results = await app.locals.ssStore.delete(ssname, id);
       res.status(204).json(results);
     }
     catch(err){
       const mapped = mapError(err);
       res.status(mapped.status).json(mapped);
     }
   });

 }
 


 function doClear(app){
   return (async function(req, res){
     try{
       const id = req.params.id;
       const results = await app.locals.ssStore.clear(id);
       res.status(204).json(results);
     }
     catch(err){
       const mapped = mapError(err);
       res.status(mapped.status).json(mapped);
     }
   });
 }


 



/** Default handler for when there is no route for a particular method
 *  and path.
 */
function do404(app) {
  return async function(req, res) {
    const message = `${req.method} not supported for ${req.originalUrl}`;
    const result = {
      status: NOT_FOUND,
      error: { code: 'NOT_FOUND', message, },
    };
    res.status(404).
	json(result);
  };
}


/** Ensures a server error results in nice JSON sent back to client
 *  with details logged on console.
 */ 
function doErrors(app) {
  return async function(err, req, res, next) {
    const result = {
      status: SERVER_ERROR,
      error: { code: 'SERVER_ERROR', message: err.message },
    };
    res.status(SERVER_ERROR).json(result);
    console.error(err);
  };
}


/*************************** Mapping Errors ****************************/

const ERROR_MAP = {

};

/** Map domain/internal errors into suitable HTTP errors.  Return'd
 *  object will have a "status" property corresponding to HTTP status
 *  code and an error property containing an object with with code and
 *  message properties.
 */
function mapError(err) {
  const isDomainError = (err instanceof AppError);
  const status =
    isDomainError ? (ERROR_MAP[err.code] || BAD_REQUEST) : SERVER_ERROR;
  const error = 
	isDomainError
	? { code: err.code, message: err.message } 
        : { code: 'SERVER_ERROR', message: err.toString() };
  if (!isDomainError) console.error(err);
  return { status, error };
} 

/****************************** Utilities ******************************/



/** Return original URL for req */
function requestUrl(req) {
  const port = req.app.locals.port;
  return `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
}
