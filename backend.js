document.addEventListener("DOMContentLoaded", function (){
    console.log("DOM ist loaded");

    let submitButton = document.getElementById("submit");
    let hintP = document.getElementById("hint");
    let ergebnisDiv = document.getElementById("ergebnis");
    let searchInput = document.getElementById("search");
    let detail = document.getElementById("detailbeschreibung");
    let cartLink = document.getElementById("einkaufslink");
    let cartinhalt = document.getElementById("produkteImEinkaufswagen");
    let previousHash = null;


    window.addEventListener("hashchange", () => {
        previousHash = location.hash;
    });    

    let backLink = document.createElement('a');
        backLink.textContent = 'Zurück';
        backLink.addEventListener("click", function(event){
        event.preventDefault();
        window.location.hash = previousHash;
    });


    window.addEventListener("load", () => {
        /**
         * Hilfsfunktion zum Umschalten des sichtbaren Inhalts
         *
         * @param {String} id HTML-ID des anzuzeigenden <main>-Elements
         * @param {String} title Neuer Titel für den Browser-Tab
         */
        let swapContent = (id, title) => {
            document.querySelectorAll("main").forEach(mainElement => {
                mainElement.classList.add("hidden");
            })

            let element = document.querySelector(`#${id}`);
            if (element) element.classList.remove("hidden");

            document.title = `${title} | WebProg Prüfungsaugabe 2`;
        }

        /**
         * Konfiguration des URL-Routers
         */
        let routes = [
            {
                url: "^/$",
                show: () => swapContent("Suchseite", "Startseite"),
            },{
                url: "^/other/$",
                show: () => swapContent("produktbeschreibung", "Andere Seite"),
            },{
                url: ".*",
                show: () => swapContent("benutzer", "Seite nicht gefunden"),
            },{
                url: ".*",
                show: () => swapContent("Einkaufswagen", "Seite nicht gefunden"),
            },{
                url: "^/user/([^/]+)/$",
                show: (matches) => {
                    let username = matches[1];
                    userPage(username);
                }
            },{
                url: "^/cart/([^/]+)/$",
                show: (matches) => {
                    let cartId = matches[1];
                    fetchCart(cartId);
                },
            }
            
        ];

        let router = new Router(routes);
        router.start();
    });

    "use strict";

    class Router {
        /** Ich glaub das param braucht man nicht
         * @param {List} routes Definition der in der App verfügbaren Seiten
         */
        constructor(routes) {
            this._routes = routes;
            this._started = false;

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
            let url = location.hash.slice(1);

            if (url.length === 0) {
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
    }





    // stimmt die suche und passt das was im feld steht?
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



    // rest api aufruf und ausgabe des ausrufs als link auf dem bildschirm
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
                
                let backLink = document.createElement('a');
                    backLink.textContent = 'Zurück';
                    backLink.addEventListener("click", function(event){
                    event.preventDefault();
                    window.location.hash = previousHash;
                });
                        
                userLink.href = `#/user/${data.users[0].username}/`;
                userLink.textContent = data.users[0].username; // über data.title wir auf das attribut "title" in der JSON zugegriffen
                
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
    };

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


        nameUser.textContent = data.users[0].firstName;
               
        geschlecht.textContent = 'Geschlecht: ' + data.users[0].gender; // über data.title wir auf das attribut "title" in der JSON zugegriffen
        alter.textContent = 'Alter: ' + data.users[0].age + ' Jahre';
        idNR.textContent = 'ID: ' + data.users[0].id;

        cartLink.addEventListener("click", function(event){
            event.preventDefault();
            console.log('User ID:', data.users[0].id);
            window.location.hash = `/cart/${data.users[0].id}/`;
            fetchCart(data.users[0].id);                    
        });

        detail.appendChild(nameUser);
        detail.appendChild(idNR);
        detail.appendChild(geschlecht);
        detail.appendChild(alter);
        })
    }


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
                    
    
                    einkauf.textContent = 'Warenwert: ' + data.carts[0].total + '€'; // über data.title wir auf das attribut "title" in der JSON zugegriffen
                    
                    cartinhalt.appendChild(einkauf);

                    data.carts[0].products.forEach(product => {
                        let productInCart = document.createElement('p');
                        productInCart.textContent = product.title;
                        cartinhalt.appendChild(productInCart);

                    });

                    cartinhalt.appendChild(blocker);

                })
                .catch(error => {
                    console.error('Error:', error);
                  });
    }

    
});