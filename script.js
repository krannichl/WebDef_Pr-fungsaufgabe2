/*
        In diesem Teil stehen alle funktionen und Klassen, die das gerüst für den SPA router bilden
        
        Der gegebene Code definiert eine Router-Klasse, die zur Handhabung von Routen in einer Webanwendung verwendet werden kann. Hier ist eine Schritt-für-Schritt-Erklärung des Codes:

        Der Router-Konstruktor nimmt ein Array von Routen als Parameter. Jede Route ist ein Objekt mit einer url-Eigenschaft (einem regulären Ausdruck, der die URL übereinstimmt, die den Router auslösen soll) und einer show-Eigenschaft (einer Funktion, die aufgerufen wird, wenn die URL übereinstimmt) dev.to.
        Innerhalb des Konstruktors wird ein Event-Listener für das hashchange-Ereignis des window-Objekts hinzugefügt. Dieses Ereignis wird ausgelöst, wenn der Hash-Teil der URL (der Teil nach dem #) geändert wird. Wenn das Ereignis ausgelöst wird, wird die _handleRouting-Methode aufgerufen dev.to.
        Die start-Methode setzt das _started-Flag auf true und ruft _handleRouting auf. Dies startet den Router dev.to.
        Die stop-Methode setzt das _started-Flag auf false. Dies stoppt den Router dev.to.
        Die _handleRouting-Methode holt die aktuelle URL und entfernt das # am Anfang. Wenn die URL leer ist, wird sie auf / gesetzt. Dann sucht sie die Route, die der aktuellen URL entspricht, und ruft deren show-Funktion auf accreditly.io.
        Die createBackLink-Methode erstellt einen "Zurück"-Link, der den Benutzer zur vorherigen Seite zurückbringt, wenn er darauf klickt. Sie fügt auch einen Event-Listener für das click-Ereignis des Links hinzu accreditly.io.
        Insgesamt ermöglicht diese Router-Klasse die Navigation zwischen verschiedenen Seiten oder Ansichten in einer Webanwendung, indem sie auf Änderungen der URL reagiert und die entsprechende Route ausführt accreditly.io.
        */

        "use strict";

        class Router {
            constructor(routes) {
                this._routes = routes;
                this._started = false;
                this._previousHash = null; // ich glaube das ist die bedingung für den zurück link

                window.addEventListener("hashchange", () => this._handleRouting());
            }


            start() {
                this._started = true;
                this._handleRouting();
            }

            stop() {
                this._started = false;
            }
            _handleRouting() {
                this._previousHash = location.hash; // übergabe des vorherigen links für den zurück button
                let url = location.hash.slice(1);

                if (url.length === 0) { //nochmal schauen, was genau das bringt, sehe die funktionalität in der anwendung noch nicht
                    url = "/";
                }

                let matches = null;
                let route = this._routes.find(p => matches = url.match(p.url));

                if (!route) {
                    console.error(`Keine Route zur URL ${url} gefunden!`);
                    return;
                }

                route.show(matches);
            }

            createBackLink(){
                backLink.href = "Zurück"
                backLink.textContent = 'Zurück';

                backLink.addEventListener("click", function(event) {
                    event.preventDefault();
                    if (this._previousHash) {
                        window.location.hash = this._previousHash;
                    } else {
                        window.location.hash = "/";
                    }

                    /*wasIstDas.style.display = "none";
                    searchPage.style.display = "block";
                    showUserPage.style.display = "none";
                    cartPage.style.display = "none";*/
                });
            }
        }

document.addEventListener("DOMContentLoaded", function (){
    console.log("DOM ist loaded");

    //deklarierung der variablen
    let submitButton = document.getElementById("submit");
    let hintP = document.getElementById("hint");
    let ergebnisDiv = document.getElementById("ergebnis");
    let searchInput = document.getElementById("search");
    let detail = document.getElementById("detailbeschreibung");
    let cartinhalt = document.getElementById("produkteImEinkaufswagen");
    //let mainPage = document.getElementById("main-Page");
    //let userBeschreibung = document.getElementById("user-beschreibung");
    //let einkausWagen = document.getElementById("Einkaufswagen");

    

     // Diese Funktion reagiert auf den Button und ändert den Hinweistext. Außerdem wird bei einem input die fetchUser funktion aufgerufen.
     function buttonClick() {
        
        let input = searchInput.value;
                
        
            if(input !== ""){
                
                hintP.textContent = 'Folgende Treffer gibt es zu dem Begriff ';

                fetchUser(input);
            }
            else{
                hintP.textContent = 'Leider wurden hierzu keine treffer gefunden. :(';
                ergebnis.textContent = '';     
            }
        

    };
    submitButton.addEventListener("click", buttonClick);

    // Der fetchUser funktion wird der eingegebene Input übergeben.
    // Anhand des Inputs ruft Sie die API der dummy JSON auf und sucht den User anhand seines Namens.
    // Dies funktioniert aktuell nur bei eindeutigen namen.
    // Diese Funktion hängt das ergebnis in der main mit der id main-Page an, an das div "ergebnis"

    function fetchUser(input){
        try{
            fetch(`https://dummyjson.com/users/search?q=${input}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log("user geladen");
                return response.json();
            })
            .then(data => {
                console.log('Received data:', data.users);

                
                const blocker = document.createElement('p');
                const userLink = document.createElement('a');
                
                // hier wird ein link dynamisch erzeugt, ist nach dem Username des Users benannt
                // Dieser link erhält einen EventListener, wenn auf den Link geklickt wird, wird die userPage funktion aufgerufen
                // dieser Funktion werden die abgerufenen daten mit gegegeben um eine dynamische abfrage der weiteren informationen zu ermöglichen
                userLink.href = `#/user/${data.users[0].username}/`;
                userLink.textContent = data.users[0].username; 
                
                userLink.addEventListener("click", function(event){
                    event.preventDefault();
                    userPage(data);    
                    window.location.hash = `/user/${data.users[0].username}/`;

                });

                ergebnisDiv.appendChild(userLink);
                ergebnisDiv.appendChild(blocker);
                ergebnisDiv.appendChild(backLink);
                
                
            })


        }catch(error){
            console.error('Fehler:', error);
        }
    }

    // Die userPage funktion bekommt die abgerufenen daten übergeben, führt aber erneut einen api abruf aus
    // ansonsten funktioniert Sie analog zur fetchUser funktion.
    // Diese Funktion hängt das ergebnis in der main mit der id user-beschreibung an, an das div "detailbeschreibung"
    function userPage(data){
        fetch(`https://dummyjson.com/users/search?q=${data.users[0].username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log("user geladen");
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data.users);
        
        let nameUser = document.createElement("h2");
        let geschlecht = document.createElement('p');
        let alter = document.createElement('p');
        let idNR = document.createElement('p');
        let cartLink = document.createElement('a');


        nameUser.textContent = data.users[0].firstName;
               
        geschlecht.textContent = 'Geschlecht: ' + data.users[0].gender; 
        alter.textContent = 'Alter: ' + data.users[0].age + ' Jahre';
        idNR.textContent = 'ID: ' + data.users[0].id;

        cartLink.href = `#/user/${data.users[0].username}/Warenkorb`;
        cartLink.textContent = 'Warenkorb'; 
                
        cartLink.addEventListener("click", function(event){
            event.preventDefault();
            console.log('User ID:', data.users[0].id);
            window.location.hash = `/cart/${data.users[0].username}/`;
            fetchCart(data.users[0].id);                    
        })

        detail.appendChild(nameUser);
        detail.appendChild(idNR);
        detail.appendChild(geschlecht);
        detail.appendChild(alter);
        detail.appendChild(cartLink);
        detail.appendChild(backLink);


        suchergebnisseAnzeigen();
   
        })
    }

    // Die fetchCart funktion bekommt die abgerufene UserID übergeben, da man carts nur anhand von UserIDs suchen kann
    // anhand dieser ID führtführt Sie einen API aufruf durch und gibt den Warenkorb des entsprechenden Users zurück.
    // ansonsten funktioniert Sie analog zu den vorherigen funktionen.
    // Diese Funktion hängt das ergebnis in der main mit der id einkaufswagen an, an das div "produkteImEinkaufswagen"
    
    function fetchCart(nutzerID){
    
        fetch(`https://dummyjson.com/carts/user/${nutzerID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log("Carts geladen");
            console.log(`https://dummyjson.com/carts/user/${nutzerID}`);
            return response.json();
            
        })
        .then(data => {

            console.log('Received data:', data.carts);
            
            const blocker = document.createElement('p');
            const einkauf = document.createElement('p');
            

            einkauf.textContent = 'Warenwert: ' + data.carts[0].total + '€';
            
            cartinhalt.appendChild(einkauf);

            // Schleife, die für jedes Element im Warenkorb ein <p>-element erzeugt & Anhängt
            data.carts[0].products.forEach(product => {
                let productInCart = document.createElement('p');
                productInCart.textContent = product.title;
                cartinhalt.appendChild(productInCart);

            });

            cartinhalt.appendChild(blocker);
            cartinhalt.appendChild(backLink);
            produkteAnzeigen();

        })
        .catch(error => {
            console.error('Error:', error);
          });
}

    
});