const API = "https://api.adviceslip.com/advice";
const diceButton = document.querySelector(".front__get-advice");
const saveFavoriteButton = document.querySelector(".options__save-advice");

saveFavoriteButton.addEventListener("click", saveFavoriteAdvice);
diceButton.addEventListener("click", getAdvice);

async function getAdvice() {
    try {
        const response = await fetch(API);
        const data = await response.json();

        const adviceString = document.querySelector(".front__advice-string");
        const adviceNumber = document.querySelector(".front__advice-number");
        adviceString.textContent = `"${data.slip.advice}"`;
        adviceNumber.textContent = `ADVICE #${data.slip.id}`;

        // Store current advice and his id as attributes of the button of save to favorites
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
        const adviceString = document.querySelector(".front__advice-string");
        adviceString.textContent = "I'm sorry, an error has ocurred, i can't give you any advice right now 😥 please try later";
        saveFavoriteButton.removeEventListener("click", saveFavoriteAdvice);
        console.log("The request went wrong " + error);
    }
}

function saveFavoriteAdvice() {
    const id = saveFavoriteButton.dataset.id; 
    const advice = saveFavoriteButton.dataset.advice;
    const main = document.querySelector("main");
    let adviceObject = JSON.parse(localStorage.getItem("adviceObject")) || [];
    
    if (!adviceObject.some(item => item.advice === advice)) {
        adviceObject.push({advice, id});
        localStorage.setItem("adviceObject", JSON.stringify(adviceObject));
        // Notification to let the user to know that the advice was saved
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
    } else {
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
    }

    // Logic to render favorites button
    const containerOfRemoveButton = document.querySelector(".options__favorites-container");
    if (!localStorage.getItem('buttonCreated') && !containerOfRemoveButton) { 
        createFavoritesButton(); 
        localStorage.setItem('buttonCreated', true); 
    } else if(containerOfRemoveButton.classList.contains("inactive")) {
        containerOfRemoveButton.classList.remove("inactive");
    }
    
    const favoriteListButton = document.querySelector(".options__favorites");

    if(favoriteListButton) {
        favoriteListButton.addEventListener("click", showFavoritesList);  
        // Remove card--message class from the backface of the card
        const cardBack = document.querySelector(".card__back");
        cardBack.classList.remove("card--message");
    }    
}

function createFavoritesButton() {
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
    const card = document.querySelector(".card"); 
    card.classList.add("card--transition", "card--transform");

    const storedAdvices = JSON.parse(localStorage.getItem("adviceObject"));
    const backCard = document.querySelector(".card__back"); 
    const ul = backCard.querySelector("ul") || document.createElement("ul"); 

    if (!backCard.contains(ul)) { 
        backCard.appendChild(ul); 
    } 
    
    ul.innerHTML = ""; // Clean the content from the ul before adding the elements

    for (adviceElement of storedAdvices) {
        const message = document.querySelector(".message");
        if(backCard.contains(message)) {
            message.remove();
        }
       
        const li = document.createElement("li");
        const adviceSpan = document.createElement("span");
        const dropDownArrow = document.createElement("img");
        const removeAdvice = document.createElement("span");

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

    // Applying transform and transitions to the buttons containers.
    const saveAdviceContainer = document.querySelector(".options__save-advice-container");
    const favoritesContainer = document.querySelector(".options__favorites-container");
    saveAdviceContainer.classList.add("options--container", "buttons--transition", "buttons--transform");
    favoritesContainer.classList.add("options--container", "buttons--transition", "buttons--transform");

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
        ul.addEventListener("click", (event) => openAndCloseStoredAdvice(event));
    }
}

function clearAdvicesList() {
    const items = document.querySelectorAll(".back__items");
    items.forEach(element => element.remove());
    localStorage.clear();
    messageEmptyLocalStorage();

    const containerOfRemoveButton = document.querySelector(".options__favorites-container");
    containerOfRemoveButton.classList.add("inactive");
}

function messageEmptyLocalStorage() {
    const cardBack = document.querySelector(".card__back");
    const message = document.createElement("p");
    message.textContent = "NO ITEMS ADDED 😓";
    cardBack.classList.add("card--message");
    message.classList.add("message");
    cardBack.appendChild(message);
}

function goBackToFrontfaceCard() {
    const card = document.querySelector(".card");
    card.classList.remove("card--transform");

    const containerOfGoBackButton = document.querySelector(".options__save-advice-container");
    const containerOfRemoveButton = document.querySelector(".options__favorites-container");
    containerOfGoBackButton.classList.remove("buttons--transform");
    containerOfRemoveButton.classList.remove("buttons--transform");
}

function openAndCloseStoredAdvice(event) {
    const liItem = event.target.closest(".back__items");
    const specificItemClicked = event.target.closest(".items__advice-number");
    const specificRemoveItemClicked = event.target.closest(".items__remove-item");
    const storage = JSON.parse(localStorage.getItem("adviceObject"));
    
    if (specificItemClicked) {
        storage.find(item => {
            const adviceId = specificItemClicked.textContent.substring(8);
            
            if(item.id === adviceId) {
                let adviceElement = liItem.querySelector(".items__advice-string");
                const dropDownArrow = liItem.querySelector(".drop-down-arrow");
                  
                if(!adviceElement) {
                    adviceElement = document.createElement("span");
                    adviceElement.textContent = `"${item.advice}"`;
                    adviceElement.classList.add("items__advice-string");
                    liItem.append(adviceElement);
                    dropDownArrow.classList.add("drop-down-arrow--rotate");
                } else {
                    dropDownArrow.classList.remove("drop-down-arrow--rotate");
                    adviceElement.remove();
                }
            } 
        })
    } else if (specificRemoveItemClicked) {
        storage.find(item => {
            const adviceId = specificRemoveItemClicked.previousSibling.textContent.substring(8);

            if(item.id === adviceId) {
                const liContainerToRemove = specificRemoveItemClicked.closest(".back__items");
                const removeAdviceFromArray = storage.filter(element => element !== item);
                liContainerToRemove.remove();
                localStorage.setItem("adviceObject", JSON.stringify(removeAdviceFromArray));
            } 
        });

        if (storage.length === 1) {
            const containerOfRemoveButton = document.querySelector(".options__favorites-container");
            containerOfRemoveButton.classList.add("inactive"); 
            messageEmptyLocalStorage();
            localStorage.removeItem("adviceObject");
        }
    }
}

if (localStorage.length > 0) {
    createFavoritesButton();
}

getAdvice();