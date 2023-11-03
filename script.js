document.addEventListener("DOMContentLoaded", function (){
    console.log("DOM ist loaded");

    let searchButton = document.getElementById("search");
    let searchInput = document.getElementById("searchbar");
    let formInput = document.getElementById("eingabeFormular");
    let hint = document.getElementById("hint");
    let userList = document.getElementById("user_list");
    let detail = document.getElementById("detailbeschreibung");

    let einkaufswagenHeadline = document.getElementById("headline");
    
    //let userBeschreibung = document.getElementById("user-beschreibung");
    //let einkaufsWagen = document.getElementById("Einkaufswagen");
    //let backLink = document.createElement('a');
    //let kopfzeile = document.getElementById("header-zeile");
    let cartinhalt = document.getElementById("produkteImEinkaufswagen");
    let sum = document.getElementById("Warenwert");
    //let zrck = document.getElementById("back");

    //let mainPage = document.getElementById("main-Page");


    /**
     * Hilfsfunktion zum Umschalten des sichtbaren Inhalts
     */
    let swapContent = (id, title) => {
        
        document.querySelectorAll("main").forEach(mainElement => {
        mainElement.classList.add("hidden");
        })

        let element = document.querySelector(`#${id}`);
        if (element) element.classList.remove("hidden");

        document.title = `${title} | Aufgabe: SPA-Router`;
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
            url: "^/user/([^/]+)/$", //test versuch
            show: () => swapContent("user-beschreibung", "User Beschreibung"),
            /*show: (matches) => {
                let username = matches[1];
                console.log("matches: ", matches[1])
                userPage(username);
                swapContent("user-beschreibung", "User Beschreibung");
            }*/
        },{
            url: "^/cart/([^/]+)/$", //Test versuch
            show: () => swapContent("Einkaufswagen", "Einkaufswagen"),
            /*show: (matches) => {
                let cartId = matches[1];
                fetchCart(cartId);
                swapContent("Einkaufswagen", "Einkaufswagen");
            }*/

        },{ //noch ausbessern
            url: ".*",
            show: () => swapContent("page-not-found", "Seite nicht gefunden"),
        }
    ];

    let router = new Router(routes);
    router.start();
    //backLink = router.createBackLink();
    


    searchButton.addEventListener("click", function(event){
        event.preventDefault();
        
        let input = searchInput.value;
        console.log(input);
                
        
            if(input !== ""){
                
                hint.textContent = 'Folgende Treffer gibt es zu dem Begriff ';
                
                window.location.hash = `/Suchergebnisse/`;
                fetchUser(input);
            }
            else{
                alert("Bitte geben Sie einen Suchbegriff ein!");
                hint.textContent = 'Bitte geben Sie einen Suchbegriff ein! :(';
                //ergebnis.textContent = '';     
            }
    });

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
                userList.innerHTML = "";

                if(data.users.length>0){
                                
                    // hier wird ein link dynamisch erzeugt, ist nach dem Username des Users benannt
                    // Dieser link erhält einen EventListener, wenn auf den Link geklickt wird, wird die userPage funktion aufgerufen
                    // dieser Funktion werden die abgerufenen daten mit gegegeben um eine dynamische abfrage der weiteren informationen zu ermöglichen

                    data.users.forEach(user =>{
                        let userLink = document.createElement('a');
                        userLink.href = `#/user/${user.username}/`;
                        userLink.textContent = user.username; 
                        userLink.setAttribute('class',"list-group-item list-group-item-action"); //btn btn-outline-success w-100 mb-3
                        
                        userLink.addEventListener("click", function(event){
                            event.preventDefault();
                            userPage(user);
                            window.location.hash = `#/user/${user.username}/`;

                        });

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

    function userPage(user){

        detail.innerHTML = "";
        fetch(`https://dummyjson.com/users/search?q=${user.username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log("user erneut geladen");
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data.users);
            window.location.hash = `#/user/${user.username}/`; // ist das hier richtig positioniert?

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


            cartLink.href = `#/user/${data.users[0].username}/Warenkorb`;
            cartLink.textContent = 'Warenkorb'; 
            cartLink.setAttribute('class',"btn btn-outline-success w-100 mt-3 mb-3");
                    
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
            //detail.appendChild(backLink);
            

            /*kopfzeile.style.display = "none";
            mainPage.style.display = "none";
            userBeschreibung.style.display = "block";
            einkaufsWagen.style.display = "none";*/
        })
        
    }
    // Die fetchCart funktion bekommt die abgerufene UserID übergeben, da man carts nur anhand von UserIDs suchen kann
    // anhand dieser ID führtführt Sie einen API aufruf durch und gibt den Warenkorb des entsprechenden Users zurück.
    // ansonsten funktioniert Sie analog zu den vorherigen funktionen.
    // Diese Funktion hängt das ergebnis in der main mit der id einkaufswagen an, an das div "produkteImEinkaufswagen"
    
    function fetchCart(nutzerID){
        
        einkaufswagenHeadline.innerHTML="";
    
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
                //cartinhalt
                einkaufswagenHeadline.appendChild(ueberschrift);

                sum.textContent = 'Warenwert: ' + data.carts[0].total + '€';
                sum.setAttribute('class',"d-flex justify-content-center my-3 mx-3");
                
                cartinhalt.appendChild(einkauf);

                // Schleife, die für jedes Element im Warenkorb ein <p>-element erzeugt & Anhängt
                data.carts[0].products.forEach(product => {
                    let productInCart = document.createElement('li');
                    productInCart.textContent = product.title;
                    productInCart.setAttribute('class',"list-group-item");
                    cartinhalt.appendChild(productInCart);

                });
                                
                /*kopfzeile.style.display = "none";
                mainPage.style.display = "none";
                userBeschreibung.style.display = "none";
                einkaufsWagen.style.display = "block";*/
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