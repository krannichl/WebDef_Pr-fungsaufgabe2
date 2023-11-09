document.addEventListener("DOMContentLoaded", function (){
    console.log("DOM ist loaded");

    /**
     * Deklarierung aller Variablen
     */
    let searchButton = document.getElementById("search");
    let searchInput = document.getElementById("searchbar");
    let formInput = document.getElementById("eingabeFormular");
    let hint = document.getElementById("hint");
    let userList = document.getElementById("user_list");
    let detail = document.getElementById("detailbeschreibung");
    let einkaufswagenHeadline = document.getElementById("headline");
    let cartinhalt = document.getElementById("produkteImEinkaufswagen");
    let sum = document.getElementById("Warenwert");

    /**
     * Single Page Router initialisieren und  Hilfsfunktion zum Umschalten des sichtbaren Inhalts
     */
    let swapContent = (id, title) => {
        
        document.querySelectorAll("main").forEach(mainElement => {
            mainElement.classList.add("d-none");
        })

        let element = document.querySelector(`#${id}`);
        if (element) {
            element.classList.remove("d-none");
        }

        document.title = `${title} | User-Suche & mehr`; // Noch richtigen Titel finden
    }

    /**
     * Konfiguration des URL-Routers
     */
    let routes = [
        {
            url: "^/$",
            show: () => swapContent("page-start", "Startseite"),
        },{
            url: "^/Suchergebnisse/$",
            show: () => swapContent("page-start", "Suchergebnisse"),
        },{
            url: "^/user/([^/]+)/$", 
            show: (matches) => {
                let username = matches[1];
                console.log("matches: ", matches[1])
                userPage(username);
                swapContent("user-beschreibung", "User Beschreibung");
            }
        },{
            url: "^/cart/([^/]+)/$", 
            show: (matches) => {
                let cartId = matches[1];
                fetchCart(cartId);
                swapContent("Einkaufswagen", "Einkaufswagen");
            }

        },{
            url: "/surprise/$",
            show: () => swapContent("surprise","surprise")

        },{
            url: ".*",
            show: () => swapContent("page-not-found", "Seite nicht gefunden"),
        }
    ];

    let router = new Router(routes);
    router.start();    


    /**
     * Das ist der Eventlistener für den Suchbutton.
     * Zwar handelt es sich bei dem Suchbutton eigentlich nur um einen Hyperlink, der Event-Handler steuert allerdings,
     * ob es sich bei der suche um eine Valide suche handelt oder ob bspw. "" also nichts eingegeben wurde.
     * Je nach eingabe werden dann durch den eventListener die weiteren Funktionen angestoßen.
     */
    searchButton.addEventListener("click", function(event){
        event.preventDefault();
        let input = searchInput.value;
        console.log(input);
            if(input !== ""){
                hint.textContent = 'Folgende Treffer gibt es zu dem Begriff: ';
                window.location.hash = `/Suchergebnisse/`;
                fetchUser(input);
            }
            else{
                alert("Bitte geben Sie einen Suchbegriff ein!");
                hint.textContent = 'Bitte geben Sie einen Suchbegriff ein! :(';
            }
    });

    /**
     * Die fetchUser Funktion wird im eventListener aufgerufen, wenn ein Suchbegriff eingegeben wurde.
     * Sie Bekommt den Suchbegriff übergeben und sucht anhand des Suchbegriffs einen bzw. alle User, die sich mit dem Suchbegriff übereinstimmen
     * Wenn es keine Treffer zu diesem Suchbegriff gibt, wird eine Fehlermeldung ausgegeben.
     */
    function fetchUser(input){
        try{
            /**
             * fetchanfrage an dummyJSON
             */
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
                userList.innerHTML = "";
                if(data.users.length>0){
                                
                    // hier wird ein <a>>-Element dynamisch erzeugt, dieses ist nach dem Username des Users benannt
                    // Durch einen click auf den Link wird die userPage funktion aufgerufen
                    // dieser Funktion werden die abgerufenen daten mit gegegeben um eine dynamische abfrage der weiteren informationen zu ermöglichen

                    data.users.forEach(user =>{
                        let userLink = document.createElement('a');
                        userLink.href = `#/user/${user.username}/`;
                        userLink.textContent = user.username; 
                        userLink.setAttribute('class',"list-group-item list-group-item-action"); //btn btn-outline-success w-100 mb-3

                        userList.appendChild(userLink);
                    })
                }
                else{

                    hint.innerHTML="Bitte nach dem Nachnamen des Users suchen, bspw. Medhurst";
                    alert('Leider gibt es keine treffer zu diesem begriff :(');               
                    formInput.reset();
                }  
            })
        }catch(error){
            console.error('Fehler:', error);
        }
    }

    /**
     * Die userPage Funktion wird durch einen click auf den zuvor erzeugten Link aufgerufen
     * Sie Bekommt den username übergeben und sucht anhand des usernamens den User.
     * Wenn es keine Treffer zu diesem Usernamen gibt, wird eine Fehlermeldung ausgegeben.
     */
    function userPage(user){
        detail.innerHTML = "";

        fetch(`https://dummyjson.com/users/search?q=${user}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
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
            nameUser.setAttribute('class',"d-flex justify-content-center mb-6");                 
            geschlecht.textContent = 'Geschlecht: ' + data.users[0].gender; 
            geschlecht.setAttribute('class',"d-flex justify-content-center");
            alter.textContent = 'Alter: ' + data.users[0].age + ' Jahre';
            alter.setAttribute('class',"d-flex justify-content-center");
            idNR.textContent = 'ID: ' + data.users[0].id;
            idNR.setAttribute('class',"d-flex justify-content-center");

            cartLink.href = `#/cart/${data.users[0].id}/`;
            cartLink.textContent = 'Warenkorb'; 
            cartLink.setAttribute('class',"btn btn-success w-100 mt-3 mb-3");
            
            detail.appendChild(nameUser);
            detail.appendChild(idNR);
            detail.appendChild(geschlecht);
            detail.appendChild(alter);
            detail.appendChild(cartLink);
        })
    }

    /**
     * Die fetchCart Funktion bekommt die abgerufene UserID übergeben.
     * anhand dieser ID führtführt Sie einen API aufruf durch und gibt den Warenkorb des entsprechenden Users zurück. 
     * ansonsten funktioniert Sie analog zu den vorherigen funktionen.
     * Diese Funktion hängt das ergebnis in der main mit der id einkaufswagen an, an das div "produkteImEinkaufswagen"
     * Besitzt der User keinen Warenkorb wird eine Fehlermeldung ausgegeben.
    */
    function fetchCart(nutzerID){

        console.log(nutzerID);
        einkaufswagenHeadline.innerHTML="";
        cartinhalt.innerHTML="";
        sum.innerHTML="";
    
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
            if(data.carts.length > 0){                
                const ueberschrift = document.createElement('h2');
                const einkauf = document.createElement('p');
                ueberschrift.textContent = 'Einkaufswagen des Users';
                ueberschrift.setAttribute('class',"d-flex justify-content-center");
                einkaufswagenHeadline.appendChild(ueberschrift);
                sum.textContent = 'Warenwert: ' + data.carts[0].total + '€';
                sum.setAttribute('class',"d-flex justify-content-center my-3 mx-3");
                cartinhalt.appendChild(einkauf);

                // Schleife, die für jedes Element im Warenkorb ein <li>-element erzeugt & Anhängt
                data.carts[0].products.forEach(product => {
                    let productInCart = document.createElement('li');
                    productInCart.textContent = product.title;
                    productInCart.setAttribute('class',"list-group-item");
                    cartinhalt.appendChild(productInCart);
                });
                                
            }
            else{
                alert("Dieser User hat keinen Warenkorb!");
            }

        })
        .catch(error => {
            console.error('Error:', error);
          });
    }

});