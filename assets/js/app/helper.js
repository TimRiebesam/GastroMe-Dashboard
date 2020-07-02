//Autor: Tim Riebesam
//Klasse die Methoden beinhaltet die von anderen Klassen in der Anwendung benötigt werden und zur Übersichtlichkeit ausgelagert wurden.

//Errechnet aus einer Übergebenen Rechnung im JSON-Format die Summe und gibt diese zurück
function calculateRechnungssumme(rechnung) {
    var summe = 0;
    rechnung.speisen.forEach(speise => {
        summe += speise.preis;
    });
    rechnung.getraenkOrders.forEach(order => {
        summe += order.getraenk.preis;
    });
    return numberToPrice(summe);
}

//Kürzt eine Gleitkomma-Variable auf zwei Nachkommastellen, wandelt diese in einen String um, ersetzt den Trennpunkt durch ein Komma und fügt das Euro-Zeichen hinten an.
function numberToPrice(number) {
    return number.toFixed(2).toString().replace(".", ",") + " €";
}

//Wandelt eine übergebene Datei in das Base64-Format um
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

//Validiert die Rückmeldung einer Anfrage
function validateResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function showUnderConstruction(){
    $('#underConstruction').removeClass("d-none");
}