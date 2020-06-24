async function getData(url) {
    // Default options are marked with *
    const response = await fetch(gastroMeApiUrl + url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'gastrome-api-auth-token': gastroMeApiAuthTokenValue,
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function patchData(url, data) {
    // Default options are marked with *
    const response = await fetch(gastroMeApiUrl + url, {
        method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'gastrome-api-auth-token': gastroMeApiAuthTokenValue,
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: data,
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function acceptOrder(getraenkOrderId){
    patchData("rechnung/acceptorder", getraenkOrderId).then(order => {
        if(order.ausgeliefert)
            $('#getraenkeTableTr_order_' + order.id + '_geliefertTd').html('<i class="fas fa-check"></i>');
    });
}

function acceptKellnerCall(tischId){
    patchData("tisch/" + tischId + "/kellner/done", null).then(tisch => {
        if(!tisch.kellnerGerufen)
            $('#kellnerTableTr_tisch_' + tisch.id + '_kellerTd').html('<i class="fas fa-check"></i>');
    });
}