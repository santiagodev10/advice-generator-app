//Vamos a seleccionar los elementos del DOM, pondremos un listener al boton, que al hacer click se dispare la funcion que haga el llamado a la API
const API = "https://api.adviceslip.com/advice";
const diceButton = document.querySelector(".front__get-advice");
const saveFavoriteButton = document.querySelector(".options__save-advice");

diceButton.addEventListener("click", getAdvice);

async function getAdvice() {
    try {
        const response = await fetch(API);
        const data = await response.json();
        console.log(data.slip);
    
        const adviceString = document.querySelector(".front__advice-string");
        const adviceNumber = document.querySelector(".front__advice-number");
        adviceString.textContent = `"${data.slip.advice}"`;
        adviceNumber.textContent = `ADVICE #${data.slip.id}`;
    
        saveFavoriteButton.addEventListener("click", () => saveFavoriteAdvice(data.slip.id, data.slip.advice));

        const favoriteListButton = document.querySelector(".options__favorites");

        if(favoriteListButton) {
            favoriteListButton.addEventListener("click", showFavoritesList);
        }
    } catch (error) {
        console.log("The request went wrong " + error);
    }
}

function saveFavoriteAdvice(id, advice) {
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

    //Logica para renderizar el boton de favoritos
    const containerOfRemoveButton = document.querySelector(".options__favorites-container");
    // Verifica si la bandera 'buttonCreated' existe en localStorage 
    if (!localStorage.getItem('buttonCreated') && !containerOfRemoveButton) { 
        createFavoritesButton(); 
        // Establece la bandera 'buttonCreated' en localStorage para indicar que el botón se ha creado 
        localStorage.setItem('buttonCreated', true); 
    } else if(containerOfRemoveButton.classList.contains("inactive")) {
        //Al removerle la clase inactive, el contenedor vuelve a ser visible, necesitamos eso a partir de la segunda iteracion o cuando no exista el contenedor en el DOM
        containerOfRemoveButton.classList.remove("inactive");
    }
    

    const favoriteListButton = document.querySelector(".options__favorites");

    if(favoriteListButton) {
        favoriteListButton.addEventListener("click", showFavoritesList);  
        //Quita la clase de card--message a la parte de atras de la tarjeta
        const cardBack = document.querySelector(".card__back");
        cardBack.classList.remove("card--message");
    }

    //Hay que mostrar algun mensaje o indicacion al usuario que guardo el advice, y tambien en caso de que ya lo tenga guardado
    
}

function createFavoritesButton() {
    console.log("SI ESTA ADVICEQUOTES");
    //hay que crear el boton de ver la lista de favoritos y su contenedor
    const options = document.querySelector(".options");
    const optionsContainer = document.createElement("div");
    const favoritesButton = document.createElement("button");
    favoritesButton.textContent = "FAVORITE ADVICES ⭐";
    favoritesButton.classList.add("options__favorites");
    favoritesButton.classList.add("button-styles");
    optionsContainer.classList.add("options__favorites-container");
    options.appendChild(optionsContainer);
    optionsContainer.append(favoritesButton);
}

function showFavoritesList() {
    //Esta funcion tiene mostrar la lista de favoritos que contiene las frases almacenadas en localStorage, y aplicarle las clases a los elementos para haga las transiciones respectivas, ya de eso se encarga CSS.
    const card = document.querySelector(".card"); 
    card.classList.add("card--transition", "card--transform");
    // options.classList.add("inactive");
    // options.classList.add("trigger-inactive");

    const storedQuotes = JSON.parse(localStorage.getItem("adviceQuotes"));
    const storedIds = JSON.parse(localStorage.getItem("adviceIds"));
    console.log(storedQuotes);
    console.log(storedIds);

    // Crear elementos que contendrán las frases y ids guardados en localStorage
    const backCard = document.querySelector(".card__back"); 
    const ul = backCard.querySelector("ul") || document.createElement("ul"); 

    if (!backCard.contains(ul)) { 
        backCard.appendChild(ul); 
    } 
    
    ul.innerHTML = ""; // Limpiar el contenido del ul antes de agregar los elementos

    storedIds.forEach(element => {
        const message = document.querySelector(".message");
        if(backCard.contains(message)) {
            message.remove();
        }
        const li = document.createElement("li");
        const adviceSpan = document.createElement("span");
        const removeAdvice = document.createElement("span");

        adviceSpan.textContent = `ADVICE #${element}`;
        removeAdvice.textContent = "❌";
        li.classList.add("back__items");
        adviceSpan.classList.add("items__advice-number");
        adviceSpan.classList.add("advice-number");
        removeAdvice.classList.add("items__remove-item");
        li.append(adviceSpan, removeAdvice);
        backCard.appendChild(ul);
        ul.appendChild(li);
    });

    //De esta manera siempre se genera la transicion porque en cada ejecucion se le aplican las clases de las transformaciones y transiciones a los contenedores
    const saveAdviceContainer = document.querySelector(".options__save-advice-container");
    const favoritesContainer = document.querySelector(".options__favorites-container");
    saveAdviceContainer.classList.add("options--container", "buttons--transition", "buttons--transform");
    favoritesContainer.classList.add("options--container", "buttons--transition", "buttons--transform");

    //Boton para limpiar el localStorage y boton para volver a la parte frontal de la tarjeta
    //Validar que se crea UNA SOLA VEZ el boton de remove all items y el boton de go back
    const goBackButton = document.querySelector(".options__go-back");
    const removeButton = document.querySelector(".options__remove-all-items");

    if (!goBackButton && !removeButton) {
        const favoritesButton = document.querySelector(".options__favorites");
        const removeAllItemsButtonCreated = document.createElement("button");
        const goBackButtonCreated = document.createElement("button");
    
        removeAllItemsButtonCreated.textContent = "REMOVE ALL ITEMS ❌";
        goBackButtonCreated.textContent = "GO BACK ⬅";
        removeAllItemsButtonCreated.classList.add("options__remove-all-items", "button-styles", "options--childs");
        goBackButtonCreated.classList.add("options__go-back", "button-styles", "options--childs");
        favoritesButton.classList.add("options--childs");
        saveFavoriteButton.classList.add("options--childs");
        //Contenedores de botones
        saveAdviceContainer.append(goBackButtonCreated);
        favoritesContainer.append(removeAllItemsButtonCreated);

        goBackButtonCreated.addEventListener("click", () => goBackToFrontfaceCard());
        removeAllItemsButtonCreated.addEventListener("click", () => clearAdvicesList());
    }
}

function clearAdvicesList() {
    const items = document.querySelectorAll(".back__items");
    items.forEach(element => element.remove());
    localStorage.clear();

    //Mostrar mensaje al usuario que no hay items agregados
    const cardBack = document.querySelector(".card__back");
    const message = document.createElement("p");
    message.textContent = "NO ITEMS ADDED 😓";
    cardBack.classList.add("card--message");
    message.classList.add("message");

    cardBack.appendChild(message);

    //Desaparecer el boton porque ya se uso, pero realmente lo que hay es que remover el contenedor del boton de remover item y el boton de save to favorites
    const containerOfRemoveButton = document.querySelector(".options__favorites-container");
    containerOfRemoveButton.classList.add("inactive");
}

function goBackToFrontfaceCard() {
    const goBackButton = document.querySelector(".options__go-back");
    const card = document.querySelector(".card");
    console.log(goBackButton);
    //Quitarle la transformacion para que vuelva a la parte frontal de la tarjeta
    card.classList.remove("card--transform");

    //Hay que quitarle la transformacion a los botones para que vuelvan a su cara frontal
    const containerOfGoBackButton = document.querySelector(".options__save-advice-container");
    const containerOfRemoveButton = document.querySelector(".options__favorites-container");
    containerOfGoBackButton.classList.remove("buttons--transform");
    containerOfRemoveButton.classList.remove("buttons--transform");
}

if (localStorage.length > 0) {
    createFavoritesButton();
}

getAdvice();