//Autor: Tim Riebesam
//Klasse die Methoden beinhaltet um neue/ geänderte Daten an das Backend zu senden.

//Methode die die Form-Daten des Restaurant-View an das Backend als PUT-Request sendet.
async function sendRestaurantData() {
    //Form-Input des Bildes wird in Base64-Format umgewandelt.
    var file = document.getElementById('restaurantBildInput').files[0];
    var fileBase64 = file ? await toBase64(file) : "";
    
    //Variable in JSON-Form, welche an Backend als Request-Body gesendet werden kann.
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
    
    //Aufruf der putData-Funktion mit URL wohin Daten gesendet werden sollten und JSON-Objekt der zuvor erstellten Restaurant-Variable
    putData("restaurant/" + getRestaurantId(), JSON.stringify(restaurant)).then(data => {
        location.reload();
    });
}

//Methode welche einen Patch-Request ans Backend sendet und den Status einer Getränk-Order auf "geliefert" setzt.
function acceptOrder(getraenkOrderId){
    patchData("rechnung/acceptorder", getraenkOrderId).then(order => {
        if(order.ausgeliefert)
            $('#getraenkeTableTr_order_' + order.id + '_geliefertTd').html('<i class="fas fa-check"></i>');
    });
}

//Methode welche einen Patch-Request ans Backend sendet und den Status einer Kellner-gerufen-bitte auf "done" setzt.
function acceptKellnerCall(tischId){
    patchData("tisch/" + tischId + "/kellner/done", null).then(tisch => {
        if(!tisch.kellnerGerufen)
            $('#kellnerTableTr_tisch_' + tisch.id + '_kellerTd').html('<i class="fas fa-check"></i>');
    });
}

//Methode die einen Delete-Request ans Backend sendet und einen Tisch löscht. Tisch wird aus View entfernt.
function deleteTisch(tischId){
    deleteData("tisch/" + tischId);
    $('#restaurantTischTbody_tr_' + tischId).empty();
    $('#restaurantTischTbody_tr_' + tischId).remove();
}

//Methode die einen Patch-Request ans Backend sendet und einen Tisch bearbeitet. Wenn erfolgreich werden Daten aktualisiert und der Button zum Änderungen senden wieder "deaktiviert"
function updateTisch(tischId){
    patchData("tisch/" + tischId, $('#restaurantTable_' + tischId + '_Input').val()).then(tisch => {
        $('#restaurantTable_' + tischId + '_Input').val(tisch.beschreibung);
        $('#restaurantTable_' + tischId + '_Input').parent().parent().children()[2].classList.add("opacity-7");
        $('#restaurantTable_' + tischId + '_Input').parent().parent().children()[2].classList.remove("pointer");
    });
}

//Methode die einen POST-Request ans Backend sendet und einen Tisch hinzufügt. Tisch wird bei Erfolg dem View hinzugefügt.
function addTisch(){
    postData("tisch/add/restaurant/" + currentRestaurant.id + "?beschreibung=" + $('#restaurantTableNewInput').val(), null).then(tisch => {
        $('#restaurantTableNewInput').val("");
        addTischToTable(tisch);
    });
}