var PouchDB = require('./../lib/pouchdb_fix');
//var PouchDB = require('react-native-pouchdb');// remoteDB and localDB working, sync is the problem
import {DB_PROVIDER_REMOTE} from './../constants/Config'

let APP_DB_PROVIDER = {};
let userName = 'akshay';

let localLeadSaveDBName = userName + '_lead';
let localLeadAssignedDBName = userName + '_assigned';
const DB = new PouchDB(localLeadSaveDBName, {
  adapter: 'websql'
});

DB.put({_id: 1231231233333,
merchantName: 'local'});
const DB_ASSIGN = new PouchDB(localLeadAssignedDBName, {
  adapter: 'websql'
});

APP_DB_PROVIDER.fetchLeads = function(leadListsReducer, leadListReducer, dispatch, appStateReducer) {
//  DB.destroy();
console.log(leadListReducer,' --inter');
  if(leadListReducer === 'myLeads') {
    // let data ={
    //   _id: 'new_' + new Date().getTime(),
    //   opType : 'new',
    //   merchantName: 'local',
    //   contactPerson: 'localCP',
    //   phone: '12312312'
    // };
    // DB.put(data).then(function(row) {
    //           //console.log(row, 'done');
    //         });
    var promise = new Promise( function (resolve, reject) {
      DB.allDocs({
                include_docs: true,
                descending: true,
              }).then(function(json){
                  // //console.log(json, ' -- local json');
                  let rows = [];
                  if(json && json.rows && json.rows.length > 0) {
                    rows = json.rows;
                  }
                  rows = rows.map(function(pouchLead) {
                    pouchLead.doc.id = pouchLead.doc._id;
                    return pouchLead.doc;
                  });

                  return rows;
              }).then(function(localRows) {
                if(appStateReducer.isNetworkAvailable) {
                  // //console.log(DB_PROVIDER_REMOTE, '  --  DB_PROVIDER_REMOTE');
                  // let finalReturn = {};
                  // finalReturn.leads = localRows;
                  // finalReturn.nextUrl = null;
                  //
                  // resolve(finalReturn);
                  //
                  DB_PROVIDER_REMOTE.fetchLeads(leadListsReducer, leadListReducer).then(function(remoteData) {
                    let remoteRows = remoteData.rows;
                    let nextUrl = remoteData.nextUrl;

                    let finalReturn = {};
                    finalReturn.leads = localRows.concat(remoteRows);
                    finalReturn.nextUrl = nextUrl;

                    resolve(finalReturn);
                  })
                }
              });
    });
    return promise;
  } else if(leadListReducer === 'assignedLeads'){
      var promise = new Promise( function (resolve, reject) {
          DB_PROVIDER_REMOTE.fetchLeads(leadListsReducer, leadListReducer).then(function(remoteData) {
            console.log(remoteData, '  -- after remotecall');
            let remoteRows = remoteData.rows;
            let nextUrl = remoteData.nextUrl;

            let finalReturn = {};
            finalReturn.leads = remoteRows;
            finalReturn.nextUrl = nextUrl;

            resolve(finalReturn);
          })
      });
      return promise;
  }
}

APP_DB_PROVIDER.updateLead = function(leadListReducer, leadIndex, newData) {
  var promise = new Promise( function (resolve, reject) {
    if(newData.opType === undefined) {
      if(leadListReducer === 'myLeads') {
        newData.opType = 'old';
      }else if(leadListReducer === 'assignedLeads') {
        newData.opType = 'asy';
      }

    //  delete newData.id;
      delete newData._id;
      delete newData._rev;

      APP_DB_PROVIDER.addLead(leadListReducer, newData).then(function(oldAdded) {
        resolve(oldAdded, true);
      });
    }else {
      DB.put(newData).then(function(json) {
        if(json.ok) {
          DB.get(json.id).then(function (doc) {
            doc.id = doc._id;
            resolve(doc);
          }).catch(function (err) {
            //console.log(err);
          });
        }else {
          reject('error');
        }
      });
    }
  });
  return promise;
}

APP_DB_PROVIDER.addLead = function(leadListReducer, newData) {
  //console.log('app db provider');
  var promise = new Promise( function (resolve, reject) {
    if(newData.opType === undefined) {
      newData.opType = 'new';
    }

    let prefix = newData.opType + '_';
    newData._id = prefix + + new Date().getTime();

    // newData.id = newData._id;
    // resolve(newData);
    DB.put(newData).then(function(json) {
                                //console.log(json, 'done');
                                if(json.ok) {
                                  DB.get(json.id).then(function (doc) {
                                    if(!doc.id) {
                                      doc.id = doc._id;
                                    }
                                    resolve(doc);
                                  }).catch(function (err) {
                                    //console.log(err);
                                  });
                                }else {
                                  reject('error');
                                }
                              });
  });
  return promise;
}

APP_DB_PROVIDER.flushOut = function() {
  var promise = new Promise(function (resolve, reject) {
    console.log('flushing');
    DB.allDocs({
              include_docs: true,
              descending: false,
              limit: 1
            }).then(function(json){
              // resolve(json)
              if(json.rows && json.rows.length > 0) {
                let data = json.rows[0].doc;
                let bkId = data._id;
                let bkRev = data._rev;
                // return;
                if(data.opType === 'asy') {
                  delete data._id;
                  delete data._rev;
                  delete data.opType;
                  DB_PROVIDER_REMOTE.addNewLead('myLeads', data).then(function(addedLead) {
                    //if(status)
                    DB.remove(bkId, bkRev).then(function(result) {
                      data._id = bkId;
                      data._rev = bkRev;

                      let finalObj = {};
                      finalObj.flushed = data;
                      finalObj.addedLead = addedLead;
                      resolve(finalObj);
                    })
                  })
                  // put data
                }else if(data.opType === 'new') {
                  delete data._id;
                  delete data._rev;
                  delete data.opType;
                  DB_PROVIDER_REMOTE.addNewLead('myLeads', data).then(function(addedLead) {
                    //if(status)
                    DB.remove(bkId, bkRev).then(function(result) {
                      data._id = bkId;
                      data._rev = bkRev;

                      let finalObj = {};
                      finalObj.flushed = data;
                      finalObj.addedLead = addedLead;
                      resolve(finalObj);
                    })
                  })
                  // put data
                }else if(data.opType === 'old') {
                  // data._id = data.id;
                  delete data._id;
                  delete data._rev;
                  delete data.opType;

                  DB_PROVIDER_REMOTE.updateLead('myLeads', data).then(function(updateLead) {
                    //if(status)
                    DB.remove(bkId, bkRev).then(function(result) {
                      data._id = bkId;
                      data._rev = bkRev;

                      let finalObj = {};
                      finalObj.flushed = data;
                      finalObj.addedLead = updateLead;
                      resolve(finalObj);
                    })
                  })
                  // post data
                }
              }
                // //console.log(json, ' -- local json');
                // let rows = [];
                // if(json && json.rows && json.rows.length > 0) {
                //   rows = json.rows;
                // }
                // rows = rows.map(function(pouchLead) {
                //   pouchLead.doc.id = pouchLead.doc._id;
                //   return pouchLead.doc;
                // });
                //
                // return rows;
            })
  });
  return promise;
}

APP_DB_PROVIDER.getLead = function(leadId, callBack) {
  leadId = encodeURIComponent(leadId);
  let url = LEAD_REST_HOOK + `/${leadId}`;

  fetch(url).then(response => response.json()).then(json => {
    //console.log(json, '  --   json');
    callBack(json);
  });
}

module.exports = APP_DB_PROVIDER;
