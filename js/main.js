/*
Copiamo la griglia fatta ieri nella nuova repo e aggiungiamo la logica del gioco 
(attenzione: non bisogna copiare tutta la cartella dell’esercizio ma solo 
    l’index.html, e le cartelle js/ css/ con i relativi script e fogli di stile, 
    per evitare problemi con l’inizializzazine di git).
L’utente indica un livello di difficoltà in base al quale viene generata una griglia 
di gioco quadrata, in cui ogni cella contiene un numero tra quelli compresi in un 
range:
con difficoltà 1 => tra 1 e 100
con difficoltà 2 => tra 1 e 81
con difficoltà 3 => tra 1 e 49
Il computer deve generare 16 numeri casuali nello stesso range della difficoltà 
prescelta: le bombe.
I numeri nella lista delle bombe non possono essere duplicati.
In seguito l’utente clicca su ogni cella: se il numero è presente nella lista dei 
numeri generati - abbiamo calpestato una bomba - la cella si colora di rosso e la 
partita termina, altrimenti la cella cliccata si colora di azzurro e l’utente può 
continuare a cliccare sulle altre celle.
La partita termina quando il giocatore clicca su una bomba o raggiunge il numero 
massimo possibile di numeri consentiti.
Al termine della partita il software deve scoprire tutte le bombe e comunicare il
 punteggio, cioè il numero di volte che l’utente ha inserito un numero consentito.
 */


// Referenze della difficoltà, del bottone e della griglia
const selectRef = document.getElementById('difficult');
const playBtn = document.querySelector('.btn');
const gridConteiner = document.querySelector('.grid-conteiner');

// Difficoltà
playBtn.addEventListener('click', () => {

    //Resettiamo il conteiner
    gridConteiner.innerHTML = '';

    //Settiamo il grid in base alla difficoltà
    const difficultGrid = selectRef.value;
    let numberCells;
    let cellPerSide;

    switch (difficultGrid) {
        case '1':
            numberCells = 49;
            cellPerSide = 7;
            break;
        case '2':
            numberCells = 81;
            cellPerSide = 9;
            break;
        case '3':
            numberCells = 100;
            cellPerSide = 10;
    }
    
    // Creazione della Grid;
    const grid = document.createElement('div');
    grid.classList.add('grid'); 
    gridConteiner.append(grid);
    
    // Generiamo le bombe
    const totBombRef = 16;
    const bombe = genBomb(totBombRef, numberCells);
    console.log(bombe);
    
    //Generiamo i tetativi
    const attempts = [];
    const attemptsMax = numberCells - bombe.length;

    
    
    //Generiamo le square
    for (let i = 1; i <= numberCells; i++) {
        const square = createSquare(cellPerSide, i, bombe, attempts, attemptsMax);
        grid.append(square);
    }
    





})










/* FUNCTION */
//Generatore bomb list
function genBomb(totBomb, totCell) {
     //generiamo una lista di bombe col ciclo while
    const bombe = [];

    while (bombe.length < totBomb) {
        const bomba = genRandomNum(1, totCell);
        
        //numero univoco
        if (!bombe.includes(bomba)) {
            bombe.push(bomba)
        }
    }

    return bombe;
}





//Generiamo numeri random 
function genRandomNum(minore, maggiore) {
    const randomNum = Math.floor(Math.random() * (maggiore - minore) * minore);
    return randomNum;
}




/* Generiamo il nodo square */
function createSquare(cells, num, bomblist, attempts, maxAttempts) {
    const squareNode = document.createElement('div');
    squareNode.classList.add('square');

    //Style delle square
    squareNode.style.width = `calc(100% / ${cells})`;
    squareNode.style.height = `calc(100% / ${cells})`;

    // Generiamo il numero sullo square
    let span = document.createElement('span');
        span.innerHTML = `${num}`;
        squareNode.append(span);


    // Aggiungiamo la classe .clicked al click
    squareNode.addEventListener('click', function() {
        gestioneSquare(squareNode, bomblist, attempts, maxAttempts)

    })

    return squareNode;
}


//gestione click square
function gestioneSquare(square, bomblist, attempts, maxAttempts) {
    //ottieni numero square;
    const number = parseInt(square.innerText);
    console.log(number);

    //capire se abbiamo colpito una bomba
    //Non è una bomba e non è un numero già cliccato
    if (bomblist.includes(number)) {
        endGame(bomblist, attempts, maxAttempts)
    } else if (!attempts.includes(number)) {
        //aggiungere colore di sfondo
        square.classList.add('square-safe');

        //aggiungere il numero alla lista tentativi
        attempts.push(number)
        console.log('tentativi', attempts);

        //Messaggio
        if (attempts.length === maxAttempts) {
            endGame(bomblist, attempts, maxAttempts)
        }


    }



}



//End Game Logic
function endGame(bomblist, attempts, maxAttempts) {
    //Ottenere tutte le square
    const allSquare = document.querySelectorAll('.square');
    
    //Mostrare Tutte le bombe
    for (let i = 0; i < allSquare.length; i++) {
        const square = allSquare[i];
        const squareValue = parseInt(square.innerText)

        if (bomblist.includes(squareValue)) {
            square.classList.add('square-bomb');
        }
    }

    //Testo del messaggio End Game
    let message = `Complimenti hai vinto! Hai indovintato i ${maxAttempts} tentativi validi. Gioca Ancora`

    // In Caso di perdita
    if (!attempts.length < maxAttempts) {
        message = `Hai Perso, Hai beccato ${attempts.length} tentativi! Gioca Ancora`;
    }

    //elemento del messaggio
    const messageEl = document.createElement('div');
    messageEl.classList.add('message');
    messageEl.append(message);

    const gridConteiner = document.querySelector('.grid-conteiner');

    gridConteiner.append(messageEl);

    //Disabilita le square;
    document.querySelector('.grid').classList.add('disabled');
}



