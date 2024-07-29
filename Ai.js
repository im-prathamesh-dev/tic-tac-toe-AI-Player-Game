let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let currentPlayer = "X"; // Start with player X

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.innerText === "" && !isGameOver()) {
      box.innerText = currentPlayer;
      box.disabled = true;

      if (checkWinner()) {
        showWinner(currentPlayer);
      } else if (isGameOver()) {
        showWinner("It's a Tie!");
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch turns
        if (currentPlayer === "O") { // Check if it's AI's turn
          setTimeout(makeAIMove, 100); // Add a small delay for better UX
        }
      }
    }
  });
});

function makeAIMove() {
  // 1. Prioritize winning moves for the AI:
  let bestMove = findBestMove("O"); // AI plays as "O"
  if (bestMove !== -1) {
    boxes[bestMove].click(); // Simulate AI's click
    return;
  }

  // 2. Block potential winning moves for the player:
  bestMove = findBestMove("X"); // Block player's potential win
  if (bestMove !== -1) {
    boxes[bestMove].click(); // Simulate AI's click
    return;
  }

  // 3. Choose an empty random box:
  const emptyBoxes = [];
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].innerText === "") {
      emptyBoxes.push(i);
    }
  }
  if (emptyBoxes.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
    boxes[emptyBoxes[randomIndex]].click(); // Simulate AI's click
  }
}

function findBestMove(player) {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    const boxA = boxes[a].innerText;
    const boxB = boxes[b].innerText;
    const boxC = boxes[c].innerText;

    if (boxA === player && boxB === player && boxC === "") return c;
    if (boxA === player && boxB === "" && boxC === player) return b;
    if (boxA === "" && boxB === player && boxC === player) return a;
  }
  return -1;
}

function checkWinner() {
  for (let pattern of winPatterns) {
    let [pos1, pos2, pos3] = pattern;
    let pos1Val = boxes[pos1].innerText;
    let pos2Val = boxes[pos2].innerText;
    let pos3Val = boxes[pos3].innerText;

    if (pos1Val !== "" && pos1Val === pos2Val && pos2Val === pos3Val) {
      return true;
    }
  }
  return false;
}

function isGameOver() {
  return Array.from(boxes).every(box => box.innerText !== "");
}

function showWinner(winner) {
    if (winner === "X") {
      msg.innerText = `Congratulations, You Win!`;
    } else if (winner === "O") {
      msg.innerText = `AI Wins! Better luck next time!`;
    } else {
      msg.innerText = "It's a Tie!";
    }
    msgContainer.classList.remove("hide");
    disableAllBoxes();
  }

function disableAllBoxes() {
  boxes.forEach(box => box.disabled = true);
}

function resetGame() {
  currentPlayer = "X";
  boxes.forEach(box => {
    box.innerText = "";
    box.disabled = false;
  });
  msgContainer.classList.add("hide");
}

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);