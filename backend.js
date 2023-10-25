//window.onload = function() {
document.addEventListener("DOMContentLoaded", function (){

    let submitButton = document.getElementById("submit");
    let hintP = document.getElementById("hint");
    let ergebnisDiv = document.getElementById("ergebnis");
    let searchInput = document.getElementById("search");
    //let dynamicLink = document.getElementById("DynamischerLink");
    let beschreibungDiv = document.getElementById("Produktbeschreibung");


    // stimmt die suche und passt das was im feld steht?
    function buttonClick() {
        
        let input = searchInput.value;
                
        if(input == "Product" || input == "product"){
    
            hintP.textContent = 'Folgende Treffer gibt es zu dem Begriff ';

            fetchProduct();
        }
        else{
            
            hintP.textContent = 'Leider wurden hierzu keine treffer gefunden. :(';
            ergebnis.textContent = '';     
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

                linkElement.href = 'produktseite.html';
                linkElement.id = "dynamischerLink";
                linkElement.textContent = data.title; // über data.title wir auf das attribut "title" in der JSON zugegriffen
                
                linkElement.addEventListener("click", function(event){
                    linkClick(data);    
                });

                ergebnisDiv.appendChild(linkElement);
                ergebnisDiv.appendChild(descriptionElement);
            })


        }catch(error){
            console.error('Fehler:', error); //funktioniert nicht
        }
    };



    function linkClick(data) {
        
        let produktTitel = document.createElement('h1');
        let produktBeschreibung = document.createElement('p');

        produktTitel.textContent = data.title;
        beschreibungDiv.textContent = "penis";
        beschreibungDiv.appendChild(produktTitel);
                
        
        //produktBeschreibung.textContent = data.title; // über data.title wir auf das attribut "title" in der JSON zugegriffen
        //beschreibungDiv.appendChild(produktBeschreibung);
            
    };





});