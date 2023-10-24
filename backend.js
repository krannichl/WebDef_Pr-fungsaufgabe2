window.onload = function() {

let buttonClick = () => {
    let submitButton = document.getElementById("submit");
    let hintP = document.getElementById("hint");
    let ergebnisDiv = document.getElementById("ergebnis");
    let searchInput = document.getElementById("search").value;

    
    if(searchInput == "Product" || searchInput == "product"){
 
        hintP.textContent = 'Folgende Treffer gibt es zu dem Begriff ';
        
        fetchProduct();
        ergebnisliste();

    }
    else{
        
        hintP.textContent = 'Leider wurden hierzu keine treffer gefunden. :(';
        ergebnis.textContent = '';       

    }

};

let submitButton = document.getElementById("submit");
submitButton.addEventListener("click", buttonClick);

async function fetchProduct(){
    try{
        let response = await fetch('https://dummyjson.com/products/1');
        let data = await response.json();
        return data;    

    }catch(error){
        console.error('Fehler:', error);
    }
}

let ergebnisliste = () => {
    

    fetchProduct().then(data => {
        // Hier hast du Zugriff auf die abgerufenen Daten
        // Du kannst sie nun in HTML anzeigen oder damit arbeiten
        // Beispiel: Anzeigen des Titels und der Beschreibung des Produkts
        let ergebnisDiv = document.getElementById("ergebnis");
        
        let descriptionElement = document.createElement('p');
        let linkElement = document.createElement('a');
        linkElement.href = 'produktseite.html';
        linkElement.id = "dynamischerLink";
        linkElement.textContent = data.title; // über data.title wir auf das attribut "title" in der JSON zugegriffen
        linkElement.addEventListener("click", linkClick);

        ergebnisDiv.appendChild(linkElement);
        ergebnisDiv.appendChild(descriptionElement);

      });
}


let linkClick = () => {
    let dynamicLink = document.getElementById("DynamischerLink");
    dynamicLink.addEventListener("click", linkClick);
    let beschreibungDiv = document.getElementById("Produktbeschreibung");

    fetchProduct().then(data => {
        // Hier hast du Zugriff auf die abgerufenen Daten
        // Du kannst sie nun in HTML anzeigen oder damit arbeiten
        // Beispiel: Anzeigen des Titels und der Beschreibung des Produkts
        
        beschreibungDiv = data.title;
        let titleElement = document.createElement('h1');
        titleElement.textContent = data.title;
        beschreibungDiv.appendChild(titleElement);
            
        let descriptionElement = document.createElement('p');
        descriptionElement.textContent = data.title; // über data.title wir auf das attribut "title" in der JSON zugegriffen
        beschreibungDiv.appendChild(descriptionElement);
    
        let dElement = document.createElement('p');
        dElement.textContent = "penis"; // über data.title wir auf das attribut "title" in der JSON zugegriffen
        beschreibungDiv.appendChild(dElement);
      });





}





}