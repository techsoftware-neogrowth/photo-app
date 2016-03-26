import {LEAD_REST_HOOK, REMOTE_SERVER_HOME} from './../constants/Config'
import {getReceiveLeadsAction, getRequestLeadsAction, getUpdateLeadAction, getAddLeadAction} from './../actions/leadlists'

import {arrayOf, normalize, Schema} from 'normalizr'
let lodObj = require('lodash');
//
// // console.log(lodObj);
// //
//  var s3_policy = require('./../lib/s3_policy');
// let s3_opts = {
//   bucket: 'ngdev01',
//   region: 'ap-southeast-1a',
//   key: 'AKIAJHOPTQXNQHTLG5SQ',
//   secret: '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',
//   type: 'image/',
//   path: 'images/',
//   acl: 'public-read',
//   expires: new Date(Date.now() + 60000),
//   length: 10485760, // 10M as maximal size
// };

module.exports.fetchLeads = function(leadListsReducer, leadListReducer) {
  let url = getNextUrl(leadListsReducer, leadListReducer);
  // console.log(url, ' -- url');
  return fetch(url).then(response => response.json()).then(json => {
    //console.log(url, "   ;;  fetching ");
      let nextUrl = null;
      let rows = [];

      if(json && json.rows && json.rows.length > 0) {
        rows = json.rows;
        if(json.rows.length > 1) {
          let lastRow =json.rows[json.rows.length - 1];
          let nextStartKey = lastRow.id;
          nextUrl = LEAD_REST_HOOK + "/_all_docs?include_docs=true&limit=5&skip=1&descending=true&startkey_docid=" + nextStartKey;
          // if(url.indexOf("&startkey_docid=") != -1) {
          //   rows.pop();
          // }
        }

        rows = rows.map(function(couchLead) {
          couchLead.doc.id = couchLead.doc._id;
          couchLead.doc.rev = couchLead.doc._rev;

          // delete couchLead.doc._id;
          // delete couchLead.doc._rev;
          return couchLead.doc;
        });

        return {rows: rows,
                nextUrl: nextUrl};
      }else {
        return {rows: []};
      }
    }).catch(function(error) {
      console.log(error)
      return {rows: []};
    })
}

module.exports.updateLead = function(leadListReducer, newData) {
  var promise = new Promise(function(resolve, reject) {
    let leadId = newData.id;
    leadId = encodeURIComponent(leadId);
    let url = LEAD_REST_HOOK + `/${leadId}`;
    //console.log(url, "   ;;  updating ");
   delete newData.id;
   newData._id = leadId;
   newData._rev = newData.rev;
   delete newData.rev;

    return fetch(url, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
    }).then(response => response.json()).then(json => {
        //console.log(json);
        if(json.ok) {
          getLead(leadId).then(function(updatedLead) {
            if(updatedLead && updatedLead._id) {
              updatedLead.id = updatedLead._id;
              updatedLead.rev = updatedLead._rev;
              delete updatedLead._id;
              delete updatedLead._rev;
            }
            resolve(updatedLead);
          });
        }
      }).catch(error => console.log(error))
  })
  return promise;

}

module.exports.addLead = function(leadListReducer, newData, dispatch) {
  var promise = new Promise(function(resolve, reject) {
    let leadId = Date.now();
    leadId = encodeURIComponent(leadId);
    let url = LEAD_REST_HOOK + `/${leadId}`;

    return fetch(url, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
    }).then(response => response.json()).then(json => {
        //console.log(json);
        if(json.ok) {
          getLead(leadId).then(function(addedLead) {
            if(addedLead && addedLead._id) {
              addedLead.id = addedLead._id;
              addedLead.rev = addedLead._rev;
              delete addedLead._id;
              delete addedLead._rev;
            }
            resolve(addedLead);
          });
        }
      }).catch(error => console.log(error))
  });
  return promise;
}

function getNextUrl(leadListsReducer, leadListReducer) {
  const activeIndividualLeadList = leadListsReducer[leadListReducer]
  if (!activeIndividualLeadList || activeIndividualLeadList.nextUrl === false) {
    let url = REMOTE_SERVER_HOME;
    if(leadListReducer === 'myLeads') {
      url = url + "/lead";
    }else if(leadListReducer === 'assignedLeads') {
      url = url + "/assigned";
    }
    return url + "/_all_docs?include_docs=true&limit=5&descending=true";
  }
  return activeIndividualLeadList.nextUrl
}

function getLead(leadId) {
  var promise = new Promise(function(resolve, reject) {
    leadId = encodeURIComponent(leadId);
    let url = LEAD_REST_HOOK + `/${leadId}`;

    fetch(url).then(response => response.json()).then(json => {
      resolve(json);
    });
  });
  return promise;
}

export function addNewLead(leadListReducer, newData) {
  console.log(newData,'   ---  will add');
  var promise = new Promise(function(resolve, reject) {
    let leadId = Date.now();
    leadId = encodeURIComponent(leadId);
    let url = LEAD_REST_HOOK + `/${leadId}`;

    fetch(url, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
    }).then(response => response.json()).then(json => {
        //console.log(json);
        if(json.ok) {
          getLead(json.id).then(function (doc) {
            doc.id = doc._id;
            resolve(doc);
          }).catch(function (err) {
            //console.log(err);
          });
        }
      });

  });
  return promise;
}
