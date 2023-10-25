//window.onload = function() {
document.addEventListener("DOMContentLoaded", function (){

    let submitButton = document.getElementById("submit");
    let hintP = document.getElementById("hint");
    let ergebnisDiv = document.getElementById("ergebnis");
    let searchInput = document.getElementById("search");
    //let dynamicLink = document.getElementById("DynamischerLink");
    let descriptionPage = document.getElementById("Produktbeschreibung");
    let detail = document.getElementById("detailbeschreibung");
    let cartLink = document.getElementById("einkaufslink");


    // stimmt die suche und passt das was im feld steht?
    function buttonClick() {
        
        let input = searchInput.value;
                
        if(input == "Product" || input == "product"){
    
            hintP.textContent = 'Folgende Treffer gibt es zu dem Begriff ';

            fetchProduct();
        }
        else{
            if(input == "User" || input == "user"){
                
                hintP.textContent = 'Folgende Treffer gibt es zu dem Begriff ';

                fetchUser();
            }
            else{
                hintP.textContent = 'Leider wurden hierzu keine treffer gefunden. :(';
                ergebnis.textContent = '';     
            }
        }

    };
    submitButton.addEventListener("click", buttonClick);

    

    // rest api aufruf und ausgabe des ausrufs als link auf dem bildschirm
    function fetchProduct(){
        try{
            fetch('https://dummyjson.com/products/1')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Hier hast du Zugriff auf die abgerufenen Daten
                // Du kannst sie nun in HTML anzeigen oder damit arbeiten
                // Beispiel: Anzeigen des Titels und der Beschreibung des Produkts
                
                const descriptionElement = document.createElement('p');
                const linkElement = document.createElement('a');

                linkElement.href = '#{product.title}';
                //linkElement.id = "dynamischerLink";
                linkElement.textContent = data.title; // über data.title wir auf das attribut "title" in der JSON zugegriffen
                
                linkElement.addEventListener("click", function(event){
                    event.preventDefault();
                    productpage(data);    
                });

                ergebnisDiv.appendChild(linkElement);
                ergebnisDiv.appendChild(descriptionElement);
            })


        }catch(error){
            console.error('Fehler:', error); //funktioniert nicht
        }
    };


    function productpage(data){
        
        //let produktTitel = document.getElementById("produktname");
        let produktTitel = document.createElement("h2");
        let beschreibung = document.createElement('p');
        let preis = document.createElement('p');
        let marke = document.createElement('p');


        produktTitel.textContent = data.title;
               
        beschreibung.textContent = data.description; // über data.title wir auf das attribut "title" in der JSON zugegriffen
        preis.textContent = data.price + '€';
        marke.textContent = data.brand;

        detail.appendChild(produktTitel);
        detail.appendChild(marke);
        detail.appendChild(beschreibung);
        detail.appendChild(preis);
    };


    // rest api aufruf und ausgabe des ausrufs als link auf dem bildschirm
    function fetchUser(){
        try{
            fetch('https://dummyjson.com/users/1')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Hier hast du Zugriff auf die abgerufenen Daten
                // Du kannst sie nun in HTML anzeigen oder damit arbeiten
                // Beispiel: Anzeigen des Titels und der Beschreibung des Produkts
                
                const blocker = document.createElement('p');
                const userLink = document.createElement('a');

                userLink.href = '#{data.username}';
                userLink.textContent = data.username; // über data.title wir auf das attribut "title" in der JSON zugegriffen
                
                userLink.addEventListener("click", function(event){
                    event.preventDefault();
                    userPage(data);    
                });

                ergebnisDiv.appendChild(userLink);
                ergebnisDiv.appendChild(blocker);
            })


        }catch(error){
            console.error('Fehler:', error); //funktioniert nicht
        }
    };

    function userPage(data){
        
        //let produktTitel = document.getElementById("produktname");
        let nameUser = document.createElement("h2");
        let geschlecht = document.createElement('p');
        let alter = document.createElement('p');
        let idNR = document.createElement('p');


        nameUser.textContent = data.firstName;
               
        geschlecht.textContent = data.gender; // über data.title wir auf das attribut "title" in der JSON zugegriffen
        alter.textContent = data.age + ' Jahre';
        idNR.textContent = data.id;

        detail.appendChild(nameUser);
        detail.appendChild(idNR);
        detail.appendChild(geschlecht);
        detail.appendChild(alter);


    }

    
    // der link in html muss noch irgendwie mit diesen Funktionen verknüpft werden
    cartLink.addEventListener("click", function () {
        fetchCart(data.id);
    });

    function fetchCart(){
        try{
            fetch('https://dummyjson.com/carts/users/1')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Hier hast du Zugriff auf die abgerufenen Daten
                // Du kannst sie nun in HTML anzeigen oder damit arbeiten
                // Beispiel: Anzeigen des Titels und der Beschreibung des Produkts
                
                const blocker = document.createElement('p');
                const einkauf = document.createElement('a');

                userLink.href = '#{data.products[0].title}';
                userLink.textContent = data.products[0].title; // über data.title wir auf das attribut "title" in der JSON zugegriffen
                
                userLink.addEventListener("click", function(event){
                    event.preventDefault();
                    einkaufsPage(data);    
                });

                ergebnisDiv.appendChild(userLink);
                ergebnisDiv.appendChild(blocker);
            })


        }catch(error){
            console.error('Fehler:', error); //funktioniert nicht
        }
    };

    function einkaufsPage(data){
        
        //let produktTitel = document.getElementById("produktname");
        let produkt = document.createElement("h2");
        let EK = document.createElement('p');
        
        produkt.textContent = data.products[0].title;
               
        EK.textContent = data.carts.total; // über data.title wir auf das attribut "title" in der JSON zugegriffen
        
        detail.appendChild(produkt);
        detail.appendChild(EK);
        
    }




});