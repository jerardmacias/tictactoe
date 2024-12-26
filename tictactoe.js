const gameGrid = document.getElementById('game');
const counter = document.getElementById('counter');
const restartButton = document.getElementById('restart');
const resetButton = document.getElementById('reset');
const winnerModal = document.getElementById('winnerModal');
const winnerMessage = document.getElementById('winnerMessage');


// Separar cada logica y funcionalidades en funciones independientes, por ejemplo todo el manejo de localStorage en una funcion
// Crear observer que ejecute todo el inicio del juego, esperar a que cargue el dom

// Inicialización del objeto
const game = {
    // booleà per controlar el canvi de torns
    xTurn: true,
    // estat de X, matriu de strings
    xState: [],
    // estat de O, matriu de strings
    oState: [],
    // possibles combinacions que guanyen la partida
    winningStates: [
        // Files
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],

        // Columnes
        ['0', '3', '6'],
        ['1', '4', '7'],
        ['2', '5', '8'],

        // Diagonal
        ['0', '4', '8'],
        ['2', '4', '6']
    ],
    gamesPlayed: parseInt(localStorage.getItem('gamesPlayed')) || 0,
    xWins: parseInt(localStorage.getItem('xWins')) || 0,
    oWins: parseInt(localStorage.getItem('oWins')) || 0,
}

// Muestra los valores de las partidas en los contadores
document.getElementById('xWins').innerText = `Wins: ${game.xWins}`;
document.getElementById('oWins').innerText = `Wins: ${game.oWins}`;
document.getElementById('gamesPlayed').innerText = `Played: ${game.gamesPlayed}`;

function initializeGrid() {

    // Añadimos las celdas por javascript y calculamos que bordes dibujar en cada index
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        if (i === 0 || i === 1 || i === 3 || i === 4) {
            cell.classList.add('grid-cell', 'hover-pointer', 'border-r-4', 'border-b-4', 'border-gray-600');
        } else if (i === 2 || i === 5) {
            cell.classList.add('grid-cell', 'hover-pointer', 'border-b-4', 'border-gray-600');
        } else if (i === 6 || i === 7) {
            cell.classList.add('grid-cell', 'hover-pointer', 'border-r-4', 'border-gray-600');
        } else {
            cell.classList.add('grid-cell', 'hover-pointer');
        }
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', () => handleCellClick(cell));
        gameGrid.appendChild(cell);
    }
}


function handleCellClick(cell) {

    // Recogemos el atributo data-index del div clickado
    const index = cell.getAttribute('data-index');

    // Si el elemento ya contiene la clase "x" o "o", no hara nada
    if (cell.classList.contains('x') || cell.classList.contains('o')) return;

    // Si ha sido clickado quitamos la case hover-pointer
    cell.classList.remove('hover-pointer');

    if (game.xTurn) {
        cell.classList.add('x');  // Añade clase X a la celda
        game.xState.push(index);  // Añade el index al array de estado
    } else {
        cell.classList.add('o');  // Añade clase O a la celda
        game.oState.push(index);  // Añade el index al array de estado
    }

    //  Chequea el ganador en la funcion checkWinner pasandole como argumento el estado (index) de cada jugador
    if (checkWinner(game.xTurn ? game.xState : game.oState)) {
        showModal(game.xTurn ? 'X' : 'O');
    } else if (game.xState.length + game.oState.length === 9) {
        showModal('draw'); // Si es empate, pasara el string "draw" a la función showModal
    } else {
        // Si aún no hay ganador, invertimos el jugador e insertamos el texto del turno en el div correspondiente 
        game.xTurn = !game.xTurn;
        counter.innerText = `${game.xTurn ? 'Player - X' : 'Player - O'}`;
    }
}

function checkWinner(playerState) {

    // con esta función se van comprobando los numeros del array hasta que encuentra la combinacion en los arrays de winningStates.

    /** El metodo some verifica si al menos uno de los elementos cumple con la condición especificada en la función de callback.
        En este caso, some revisa si alguna de las combinaciones ganadoras (combination) cumple con la condición de ser una combinación ganadora del playerState.

        El método every verifica si todos los elementos del array (combination en este caso) cumplen con una condición.
        La condición playerState.includes(index), que verifica si el index actual (una posición del tablero en combination) está en el array playerState.
        Si todos los índices de combination están en playerState, significa que el jugador actual tiene esa combinación y, por lo tanto, ha ganado.

        Finálmente, si some encuentra una combinación ganadora, devolvera true.
    **/
    return game.winningStates.some(combination => combination.every(index => playerState.includes(index)));
}

function showModal(winner) {

    // inserta el texto en el mensaje del modal dependiendo de lo que llegue en el parametro winner
    if (winner === 'draw') {
        // Muestra el modal con empate si el argumento recibe el string draw
        winnerMessage.innerText = "Draw!";
    } else {
        // Muestra el modal con el ganador
        winnerMessage.innerText = `The winner is Player ${winner}! 🎉`;
    }

    manageCounterPannel(winner);

    // Añadimos y removemos las clases para hacer el efecto fade-out fade-in
    winnerModal.classList.remove('hidden', 'fade-out');
    winnerModal.classList.add('fade-in');
}

function closeModal() {
    // Invertimos la clase para efecto fade-out
    winnerModal.classList.replace('fade-in', 'fade-out');

    // Dejamos tiempo a que acabe el efectp fade-out y reseteamos el juego
    setTimeout(() => {
        winnerModal.classList.add('hidden');
        resetGame("modal");
    }, 500);
}

function manageCounterPannel(winner) {
    // Actualiza los contadores de partidas ganadas y lo guarda en localStorage
    if (winner === 'X') {
        game.xWins++;
        document.getElementById('xWins').innerText = `Wins: ${game.xWins}`;
        localStorage.setItem('xWins', game.xWins);  // Guarda Ganadas X en localStorage
    } else if (winner === 'O') {
        game.oWins++;
        document.getElementById('oWins').innerText = `Wins: ${game.oWins}`;
        localStorage.setItem('oWins', game.oWins);  // Guarda Ganadas O en localStorage
    }

    // Incrementa el contador de partidas jugadas y las guarda en localStorage
    game.gamesPlayed++;
    document.getElementById('gamesPlayed').innerText = `Played: ${game.gamesPlayed}`;
    localStorage.setItem('gamesPlayed', game.gamesPlayed);  // Guarda Partidas Ganadas en localStorage
}

function resetGame() {
    // Setea el turno del jugador X a true y Reinicia los arrays de estado en el objeto game
    game.xTurn = true;
    game.xState = [];
    game.oState = [];

    // Añade el texto inicial al div con el id counter
    counter.textContent = 'Player - X';

    // Vacia todos los elementos hijos del contenedor con id game y ejecuta la funcion que inserta todos los elementos de nuevo
    gameGrid.innerHTML = '';
    initializeGrid();
}

function resetCounters() {
    // Reinicia los contadores en el objeto game y en la interfaz
    game.gamesPlayed = 0;
    game.xWins = 0;
    game.oWins = 0;

    // Actualizar la interfaz
    document.getElementById('gamesPlayed').innerText = `Player: ${game.gamesPlayed}`;
    document.getElementById('xWins').innerText = `Wins: ${game.xWins}`;
    document.getElementById('oWins').innerText = `Wins: ${game.oWins}`;

    // Borrar los datos de localStorage
    localStorage.clear();
}

// Restart & Reset Button
restartButton.addEventListener('click', resetGame);
resetButton.addEventListener('click', resetCounters);

// Añade todos los divs de las celdas dinámicamente
initializeGrid();