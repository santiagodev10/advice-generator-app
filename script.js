//Vamos a seleccionar los elementos del DOM, pondremos un listener al boton, que al hacer click se dispare la funcion que haga el llamado a la API
const API = "https://api.adviceslip.com/advice";
const diceButton = document.querySelector(".front__get-advice");
const saveFavoriteButton = document.querySelector(".options__save-advice");

saveFavoriteButton.addEventListener("click", saveFavoriteAdvice);
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

        // Guarda el consejo actual como un atributo en el botón de guardar favoritos 
        saveFavoriteButton.dataset.id = data.slip.id; 
        saveFavoriteButton.dataset.advice = data.slip.advice;

        //Dice image rotating
        const diceImage = document.querySelector(".get-advice__dice-img");
        diceImage.classList.add("get-advice__dice-img--rotate");

        setTimeout(function () {
            diceImage.classList.remove("get-advice__dice-img--rotate");
        }, 1000);
        
        const favoriteListButton = document.querySelector(".options__favorites");

        if(favoriteListButton) {
            favoriteListButton.addEventListener("click", showFavoritesList);
        }
    } catch (error) {
        console.log("The request went wrong " + error);
    }
}

function saveFavoriteAdvice() {
    //aqui es donde se va a usar localStorage para guardar la frase y tambien renderizar el boton de "ver favoritos" LA PRIMERA VEZ, ya que no queremos que se cree cada vez que guarden algo
    const id = saveFavoriteButton.dataset.id; 
    const advice = saveFavoriteButton.dataset.advice;
    console.log(id);
    console.log(advice);

    //Por defecto adviceObject es un template string con sintaxis de array, pero al final del dia es un string, por eso se parsea a un array como tal con JSON.parse, y si no existe una propiedad "adviceObject" entonces se crea un array vacio
    const main = document.querySelector("main");
    let adviceObject = JSON.parse(localStorage.getItem("adviceObject")) || [];
    
    if (!adviceObject.some(item => item.advice === advice)) {
        adviceObject.push({advice, id});
        localStorage.setItem("adviceObject", JSON.stringify(adviceObject));
        //Aviso para hacerle saber al usuario que el advice fue guardado
        const adviceStoredNotification = document.createElement("span");
        adviceStoredNotification.textContent = "Advice saved ✅";
        adviceStoredNotification.classList.add("notification-message");
        main.prepend(adviceStoredNotification); 
        setTimeout(function() {
            adviceStoredNotification.classList.add("notification-transition");
        });
        adviceStoredNotification.addEventListener("transitionend", () => {
            adviceStoredNotification.remove();
        })    
        
        console.log("SE GUARDO EN LOCALSTORAGE");
    } else {
        //Aqui hay que colocar un aviso al usuario que guardo ese advice
        const advicePreviouslyStored = document.createElement("span");
        advicePreviouslyStored.textContent = "Advice already saved ⭐";
        advicePreviouslyStored.classList.add("notification-message");
        main.prepend(advicePreviouslyStored); 
        setTimeout(function() {
            advicePreviouslyStored.classList.add("notification-transition");
        });
        advicePreviouslyStored.addEventListener("transitionend", () => {
            advicePreviouslyStored.remove();
        })
        console.log("YA ESTA GUARDADO ESE STRING");
    }

    //Logica para renderizar el boton de favoritos
    const containerOfRemoveButton = document.querySelector(".options__favorites-container");
    const containerOfGoBackButton = document.querySelector(".options__save-advice-container")
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
}

function createFavoritesButton() {
    console.log("SI ESTA adviceObject");
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

    const storedAdvices = JSON.parse(localStorage.getItem("adviceObject"));
    console.log(storedAdvices);

    // Crear elementos que contendrán las frases y ids guardados en localStorage
    const backCard = document.querySelector(".card__back"); 
    const ul = backCard.querySelector("ul") || document.createElement("ul"); 

    if (!backCard.contains(ul)) { 
        backCard.appendChild(ul); 
    } 
    
    ul.innerHTML = ""; // Limpiar el contenido del ul antes de agregar los elementos

    //Hay que recorrer cada elemento del array storedAdvices, e ingresar a la propiedad id del objeto que esta en cada posicion del array

    for (adviceElement of storedAdvices) {
        console.log(adviceElement.id);

        const message = document.querySelector(".message");
        if(backCard.contains(message)) {
            message.remove();
        }
       
        //Creando elementos
        const li = document.createElement("li");
        const adviceSpan = document.createElement("span");
        const dropDownArrow = document.createElement("img");
        const removeAdvice = document.createElement("span");

        //Insertando contenido a los elementos y renderizandolos
        adviceSpan.textContent = `ADVICE #${adviceElement.id}`;
        dropDownArrow.src = "./images/up-arrow.png";
        removeAdvice.textContent = "❌";
        li.classList.add("back__items");
        adviceSpan.classList.add("items__advice-number");
        adviceSpan.classList.add("advice-number");
        dropDownArrow.classList.add("drop-down-arrow");
        removeAdvice.classList.add("items__remove-item");
        adviceSpan.append(dropDownArrow);
        li.append(adviceSpan, removeAdvice);
        backCard.appendChild(ul);
        ul.appendChild(li);
    }

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
    
        removeAllItemsButtonCreated.textContent = "REMOVE ALL ADVICES ❌";
        goBackButtonCreated.textContent = "GO BACK ◀";
        removeAllItemsButtonCreated.classList.add("options__remove-all-items", "button-styles", "options--childs");
        goBackButtonCreated.classList.add("options__go-back", "button-styles", "options--childs");
        favoritesButton.classList.add("options--childs");
        saveFavoriteButton.classList.add("options--childs");
        //Contenedores de botones
        saveAdviceContainer.append(goBackButtonCreated);
        favoritesContainer.append(removeAllItemsButtonCreated);

        goBackButtonCreated.addEventListener("click", () => goBackToFrontfaceCard());
        removeAllItemsButtonCreated.addEventListener("click", () => clearAdvicesList());

        //Listener para el ul que dispara la funcion openAndCloseStoredAdvice
        ul.addEventListener("click", (event) => openAndCloseStoredAdvice(event));
        //Listener para el ul, que detecte el elemento especifico usando el delegation pattern y dispare la funcion clearSpecificAdvice removiendo el item especifico

    }
}

function clearAdvicesList() {
    const items = document.querySelectorAll(".back__items");
    items.forEach(element => element.remove());
    localStorage.clear();

    //Mostrar mensaje al usuario que no hay items agregados
    messageEmptyLocalStorage();

    //Desaparecer el boton porque ya se uso, pero realmente lo que hay es que remover el contenedor del boton de remover item y el boton de save to favorites
    const containerOfRemoveButton = document.querySelector(".options__favorites-container");
    containerOfRemoveButton.classList.add("inactive");
}

function messageEmptyLocalStorage() {
    //Mostrar mensaje al usuario que no hay items agregados
    const cardBack = document.querySelector(".card__back");
    const message = document.createElement("p");
    message.textContent = "NO ITEMS ADDED 😓";
    cardBack.classList.add("card--message");
    message.classList.add("message");
    cardBack.appendChild(message);
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

function openAndCloseStoredAdvice(event) {
    //En esta funcion tiene que ir la logica para abrir el advice, eso quiere decir que el elemento que tiene el id debe tener un listener que dispare esta funcion.    
    const liItem = event.target.closest(".back__items");
    const specificItemClicked = event.target.closest(".items__advice-number");
    const specificRemoveItemClicked = event.target.closest(".items__remove-item");
    const storage = JSON.parse(localStorage.getItem("adviceObject"));
    console.log(specificItemClicked);
    
    if (specificItemClicked) {
        console.log(storage);

        const findSpecificItem = storage.find(item => {
            const adviceId = specificItemClicked.textContent.substring(8);
            console.log(adviceId);
            // console.log(item.id);
            
            if(item.id === adviceId) {
                console.log("SI COINCIDEN LOS IDS");
                console.log(item.advice);
                //Debo crear el elemento donde se va a desplegar el advice
                let adviceElement = liItem.querySelector(".items__advice-string");
                const dropDownArrow = liItem.querySelector(".drop-down-arrow");
                  
                if(!adviceElement) {
                    adviceElement = document.createElement("span");
                    adviceElement.textContent = `"${item.advice}"`;
                    adviceElement.classList.add("items__advice-string");
                    liItem.append(adviceElement);
                    //Rotar la imagen de la flecha mirando hacia abajo
                    dropDownArrow.classList.add("drop-down-arrow--rotate");
                } else {
                    dropDownArrow.classList.remove("drop-down-arrow--rotate");
                    adviceElement.remove();
                }
            } 
        })
        console.log(findSpecificItem);
    } else if (specificRemoveItemClicked) {
        const findSpecificRemoveButton = storage.find(item => {
            const adviceId = specificRemoveItemClicked.previousSibling.textContent.substring(8);

            if(item.id === adviceId) {
                console.log(item);
                const liContainerToRemove = specificRemoveItemClicked.closest(".back__items");
                const removeAdviceFromArray = storage.filter(element => element !== item);
                liContainerToRemove.remove();
                localStorage.setItem("adviceObject", JSON.stringify(removeAdviceFromArray));
            } 
        });

        console.log(storage.length);
        //Si eliminan el ultimo elemento mostrar el mensaje que ya no hay items añadidos y ocultar el boton de remover todos los items ya que no seria necesario
        if (storage.length === 1) {
            const containerOfRemoveButton = document.querySelector(".options__favorites-container");
            containerOfRemoveButton.classList.add("inactive"); 
            messageEmptyLocalStorage();

            //Aqui si hay que usar el metodo removeItem, porque necesitamos eliminar el array completamente
            localStorage.removeItem("adviceObject");
        }
        console.log(findSpecificRemoveButton);
    }
}

if (localStorage.length > 0) {
    createFavoritesButton();
}

getAdvice();