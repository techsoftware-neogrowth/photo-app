import moment from 'moment';
import {GENRES_MAP} from '../constants/SongConstants';
import {DB_HOME, LEAD_DB_NAME} from '../constants/DBConstants';

export function constructUrl(category) {
    const catArr = category.split(' - ');
    category = catArr[0];
    ////console.log(category)
    let result = DB_HOME + "/" + LEAD_DB_NAME + "/_all_docs?limit=5&descending=true&include_docs=true";
    if (category in GENRES_MAP) {
        if (category !== 'allLeads'
        && category !== 'myLeads'
        && category !== 'assignedToMe') {
            category = "allLeads";
        }
    } else {
      //  result += `&q=${category}`;
    }

    if (catArr.length > 1) {
      //  const formattedTime = moment().subtract(catArr[1], 'days').format('YYYY-MM-DD%2012:00:00');
      //  result += `&created_at[from]=${formattedTime}`;
    }

    return result;
}

export function constructLeadUrl(leadId) {
    leadId = encodeURIComponent(leadId);
    return DB_HOME + "/" + LEAD_DB_NAME + `/${leadId}`;
}

export function constructAddLeadUrl() {
    let leadId = Date.now();
    return DB_HOME + "/" + LEAD_DB_NAME + `/${leadId}`;
}

export function getImageUrl(str) {
    if (!str) {
        return '';
    }

    return str.replace('large', 't300x300');
}
