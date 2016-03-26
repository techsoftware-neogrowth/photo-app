export const DEFAULT_LEAD_LIST = 'myLeads';
export const SYNC_FREQ = 10000;


export const LEAD_LIST_TYPES = [{
  displayName: 'My Leads',
  linkName: 'myLeads'
},
{
  displayName: 'Assigned To Me',
  linkName: 'assignedLeads'
}
];

export const LEAD_LIST_TYPES_MAP = (() => {
    let result = {}
    LEAD_LIST_TYPES.forEach((listType) => {
        result[listType.linkName] = 1
    })
    return result
})()
