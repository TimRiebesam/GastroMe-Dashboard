$(function () {
    loadData();
    setInterval(function () {
        loadData();
    }, 10000);
});

function loadData() {
    var hash = $(location).attr('hash').replace("#", "");
    if (hash != "")
        loadDataIntoView(hash);
    else
        $('#errorMessageBox').html('<i class="fas fa-exclamation-triangle"></i> Bitte geben Sie hinter der URL das Nummern-Zeichen (#) gefolgt von der Restaurant-ID an!');
}

function loadDataIntoView(hash) {
    getData("restaurant/" + hash).then(data => {
        currentRestaurant = data;
        clearTable();

        if (currentRestaurant.id === hash) {
            $('#restaurantName').html(currentRestaurant.name);

            currentRestaurant.tische.forEach(tisch => {
                $('#tischTableTbody').append('<tr id="tischTableTr_tisch_' + tisch.id + '"></tr>');
                $('#tischTableTr_tisch_' + tisch.id).append('<td>' + tisch.id + '</td>');
                $('#tischTableTr_tisch_' + tisch.id).append('<td>' + tisch.beschreibung + '</td>');
                $('#tischTableTr_tisch_' + tisch.id).append('<td>' + tisch.gaeste.length + '</td>');

                getData("tisch/" + tisch.id + "/currentRechnung").then(rechnung => {
                    $('#tischTableTr_tisch_' + tisch.id).append('<td>' + calculateRechnungssumme(rechnung) + '</td>');
                    rechnung.getraenkOrders.forEach(order => {
                        $('#getraenkeTableTbody').append('<tr id="getraenkeTableTr_order_' + order.id + '"></tr>');
                        $('#getraenkeTableTr_order_' + order.id).append('<td>' + tisch.id + '</td>');
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
                    $('#kellnerTableTr_tisch_' + tisch.id).append('<td>' + tisch.id + '</td>');
                    $('#kellnerTableTr_tisch_' + tisch.id).append('<td>' + tisch.beschreibung + '</td>');
                    $('#kellnerTableTr_tisch_' + tisch.id).append('<td class="text-success" id="kellnerTableTr_tisch_' + tisch.id + '_kellerTd"><div class="btn btn-success" onclick="acceptKellnerCall(\'' + tisch.id + '\')">Annehmen</div></td>');
                }
            });
        }
    });
}

function clearTable(){
    $('#tischTableTbody').empty();
    $('#getraenkeTableTbody').empty();
    $('#kellnerTableTbody').empty();
}