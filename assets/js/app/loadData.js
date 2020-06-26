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

function getRestaurantId() {
    var hash = $(location).attr('hash').replace("#", "");
    if (hash != "")
        return hash;
    else if (currentRestaurant != null)
        return currentRestaurant.id;
    else
        $('#errorMessageBox').html('<i class="fas fa-exclamation-triangle"></i> Bitte geben Sie hinter der URL das Nummern-Zeichen (#) gefolgt von der Restaurant-ID an!');
}

function loadDataIntoDashboardView() {
    getData("restaurant/" + getRestaurantId()).then(restaurant => {
        currentRestaurant = restaurant;
        clearDashboardTable();

        if (currentRestaurant.id) {
            $('#restaurantName').html(currentRestaurant.name);

            currentRestaurant.tische.forEach(tisch => {
                $('#tischTableTbody').append('<tr id="tischTableTr_tisch_' + tisch.id + '"></tr>');
                $('#tischTableTr_tisch_' + tisch.id).append('<td class="d-none">' + tisch.id + '</td>');
                $('#tischTableTr_tisch_' + tisch.id).append('<td>' + tisch.beschreibung + '</td>');
                $('#tischTableTr_tisch_' + tisch.id).append('<td>' + tisch.gaeste.length + '</td>');

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

function clearDashboardTable() {
    $('#tischTableTbody').empty();
    $('#getraenkeTableTbody').empty();
    $('#kellnerTableTbody').empty();
}

function loadDataIntoRestaurantView() {
    getData("restaurant/" + getRestaurantId()).then(restaurant => {
        currentRestaurant = restaurant;

        $('#restaurantName').html(currentRestaurant.name);

        $('#restaurantCardImage').attr('src', 'data:image/png;base64,' + currentRestaurant.bild);
        $('#restaurantCardTitle').html(currentRestaurant.name);
        $('#restaurantCardText').html(restaurant.beschreibung);

        $('#restaurantNameInput').val(currentRestaurant.name);
        $('#restaurantBeschreibungInput').val(currentRestaurant.beschreibung);
        $('#restaurantEmailInput').val(currentRestaurant.email);
        $('#restaurantPlzInput').val(currentRestaurant.standort.plz.plz);
        $('#restaurantStrasseInput').val(currentRestaurant.standort.strasse);
        $('#restaurantHausnummerInput').val(currentRestaurant.standort.hausnummer);

        $('#restaurantTischTbody').empty();
        restaurant.tische.forEach(tisch => {
            addTischToTable(tisch);
        });
    });
}

function addTischToTable(tisch) {
    $('#restaurantTischTbody').append('<tr id="restaurantTischTbody_tr_' + tisch.id + '"></tr>');
    $('#restaurantTischTbody_tr_' + tisch.id).append('<td><input type="text" onchange="updateTischInput(this)" class="form-control" id="restaurantTable_' + tisch.id + '_Input" value="' + tisch.beschreibung + '"></td>');
    $('#restaurantTischTbody_tr_' + tisch.id).append('<td class="w-40 opacity-7"><i class="fas fa-check-circle text-success big-icon mt-1"></i></td>');
    $('#restaurantTischTbody_tr_' + tisch.id).append('<td class="w-40"><i class="fas fa-minus-circle text-danger big-icon mt-1 pointer" onclick="deleteTisch(\'' + tisch.id + '\')"></i></td>');
}

function updateTischInput(tischInput) {
    tischInput.parentElement.parentElement.children[1].classList.remove("opacity-7");
    tischInput.parentElement.parentElement.children[1].classList.add("pointer");
    tischInput.parentElement.parentElement.children[1].onclick = function () {
        updateTisch(tischInput.parentElement.parentElement.id.split("_")[2]);
    };
}