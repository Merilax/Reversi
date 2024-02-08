const main = document.getElementsByTagName("main")[0];
const passBtn = document.getElementById("passBtn");
passBtn.addEventListener("click", () => passTurn());
const endBtn = document.getElementById("endBtn");
endBtn.addEventListener("click", () => endGame());

const currentTurnImg = document.getElementById("currentTurnImg");
const lightAmountSpan = document.getElementById("lightAmount");
const darkAmountSpan = document.getElementById("darkAmount");
var darkCount = 2;
var lightCount = 2;

const lightSrc = "media/ReversiPieceLight.png";
const darkSrc = "media/ReversiPieceDark.png";
const darkImg = document.createElement("img"); darkImg.src = darkSrc; darkImg.classList.add("piece");
const lightImg = document.createElement("img"); lightImg.src = lightSrc; lightImg.classList.add("piece");

var board = [];
var turnColor = 0; // 0 - light, 1 - dark
var turnsLeft = 0;

const boardElem = document.createElement("table");
main.append(boardElem);

document.addEventListener("DOMContentLoaded", () => prepareBoard());

function prepareBoard() {
    darkCount = 2;
    lightCount = 2;

    turnColor = 0; // 0 - light, 1 - dark
    turnsLeft = 0;
    board = [];
    while (boardElem.firstChild) boardElem.firstChild.remove();

    for (let i = 0; i < 8; i++) {
        let row = boardElem.insertRow();
        board.push([]);
        for (let j = 0; j < 8; j++) {
            let cell = row.insertCell();
            cell.id = i + "," + j;
            cell.addEventListener("click", event => place(event));

            board[i].push(null);

            turnsLeft++;
        }
    }

    board[3][3] = 1;
    board[3][4] = 0;
    board[4][3] = 0;
    board[4][4] = 1;
    boardElem.rows[3].cells[3].appendChild(darkImg.cloneNode());
    boardElem.rows[3].cells[4].appendChild(lightImg.cloneNode());
    boardElem.rows[4].cells[3].appendChild(lightImg.cloneNode());
    boardElem.rows[4].cells[4].appendChild(darkImg.cloneNode());
    turnsLeft = turnsLeft - 4;
    lightAmountSpan.textContent = lightCount;
    darkAmountSpan.textContent = darkCount;
}

function setPiece(color, x, y) {
    let cell = boardElem.rows[x].cells[y];
    board[x][y] = color;

    if (color === 0) {
        lightCount++;
        if (cell.firstElementChild) {
            console.log("x");
            cell.firstElementChild.src = lightSrc;
            darkCount--;
        }
        else cell.appendChild(lightImg.cloneNode());
    } else {
        darkCount++;
        if (cell.firstElementChild) {
            cell.firstElementChild.src = darkSrc;
            lightCount--;
        }
        else cell.appendChild(darkImg.cloneNode());
    }

    lightAmountSpan.textContent = lightCount;
    darkAmountSpan.textContent = darkCount;
}

function place(event) {
    let x = parseInt(event.target.id.slice(0, 1));
    let y = parseInt(event.target.id.slice(2));

    if (board[x][y] != null) return false;

    let valid = false;
    let placed = false;

    for (let xDirection = -1; xDirection < 2; xDirection++) {
        for (let yDirection = -1; yDirection < 2; yDirection++) {
            if (xDirection == 0 && yDirection == 0) continue;
            // Check if there's a piece around.
            try {
                if (board[x + xDirection][y + yDirection] != null) {
                    // Check if said piece is the opposite color.

                    if (board[x + xDirection][y + yDirection] !== turnColor) {
                        // Check that there is a valid direction to flip pieces.
                        let ok = validateDirection(turnColor, x, y, xDirection, yDirection, 0);
                        if (ok) {
                            valid = true;

                            if (!placed) {
                                setPiece(turnColor, x, y);
                                placed = true;
                            }

                            flipDirection(turnColor, x, y, xDirection, yDirection);
                        }

                    }
                }
            } catch (error) { }
        }
    }

    if (!valid) return;
    passTurn();

    turnsLeft--;
    if (turnsLeft === 0) endGame();
}

function validateDirection(color, x, y, xDirection, yDirection, steps) {

    let target = board[x + xDirection][y + yDirection];

    if (target == null) return false;
    if (target === color) {
        if (steps > 0) return true;
        else return false;
    }

    steps++;
    return validateDirection(color, x + xDirection, y + yDirection, xDirection, yDirection, steps);
}

function flipDirection(color, x, y, xDirection, yDirection) {
    let target = board[x + xDirection][y + yDirection];

    if (target == null) return false;
    if (target === color) return false;

    if (color === 1) setPiece(1, x + xDirection, y + yDirection);
    else setPiece(0, x + xDirection, y + yDirection);

    return flipDirection(color, x + xDirection, y + yDirection, xDirection, yDirection);
}

function passTurn() {
    if (turnColor === 0) {
        turnColor = 1;
        currentTurnImg.src = darkSrc;
    }
    else {
        turnColor = 0;
        currentTurnImg.src = lightSrc;
    }
}

function endGame() {
    let lights = 0;
    let darks = 0;

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (board[x][y] === 0) lights++;
            else if (board[x][y] === 1) darks++;
        }
    }

    let str = `
    Light: ${lights}
    Dark: ${darks}
    `;
    if (lights > darks) {
        str += "Light wins!";
    } else if (darks > lights) {
        str += "Dark wins!";
    } else {
        str += "Draw! What a match!";
    }

    alert(str);
    prepareBoard();
}