//Autor: Tim Riebesam
//Klasse die Methoden beinhaltet um Daten aus dem Backend zu laden und diese im Dashboard anzuzeigen.

//Methode die nachdem das Dokument bereit ist (DOM erzeugt, ...) aufgerufen wird.
//Abhängig vom Titel des Dokuments wird die Methode loadDataIntoDashboardView oder loadDataIntoRestaurantView aufgerufen.
//Wenn die Dashbaord-Seite aufgerufen wird, wird die Methode loadDataIntoDashboardView alle 10 Sekunden aufgerufen, um die angezeigten Daten aktuell zu halten.
//Weitere Fälle wie Speisen oder Getränke sind noch nicht implementiert.
$(function () {
    switch (document.title) {
        case dashboardTitle:
            loadDataIntoDashboardView();
            setInterval(function () {
                loadDataIntoDashboardView();
            }, 10000);
            break;
        case restaurantViewTitle:
            loadDataIntoRestaurantView();
            break;
        case foodViewTitle:
            break;
        case drinkViewTitle:
            break;
        default:
            break;
    }
});

//Methode die aus dem Hash der URL die übergebene restaurantId liest. Alternativ wird versucht die restaurantId aus einer voherigen speicherung zu ziehen oder eine Fehlermeldung ausgegeben.
function getRestaurantId() {
    var hash = $(location).attr('hash').replace("#", "");
    if (hash != "")
        return hash;
    else if (currentRestaurant != null)
        return currentRestaurant.id;
    else
        $('#errorMessageBox').html('<i class="fas fa-exclamation-triangle"></i> Bitte geben Sie hinter der URL das Nummern-Zeichen (#) gefolgt von der Restaurant-ID an!');
}

//Methode die Daten für das Dashboard aus dem Backend lädt und anzeigt.
function loadDataIntoDashboardView() {
    //Hole Allgemeine Daten über das Restaurant aus dem Dashboard
    getData("restaurant/" + getRestaurantId()).then(restaurant => {
        //Restaurant global setzen und aktuelle Daten im View leeren durch clearDashboardTable();
        currentRestaurant = restaurant;
        clearDashboardTable();
        
        //Wenn Restaurant vorhanden, setzen Daten in Dashbaord
        if (currentRestaurant.id) {
            $('#restaurantName').html(currentRestaurant.name);
            //Für jeden Tisch des Restaurants Daten in Tischübersicht-Tabelle laden
            currentRestaurant.tische.forEach(tisch => {
                $('#tischTableTbody').append('<tr id="tischTableTr_tisch_' + tisch.id + '"></tr>');
                $('#tischTableTr_tisch_' + tisch.id).append('<td class="d-none">' + tisch.id + '</td>');
                $('#tischTableTr_tisch_' + tisch.id).append('<td>' + tisch.beschreibung + '</td>');
                $('#tischTableTr_tisch_' + tisch.id).append('<td>' + tisch.gaeste.length + '</td>');
                
                //Rechnung für jeden Tisch aus Backend beziehen und Rechnungsdaten des Tischs in Getränkeorder-Tabelle anzeigen
                //Wenn Order noch offen zeige Button um zu akzeptieren mit entsprechender Methode im Hintergrund, andernfalls zeige Icon für Akzeptierte Order
                getData("tisch/" + tisch.id + "/currentRechnung").then(rechnung => {
                    $('#tischTableTr_tisch_' + tisch.id).append('<td>' + calculateRechnungssumme(rechnung) + '</td>');
                    rechnung.getraenkOrders.forEach(order => {
                        $('#getraenkeTableTbody').append('<tr id="getraenkeTableTr_order_' + order.id + '"></tr>');
                        $('#getraenkeTableTr_order_' + order.id).append('<td class="d-none">' + tisch.id + '</td>');
                        $('#getraenkeTableTr_order_' + order.id).append('<td>' + tisch.beschreibung + '</td>');
                        $('#getraenkeTableTr_order_' + order.id).append('<td>' + order.getraenk.name + '</td>');
                        $('#getraenkeTableTr_order_' + order.id).append('<td>' + numberToPrice(order.getraenk.preis) + '</td>');
                        $('#getraenkeTableTr_order_' + order.id).append(order.ausgeliefert ?
                            '<td class="text-success" id="getraenkeTableTr_order_' + order.id + '_geliefertTd"><i class="fas fa-check"></i></td>' :
                            '<td class="text-success" id="getraenkeTableTr_order_' + order.id + '_geliefertTd"><div class="btn btn-success" onclick="acceptOrder(\'' + order.id + '\')">Annehmen</div></td>');
                    });
                });
                
                //Wenn an Tisch momentan Kellner gerufen, zeige entsprechenden Eintrag in Keller Gerufen Tabelle
                if (tisch.kellnerGerufen) {
                    $('#kellnerTableTbody').append('<tr id="kellnerTableTr_tisch_' + tisch.id + '"></tr>');
                    $('#kellnerTableTr_tisch_' + tisch.id).append('<td class="d-none">' + tisch.id + '</td>');
                    $('#kellnerTableTr_tisch_' + tisch.id).append('<td>' + tisch.beschreibung + '</td>');
                    $('#kellnerTableTr_tisch_' + tisch.id).append('<td class="text-success" id="kellnerTableTr_tisch_' + tisch.id + '_kellerTd"><div class="btn btn-success" onclick="acceptKellnerCall(\'' + tisch.id + '\')">Annehmen</div></td>');
                }
            });
        }
    });
}

//Löscht Daten aus den drei Tabellen des Dashboard-Views
function clearDashboardTable() {
    $('#tischTableTbody').empty();
    $('#getraenkeTableTbody').empty();
    $('#kellnerTableTbody').empty();
}

//Methode die Daten für das Restaurant aus dem Backend lädt und anzeigt.
function loadDataIntoRestaurantView() {
    //Lade Daten des Restaurant aus dem Backend
    getData("restaurant/" + getRestaurantId()).then(restaurant => {
        //Setze Global
        currentRestaurant = restaurant;
        
        //Fülle Seite mit Daten des Restaurant
        $('#restaurantName').html(currentRestaurant.name);
        $('#restaurantCardImage').attr('src', 'data:image/png;base64,' + currentRestaurant.bild);
        $('#restaurantCardTitle').html(currentRestaurant.name);
        $('#restaurantCardText').html(restaurant.beschreibung);
        
        //Fülle Form mit Daten des Restaurant
        $('#restaurantNameInput').val(currentRestaurant.name);
        $('#restaurantBeschreibungInput').val(currentRestaurant.beschreibung);
        $('#restaurantEmailInput').val(currentRestaurant.email);
        $('#restaurantPlzInput').val(currentRestaurant.standort.plz.plz);
        $('#restaurantStadtInput').val(currentRestaurant.standort.plz.stadt);
        $('#restaurantStrasseInput').val(currentRestaurant.standort.strasse);
        $('#restaurantHausnummerInput').val(currentRestaurant.standort.hausnummer);
        
        //Für jeden Tisch des Restaurant, Füge Eintrag in entsprechender Tabelle hinzu
        $('#restaurantTischTbody').empty();
        restaurant.tische.forEach(tisch => {
            addTischToTable(tisch);
        });
    });
}

//Fügt Tisch-Überischt von Restaurant-View einen weiteren Tisch hinzu, mit den Buttons QR-code einsehen, Tisch bearbeiten und Tisch löschen.
function addTischToTable(tisch) {
    $('#restaurantTischTbody').append('<tr id="restaurantTischTbody_tr_' + tisch.id + '"></tr>');
    $('#restaurantTischTbody_tr_' + tisch.id).append('<td class="w-40 pointer" onclick="showQrCode(\'' + tisch.id + '\', \'' + tisch.beschreibung + '\')"><i class="fas fa-qrcode text-warning big-icon mt-1"></i></td>');
    $('#restaurantTischTbody_tr_' + tisch.id).append('<td><input type="text" onchange="updateTischInput(this)" class="form-control" id="restaurantTable_' + tisch.id + '_Input" value="' + tisch.beschreibung + '"></td>');
    $('#restaurantTischTbody_tr_' + tisch.id).append('<td class="w-40 opacity-7"><i class="fas fa-check-circle text-success big-icon mt-1"></i></td>');
    $('#restaurantTischTbody_tr_' + tisch.id).append('<td class="w-40"><i class="fas fa-minus-circle text-danger big-icon mt-1 pointer" onclick="deleteTisch(\'' + tisch.id + '\')"></i></td>');
}

//Lädt QR-Code(s) des Tisch aus Backend in Anwendung und fügt diese dem qrCodeModal hinzu
//QRCodeModal wird anschließend angezeigt
function showQrCode(tischId, tischBeschreibung){
    getDataBlank("tisch/" + tischId + "/qr")
        .then(validateResponse)
        .then(response => response.blob())
        .then(blob => {
            $('#qrCodeFarbeImg').attr('src', URL.createObjectURL(blob));;
        });
    
    getDataBlank("tisch/" + tischId + "/qr?sw=true")
        .then(validateResponse)
        .then(response => response.blob())
        .then(blob => {
            $('#qrCodeSwImg').attr('src', URL.createObjectURL(blob));;
        });
    
    $('#qrCodeModalTitle').html(currentRestaurant.name + " | " + tischBeschreibung);
    $('#qrCodeModal').modal('show');
}

//Wenn der Name eines Tisches (Tisch-Tabelle in Restaurant-View) geändert wird, wird der Button zum Ändern der Daten "aktiviert"
//Entfernen der Transparenz, Hinzufügen des Zeigers, Hinzufügen einer Methode, die bei Klick auf den Button die Daten ans Backend sendet
function updateTischInput(tischInput) {
    tischInput.parentElement.parentElement.children[2].classList.remove("opacity-7");
    tischInput.parentElement.parentElement.children[2].classList.add("pointer");
    tischInput.parentElement.parentElement.children[2].onclick = function () {
        updateTisch(tischInput.parentElement.parentElement.id.split("_")[2]);
    };
}