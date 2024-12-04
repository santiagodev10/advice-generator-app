//Vamos a seleccionar los elementos del DOM, pondremos un listener al boton, que al hacer click se dispare la funcion que haga el llamado a la API
const API = "https://api.adviceslip.com/advice";
const diceButton = document.querySelector("button");

diceButton.addEventListener("click", async () => {
    const response = await fetch(API);
    const data = await response.json();
    console.log(data.slip);
    
    const adviceString = document.querySelector(".card__advice-string");
    const adviceNumber = document.querySelector(".card__advice-number");
    adviceString.textContent = `"${data.slip.advice}"`;
    adviceNumber.textContent = `ADVICE #${data.slip.id}`

    //Save favorite quote
    const anotherResponse = await fetch(`${API}/${data.slip.id}`);
    const anotherData = await anotherResponse.json();
    console.log(anotherData);


})