pageTitle = "LM OpenData"

navTitle = "Lantmäteriets Öppna Data"

omTitel = "Om Kartorna"

omText = "<p>Dessa kartor är skapade av Klas Karlsson, och baseras på Lantmäteriets OGC tjänst för öppna data!</p>"
omText += "<p>Kartorna är interaktiva i en webbläsare.</p>"
omText += "<p>Kartorna ersätter inte ett GIS eller riktig karttjänst, men kan användas för att snabbt titta på tillgängliga kartor.</p>"
omText += "<p>För närvarande finns kartor i skala från 1:1 Miljon till 1:50 000 över Sverige baserat på Lantmäteriets topografiska kartor. "
omText += "Kartorna har inga exakta skalsteg utan skalan är relativ och i praktiken indelade i \"zoom-nivåer\", som inte direkt kan översättas till en skala (varierar med latitud). En skalstock i nedre vänstra hörnet visar en uppskattad skala för skärmbildens centrum.</p>"
omText += "<p>Vill du ha en annan startposition och zoom kan du exempelvis ange URL:<br><i>index.htm?pos=14.6,57.2&zoom=10</i><br>Detta startar kartan på Longitud 14.6 och Latitud 57.2 med zoom-nivå 10.</p>"
omText += "<p>Klick i kartan lägger till etikett med koordinatinformation. Rensa kartan med länk uppe till höger. Shift-klick-dra roterar kartan. Klick på logo uppe till vänster återställer till startläge.</p>"
omText += "<br><p><i>Skapad med: OpenLayers 3, Bootstrap, PROJ4JS, mgrsJS samt jQuery</i></p>"

// Ange begränsningar i Zoom-nivå 4-13 är runt 1:35 milj till 1:65'000
highZoom = 3
lowZoom = 14

// Ange startposition (lista med longitud, latitud)
// [22, 40], zoom 3 = Världen
// [18, 62], zoom 6 = Sverige
// [14.9720, 57.6671], zoom 14 = Eksjö
startPos = [15.3534, 57.5173]
startZoom = 8

// Krediteringstext
attributionText = "Tiles by Lantmäteriet CC BY <a href=\"http://lm.se\">Lantmäteriet</a>"

// Redigera inte under denna rad!

document.getElementById("title").innerHTML=pageTitle
document.getElementById("nav_title").innerHTML=navTitle
document.getElementById("omTitel").innerHTML=omTitel
document.getElementById("omText").innerHTML=omText

var attribution = new ol.Attribution({
  html: attributionText
});

function GetUrlValue(VarSearch){
    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for(var i = 0; i < VariableArray.length; i++){
        var KeyValuePair = VariableArray[i].split('=');
        if(KeyValuePair[0] == VarSearch){
            return KeyValuePair[1];
        }
    }
}


if (GetUrlValue('pos')){
	startPos = GetUrlValue('pos').split(",").map(parseFloat);
	startZoom = GetUrlValue('zoom');
	//alert(startPos + " " + startZoom);
}

if (GetUrlValue('info')){
	document.getElementById("vy").innerHTML="<a href=\"#\" data-toggle=\"modal\" data-target=\"#vyInfo\">Teknisk Information&nbsp;&nbsp;</a>";
	document.getElementById("vyTitle").innerHTML="Om den här kartprodukten.";
	var infoText = "Detta är version 1.0.0<br>Skapad 2015-11-08 av Klas Karlsson</p>";
	infoText += "<p>Kartorna fungerar bäst med Mozilla Firefox, men fungerar bra med Internet Explorer 11 eller senare (eller annan modern webbläsare).</p>";
	infoText += "<p>I Internet Explorer 10 eller tidigare så stängs en del finesser som exempelvis rotation av kartan av.</p>";
	infoText += "<p>Som standard så visas kartor i \"tiles\" katalogen på samma sökväg som \"index.htm\". I katalogen finns först en nivå med "
	infoText += "kataloger som beskriver zoom-nivå, därefter kolumn och i dessa kataloger ligger i sin tur bildrutorna döpta efter vilken rad de hör till.</p>";
	infoText += "<p><i>/tiles/z/x/y.png (slippy map)</i></p>";
	infoText += "<p>Även om det går att använda exempelvis FME för att generera tiles så har kartorna vid utprovning av denna produkt genererats i QGIS</p>";
	infoText += "<p>QGIS har även använts för att skapa kartorna i liten skala baserade på VMAP 0, då processen att använda ArcGIS var lite för omständig ";
	infoText += "och resultatet blev mycket bättre i QGIS.</p>";
	infoText += "<p>Du hittar mera om Open Source programmet QGIS på <a href=\"http://qgis.org\">http://qgis.org</a></p>";
	infoText += "<p>Det finns en del problem med att generera tiles av vektordata. De generatorer som provats har haft svårt med symbolstilar och etiketter ";
	infoText += "som sträcker sig över en tile-gräns. Av denna anledning så finns det inga etiketter i de småskaliga kartorna!</p>";
	infoText += "<p>Ett sätt att jobba runt detta är att först generera rasterkartor i rätt upplösning, och sedan dela dessa i tiles, vilket dock "
	infoText += "inte är helt praktiskt för globala data i zoom-nivå över 7-8 då det krävs väldigt stora rasterfiler.</p>";
	infoText += "<p>Kartorna som används kan vara förknippade med användarrestriktioner (ex Lantmäteriet för topografiska kartor i stor skala). ";
	infoText += "Samtliga använda skript är dock Open Source och kan fritt användas i alla sammanhang. ";
	infoText += "När det gäller användning i exempelvis Försvarsmakten så finns det reservationer när det gäller användning av skript. ";
	infoText += "Eftersom skripten enbart kan öppnas med en redan installerad webbläsare, och exempelvis inte <u>kan</u> komma åt filsystemet så ";
	infoText += "likställer vi däremot kartorna med ett Word-dokument, som bara kan öppnas i Word. Även Word-dokument kan ju innehålla ";
	infoText += "skript i form av makron så liknelsen håller så långt.<br>";
	infoText += "Gränsdragningen mellan dokument och program är däremot svår att göra, och därför kan vi inte ta ansvar för om exempelvis Försvarsmakten ";
	infoText += "gör en annan tolkning och inte tillåter dessa skript. Vi kommer därför inte att uppmuntra till att köra dessa filer i Försvarsmaktens nätverk.</p>";
	document.getElementById("vyText").innerHTML=infoText;
	
}

var scaleLineControl = new ol.control.ScaleLine();

var mousePositionControl = new ol.control.MousePosition({
  prefix: 'Longitud: ',
  separator: ' Latitud: ',
  suffix: ' grader',
  coordinateFormat: ol.coordinate.createStringXY(4),
  projection: 'EPSG:4326',
  undefinedHTML: 'Koordinater...'
});

var projection = ol.proj.get('EPSG:3857');
var map = new ol.Map({
        target: 'map',
	controls: ol.control.defaults({
		
	}).extend([
    	  scaleLineControl, mousePositionControl
  	]),
	interactions: ol.interaction.defaults().extend([
	  new ol.interaction.DragRotateAndZoom()
	]),
        layers: [
        new ol.layer.Tile({
          source: new ol.source.WMTS({
            attributions: [attribution],
            url: 'http://maps-open.lantmateriet.se/open/topowebb-ccby/v1/wmts',
	    layer: 'topowebb',
	    matrixSet: '3006',
	    format: 'image/png',
	    projection: projection,
	    style: 'default'
          })
        })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat(startPos),
          zoom: startZoom,
	  minZoom: highZoom,
	  maxZoom: lowZoom
        })
});

//Full Screen
var myFullScreenControl = new ol.control.FullScreen();
map.addControl(myFullScreenControl);

$( ".radera" ).click(function(){
	$( ".popup" ).remove();
});

map.on('singleclick', function(evt){
	var coord = evt.coordinate;
	var transformed_coordinate = ol.proj.transform(coord, "EPSG:900913", "EPSG:4326");
	spawnPopup(coord, transformed_coordinate);

});

function spawnPopup(coord, lonlat){

    var lng = lonlat[0];
    var lat = lonlat[1];
    var MGRSRAW = mgrs.forward([lng, lat])
    var RawSplit = MGRSRAW.match(/(.{3})(.{2})(.{5})(.{5})/);
    var MGRS = "MGRS: " + RawSplit[1] + " " + RawSplit[2] + " " + RawSplit[3] + " " + RawSplit[4];
    var SWERAW = proj4('EPSG:4326', "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs", [lng, lat]);
    var SWEREF99TM = "";
    if (SWERAW[0] > 250000 && SWERAW[0] < 950000 && SWERAW[1] > 6000000 && SWERAW[1] < 7700000){
	SWEREF99TM = "<br>SWEREF99TM: " + SWERAW[0].toFixed(0) + " E  " + SWERAW[1].toFixed(0) + " N";
    }
    var HEMI = (lat > 0)? "N" : "S";
    var M_N = parseInt((lat - parseInt(lat)) * 60);
    var S_N = ((lat - parseInt(lat) - M_N / 60) * 3600).toFixed(2);
    var BLOCK = (lng > 0)? "E" : "W";
    var M_E = parseInt((lng - parseInt(lng)) * 60);
    var S_E = ((lng - parseInt(lng) - M_E / 60) * 3600).toFixed(2);
    var DMS = "DMS: " + parseInt(lat) + "&deg;" + M_N + "'" + S_N + "\"" + HEMI + " " + parseInt(lng) + "&deg;" + M_E + "'" + S_E + "\"" + BLOCK;
    var prefixAndValue = '<u>Markerad position</u><br><b>' + MGRS + '</b>' + SWEREF99TM + '<br>' + DMS + '<br><i>Lon/Lat: ' + ' ' + lonlat[0].toFixed(4) + ", " + lonlat[1].toFixed(4) + " grader</i>";


    var popup_text = "<p>Koordinater</p><p>Lon: " + lonlat[0] + "</p><p>Lat: " + lonlat[1] + "</p>";
    var popup = $("<div class='popup'>" + prefixAndValue + "</div>");
    
    var overlay = new ol.Overlay({
        element:popup
    });
    
    map.addOverlay(overlay);
    overlay.setPosition(coord);
}



