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

function numberToPrice(number) {
    return number.toFixed(2).toString().replace(".", ",") + " €";
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});