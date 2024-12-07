//Vamos a seleccionar los elementos del DOM, pondremos un listener al boton, que al hacer click se dispare la funcion que haga el llamado a la API
const API = "https://api.adviceslip.com/advice";
const diceButton = document.querySelector(".card__get-quote");
const saveFavoriteButton = document.querySelector(".options__save-quote");

diceButton.addEventListener("click", getQuote);

async function getQuote() {
    try {
        const response = await fetch(API);
        const data = await response.json();
        console.log(data.slip);
    
        const adviceString = document.querySelector(".card__advice-string");
        const adviceNumber = document.querySelector(".card__advice-number");
        adviceString.textContent = `"${data.slip.advice}"`;
        adviceNumber.textContent = `ADVICE #${data.slip.id}`
    
        saveFavoriteButton.addEventListener("click", () => saveFavoriteQuotes(data.slip.id, data.slip.advice));
    } catch (error) {
        console.log("The request went wrong " + error);
    }
}

function saveFavoriteQuotes(id, advice) {
    //aqui es donde se va a usar localStorage para guardar la frase y tambien renderizar el boton de "ver favoritos" LA PRIMERA VEZ, ya que no queremos que se cree cada vez que guarden algo
    console.log(id);
    console.log(advice);

    //Por defecto adviceQuotes es un template string con sintaxis de array, pero al final del dia es un string, por eso se parsea a un array como tal con JSON.parse, y si no existe una propiedad "adviceQuotes" entonces se crea un array vacio
    let arrayString = JSON.parse(localStorage.getItem("adviceQuotes")) || [];
    let arrayId = JSON.parse(localStorage.getItem("adviceIds")) || [];
    
    if (!arrayString.includes(advice) && !arrayId.includes(id)) { 
        arrayString.push(advice);
        arrayId.push(id); 
        localStorage.setItem("adviceQuotes", JSON.stringify(arrayString));
        localStorage.setItem("adviceIds", JSON.stringify(arrayId));
        console.log("SE GUARDO EN LOCALSTORAGE");
    } else {
        console.log("YA ESTA GUARDADO ESE STRING");
    }

    //Aqui tiene que ir la logica para renderizar el boton de favoritos
    if (JSON.parse(localStorage.adviceQuotes).length <= 1) {
        createFavoritesButton();
    }
}

function createFavoritesButton() {
    console.log("SI ESTA ADVICEQUOTES");
    //hay que crear el boton de ver la lista de favoritos
    const optionsContainer = document.querySelector(".options");
    const favoritesButton = document.createElement("button");
    favoritesButton.textContent = "FAVORITES ⭐";
    favoritesButton.classList.add("button-styles");
    optionsContainer.appendChild(favoritesButton);
}

if (localStorage.length > 0) {
    createFavoritesButton();
}

getQuote();