//Autor: Tim Riebesam
//Klasse die Umgebungsvariablen zum Betrieb der Seite beinhaltet.

var dashboardTitle = "GastroMe - Dashboard";
var restaurantViewTitle = "GastroMe - Restaurant";
var speisekarteViewTitle = "GastroMe - Speisekarte";

//var gastroMeApiUrl = "http://localhost:5000/"; //local
var gastroMeApiUrl = "http://GastromeApi-prod.eba-gdpwc2as.us-east-2.elasticbeanstalk.com/"; //aws
var gastroMeApiAuthTokenValue = "4df6d7b9-ba79-4ae7-8a1c-cffbb657610a";

var currentRestaurant;
var tischBeschreibungForQr;