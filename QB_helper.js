var API_URL="https://api.quickbase.com/v1/";
var Hostname="techforops.quickbase.com";
var QB_Token="b5by7c_pdjj_cbaygybckqf7ykb8ixdvrpjqme5";
var Table={};


var API_header={
    "Authorization": `QB-USER-TOKEN ${QB_Token}`,
    "QB-Realm-Hostname": Hostname,
    "Content-Type": "application/json"
    }

var AJAX_Config = {
    "url": `${API_URL}`,
    "timeout": 0,
    "headers":API_header
    };

module.exports={
    API_URL:API_URL,
    Hostname:Hostname,
    QB_Token:QB_Token,
    Table:Table,
    API_header:API_header,
    AJAX_Config:AJAX_Config
}