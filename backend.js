document.addEventListener("DOMContentLoaded", function (){
    console.log("DOM ist loaded");

    let submitButton = document.getElementById("submit");
    let hintP = document.getElementById("hint");
    let ergebnisDiv = document.getElementById("ergebnis");
    let searchInput = document.getElementById("search");
    let detail = document.getElementById("detailbeschreibung");
    let cartLink = document.getElementById("einkaufslink");
    let cartinhalt = document.getElementById("produkteImEinkaufswagen");

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

                userLink.href = `#${data.users[0].username}`;
                userLink.textContent = data.users[0].username; // über data.title wir auf das attribut "title" in der JSON zugegriffen
                
                userLink.addEventListener("click", function(event){
                    event.preventDefault();
                    userPage(data);    
                });

                ergebnisDiv.appendChild(userLink);
                ergebnisDiv.appendChild(blocker);
            })


        }catch(error){
            console.error('Fehler:', error);
        }
    };

    function userPage(data){
        
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
            fetchCart(data.users[0].id);                    
        });

        detail.appendChild(nameUser);
        detail.appendChild(idNR);
        detail.appendChild(geschlecht);
        detail.appendChild(alter);
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
                    let productInCart = document.createElement('p'); //Produkte abrufen und dann einspielen
    
                    einkauf.textContent = 'Warenwert: ' + data.carts[0].total + '€'; // über data.title wir auf das attribut "title" in der JSON zugegriffen

                    cartinhalt.appendChild(einkauf);
                    cartinhalt.appendChild(blocker);

                })
                /*.catch(error => {
                    console.error('Error:', error);
                  });*/
    }





});