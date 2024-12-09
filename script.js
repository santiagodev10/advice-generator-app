//Vamos a seleccionar los elementos del DOM, pondremos un listener al boton, que al hacer click se dispare la funcion que haga el llamado a la API
const API = "https://api.adviceslip.com/advice";
const diceButton = document.querySelector(".front__get-quote");
const saveFavoriteButton = document.querySelector(".options__save-quote");

diceButton.addEventListener("click", getQuote);

async function getQuote() {
    try {
        const response = await fetch(API);
        const data = await response.json();
        console.log(data.slip);
    
        const adviceString = document.querySelector(".front__advice-string");
        const adviceNumber = document.querySelector(".front__advice-number");
        adviceString.textContent = `"${data.slip.advice}"`;
        adviceNumber.textContent = `ADVICE #${data.slip.id}`;
    
        saveFavoriteButton.addEventListener("click", () => saveFavoriteQuotes(data.slip.id, data.slip.advice));

        const favoriteListButton = document.querySelector(".options__favorites");

        if(favoriteListButton) {
            favoriteListButton.addEventListener("click", favoritesList);
        }
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
    favoritesButton.textContent = "FAVORITE QUOTES ⭐";
    favoritesButton.classList.add("options__favorites")
    favoritesButton.classList.add("button-styles");
    optionsContainer.appendChild(favoritesButton);
}

function favoritesList() {
    //Esta funcion tiene mostrar la lista de favoritos que contiene las frases almacenadas en localStorage, y aplicarle las clases a los elementos para haga las transiciones respectivas, ya de eso se encarga CSS.
    const card = document.querySelector(".card"); 
    const optionsContainer = document.querySelector(".options");
    card.classList.add("card--transition");
    // optionsContainer.classList.add("inactive");
    // optionsContainer.classList.add("trigger-inactive");

    const storedQuotes = JSON.parse(localStorage.getItem("adviceQuotes"));
    const storedIds = JSON.parse(localStorage.getItem("adviceIds"));
    console.log(storedQuotes);
    console.log(storedIds);
    
    //crear elementos que contendran las frases y ids guardados en localStorage
    const backCard = document.querySelector(".card__back");
    const ul = document.createElement("ul");

    storedIds.forEach(element => {
        const li = document.createElement("li");
        const adviceSpan = document.createElement("span");
        const removeAdvice = document.createElement("span");

        adviceSpan.textContent = `ADVICE #${element}`;
        removeAdvice.textContent = "❌";
        li.classList.add("back__items-style");
        adviceSpan.classList.add("items-style__advice-number");
        adviceSpan.classList.add("advice-number");
        removeAdvice.classList.add("items-style__remove-item");
        li.append(adviceSpan, removeAdvice);
        backCard.appendChild(ul);
        ul.appendChild(li);
    });

    //Boton para limpiar el localStorage
    const favoritesButton = document.querySelector(".options__favorites");
    const removeAllItemsButton = document.createElement("button");
    removeAllItemsButton.textContent = "REMOVE ALL ITEMS ❌";
    removeAllItemsButton.classList.add("options__remove-all-items");
    removeAllItemsButton.classList.add("button-styles");
    removeAllItemsButton.classList.add("card--childs");
    favoritesButton.classList.add("card--childs");
    saveFavoriteButton.classList.add("card--childs");
    optionsContainer.classList.add("buttons--transition");
    optionsContainer.append(removeAllItemsButton);

    removeAllItemsButton.addEventListener("click", () => clearAdvicesList());
}

function clearAdvicesList() {
    const items = document.querySelectorAll(".back__items-style");
    items.forEach(element => element.remove());
    localStorage.clear();

    //Mostrar mensaje al usuario que no hay items agregados
    const cardBack = document.querySelector(".card__back");
    const message = document.createElement("p");
    message.textContent = "NO ITEMS ADDED 😓";
    cardBack.classList.add("card--message");
    message.classList.add("message");

    cardBack.appendChild(message);
}

if (localStorage.length > 0) {
    createFavoritesButton();
}

getQuote();