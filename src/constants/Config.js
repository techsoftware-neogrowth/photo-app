var COUCH_DB_PROVIDER = require('./../dbProvider/couchDB')
var APP_DB_PROVIDER = require('./../dbProvider/localSaveDBProvider')

const DB_CONFIG_1 = {
  HOST: "172.16.16.61",
	PORT: "5984",
	PROTOCOL: "http",
	AUTH: false
}

const DB_CONFIG_2 = {
  HOST: "192.168.1.100",
	PORT: "5984",
	PROTOCOL: "http",
	AUTH: false
}

const DB_CONFIG_3 = {
  HOST: "ec2-54-169-114-27.ap-southeast-1.compute.amazonaws.com",
	PORT: "5984",
	PROTOCOL: "http",
	AUTH: false
}
export const DB_CONFIG = DB_CONFIG_3;

const LEAD_DB_NAME = 'lead';
const SERVER_HOME = DB_CONFIG.PROTOCOL + "://" + DB_CONFIG.HOST + ":" + DB_CONFIG.PORT;
const COUCH_LEAD_REST_HOOK = SERVER_HOME + "/" + LEAD_DB_NAME;

export const LEAD_REST_HOOK = COUCH_LEAD_REST_HOOK;
export const DB_PROVIDER_REMOTE = COUCH_DB_PROVIDER;
export const DB_PROVIDER = APP_DB_PROVIDER;
export const REMOTE_SERVER_HOME = SERVER_HOME;
