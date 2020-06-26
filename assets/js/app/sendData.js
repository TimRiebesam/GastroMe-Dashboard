async function sendRestaurantData() {
    
    var file = document.getElementById('restaurantBildInput').files[0];
    var fileBase64 = file ? await toBase64(file) : "";
    
    var restaurant = {
        "name": $('#restaurantNameInput').val(),
        "beschreibung": $('#restaurantBeschreibungInput').val(),
        "email": $('#restaurantEmailInput').val(),
        "stadt": $('#restaurantStadtInput').val(),
        "plz": $('#restaurantPlzInput').val(),
        "strasse": $('#restaurantStrasseInput').val(),
        "hausnummer": $('#restaurantHausnummerInput').val(),
        "bild": fileBase64,
    }
    
    putData("restaurant/" + getRestaurantId(), JSON.stringify(restaurant)).then(data => {
        location.reload();
    });
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

function deleteTisch(tischId){
    deleteData("tisch/" + tischId);
    $('#restaurantTischTbody_tr_' + tischId).empty();
    $('#restaurantTischTbody_tr_' + tischId).remove();
}

function updateTisch(tischId){
    patchData("tisch/" + tischId, $('#restaurantTable_' + tischId + '_Input').val()).then(tisch => {
        $('#restaurantTable_' + tischId + '_Input').val(tisch.beschreibung);
        $('#restaurantTable_' + tischId + '_Input').parent().parent().children()[1].classList.add("opacity-7");
        $('#restaurantTable_' + tischId + '_Input').parent().parent().children()[1].classList.remove("pointer");
    });
}

function addTisch(){
    postData("tisch/add/restaurant/" + currentRestaurant.id + "?beschreibung=" + $('#restaurantTableNewInput').val(), null).then(tisch => {
        $('#restaurantTableNewInput').val("");
        addTischToTable(tisch);
    });
}