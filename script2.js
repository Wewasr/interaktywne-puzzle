// Zmienne globalne
let playerName = '';
let playerAge = '';
let currentLevel = 3; // Początkowy rozmiar siatki
const maxLevel = 5; // Maksymalny rozmiar siatki
let gridSize;
let totalPieces;
let pieceWidth;
let pieceHeight;
let draggedPiece = null;

// Funkcja ustawiająca rozmiar siatki i kawałków
function setGridSize(size) {
    gridSize = size;
    totalPieces = gridSize * gridSize;
    pieceWidth = 300 / gridSize; // Ustal stałą szerokość kontenera na 300px
    pieceHeight = pieceWidth;
}

// Funkcja inicjalizująca grę
function init() {
    // Ukryj przycisk "Spróbuj ponownie" na początku poziomu
    document.getElementById('retry-button').style.display = 'none';

    // Ustaw tytuł gry z informacją o aktualnym poziomie
    document.getElementById('game-title').textContent = `Poziom ${currentLevel - 2} - Puzzle ${currentLevel} x ${currentLevel}`;

    setGridSize(currentLevel);
    generatePuzzleSlots();
    generatePuzzlePieces();
}

// Generowanie miejsc na puzzle
function generatePuzzleSlots() {
    const puzzleContainer = document.getElementById('puzzle-container');
    puzzleContainer.innerHTML = ''; // Wyczyść kontener
    puzzleContainer.style.width = `${pieceWidth * gridSize}px`;
    puzzleContainer.style.height = `${pieceHeight * gridSize}px`;

    // Ustawienie CSS Grid
    puzzleContainer.style.display = 'grid';
    puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${pieceWidth}px)`;
    puzzleContainer.style.gridTemplateRows = `repeat(${gridSize}, ${pieceHeight}px)`;
    puzzleContainer.style.gridGap = '0px';

    for (let i = 1; i <= totalPieces; i++) {
        const slot = document.createElement('div');
        slot.classList.add('puzzle-slot');
        slot.dataset.index = i;

        // Ustaw szerokość i wysokość slotu
        slot.style.width = `${pieceWidth}px`;
        slot.style.height = `${pieceHeight}px`;

        // Obsługa przeciągania
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('drop', drop);

        puzzleContainer.appendChild(slot);
    }
}

// Generowanie kawałków puzzli
function generatePuzzlePieces() {
    const piecesContainer = document.getElementById('pieces-container');
    piecesContainer.innerHTML = ''; // Wyczyść kontener
    piecesContainer.style.width = `${pieceWidth * gridSize}px`;
    piecesContainer.style.height = `${pieceHeight * gridSize}px`;

    // Ustawienie CSS Grid
    piecesContainer.style.display = 'grid';
    piecesContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${pieceWidth}px)`;
    piecesContainer.style.gridTemplateRows = `repeat(${gridSize}, ${pieceHeight}px)`;
    piecesContainer.style.gridGap = '0px';

    const piecesArray = generatePiecesArray();
    shuffleArray(piecesArray);

    piecesArray.forEach((number) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('puzzle-piece');
        imgWrapper.draggable = true;

        // Ustaw szerokość i wysokość wrappera
        imgWrapper.style.width = `${pieceWidth}px`;
        imgWrapper.style.height = `${pieceHeight}px`;

        const img = document.createElement('img');
        img.src = `images/${gridSize}x${gridSize}/puzzle${number}.jpg`;
        img.id = `piece-${number}`;

        // Obsługa przeciągania
        imgWrapper.addEventListener('dragstart', dragStart);

        imgWrapper.appendChild(img);
        piecesContainer.appendChild(imgWrapper);
    });
}

// Funkcja do generowania tablicy z numerami kawałków
function generatePiecesArray() {
    const array = [];
    for (let i = 1; i <= totalPieces; i++) {
        array.push(i);
    }
    return array;
}

// Tasowanie tablicy
function shuffleArray(array) {
    array.sort(() => Math.random() - 0.5);
}

// Funkcje obsługi przeciągania i upuszczania
function dragStart(event) {
    draggedPiece = event.target.parentElement;
    event.dataTransfer.setData('text/plain', event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    let slot = event.target;

    // Jeśli upuszczamy na obrazek w slocie, to pobierz jego rodzica (slot)
    if (slot.classList.contains('puzzle-piece') || slot.tagName === 'IMG') {
        slot = slot.parentElement;
    }

    // Sprawdzenie, czy slot jest pusty
    if (slot.classList.contains('puzzle-slot') && slot.children.length === 0) {
        slot.appendChild(draggedPiece);
        checkIfPuzzleCompleted();
    }
}

// Sprawdzanie, czy puzzle zostały ułożone poprawnie
function checkIfPuzzleCompleted() {
    const slots = document.querySelectorAll('.puzzle-slot');
    let isCompleted = true;
    let allSlotsFilled = true;

    slots.forEach((slot) => {
        const piece = slot.firstElementChild;
        if (piece) {
            const pieceNumber = piece.firstElementChild.id.replace('piece-', '');
            const slotNumber = slot.dataset.index;
            if (pieceNumber !== slotNumber) {
                isCompleted = false;
            }
        } else {
            isCompleted = false;
            allSlotsFilled = false;
        }
    });

    if (isCompleted) {
        setTimeout(() => {
            alert(`Brawo, ${playerName}! Ułożyłeś puzzle ${currentLevel} x ${currentLevel}!`);

            if (currentLevel < maxLevel) {
                // Zwiększ poziom
                currentLevel++;

                // Zachęć do przejścia do następnego poziomu
                if (confirm('Świetna robota! Czy chcesz spróbować trudniejszego poziomu?')) {
                    // Rozpocznij nowy poziom
                    init();
                } else {
                    alert('Dziękujemy za grę! Do zobaczenia następnym razem!');
                }
            } else {
                // Ostatni poziom ukończony
                alert(`Gratulacje, ${playerName}! Ukończyłeś wszystkie poziomy! Jesteś niesamowity!`);
            }
        }, 100);
    } else if (allSlotsFilled) {
        // Wyświetl przycisk "Spróbuj ponownie"
        document.getElementById('retry-button').style.display = 'block';

        // Możesz również dodać komunikat
        alert('Puzzle są ułożone niepoprawnie. Spróbuj ponownie.');
    } else {
        // Ukryj przycisk "Spróbuj ponownie" jeśli nie wszystkie sloty są wypełnione
        document.getElementById('retry-button').style.display = 'none';
    }
}

// Funkcja resetująca obecny poziom
function retryLevel() {
    // Wyczyść kontenery
    document.getElementById('puzzle-container').innerHTML = '';
    document.getElementById('pieces-container').innerHTML = '';

    // Ponownie zainicjuj poziom
    init();
}

// Funkcja obsługująca rozpoczęcie gry
function startGame() {
    // Pobierz imię i wiek gracza z pól input
    playerName = document.getElementById('player-name').value.trim();
    playerAge = document.getElementById('player-age').value.trim();

    // Sprawdź, czy dane zostały wprowadzone
    if (playerName === '' || playerAge === '') {
        alert('Proszę podać swoje imię i wiek.');
        return;
    }

    // Walidacja wieku
    if (isNaN(playerAge) || playerAge <= 0) {
        alert('Proszę podać poprawny wiek.');
        return;
    }

    // Ukryj ekran powitalny i pokaż kontener gry
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    // Wyświetl powitanie
    alert(`Witaj, ${playerName}! Powodzenia w grze!`);

    // Ustaw początkowy poziom
    currentLevel = 3;

    // Zainicjuj grę
    init();
}

// Podłączenie funkcji do przycisków
document.getElementById('start-game-button').addEventListener('click', startGame);
document.getElementById('retry-button').addEventListener('click', retryLevel);
