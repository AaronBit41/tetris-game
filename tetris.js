const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

// Define game constants
const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;
const FPS = 5;  // Set to 5 for a slower game
const COLORS = ['#00FFFF', '#FF5733', '#FFD700', '#32CD32', '#FF6347', '#8A2BE2', '#FF1493'];

let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
let currentPiece = null;
let score = 0;

const pieces = [
  [[1, 1, 1, 1]], // I

];

// Get the background music and sound effect elements
const bgMusic = document.getElementById('bg-music');
const dropSound = document.getElementById('drop-sound');

dropSound.playbackRate = 3.0;

// Start playing background music when the page loads
bgMusic.play();

// Draw the game board
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      if (board[r][c]) {
        ctx.fillStyle = board[r][c];
        ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

// Draw the current piece
function drawPiece() {
  const shape = currentPiece.shape;
  const color = currentPiece.color;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        ctx.fillStyle = color;
        ctx.fillRect((currentPiece.x + c) * BLOCK_SIZE, (currentPiece.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

// Create a new random piece
function createPiece() {
  const randomIndex = Math.floor(Math.random() * pieces.length);
  const shape = pieces[randomIndex];
  const color = COLORS[randomIndex];
  return { shape, color, x: 3, y: 0 };
}

// Check if the piece can move to the new position
function isValidMove(piece) {
  const shape = piece.shape;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const x = piece.x + c;
        const y = piece.y + r;
        if (x < 0 || x >= COLUMNS || y >= ROWS || (y >= 0 && board[y][x])) {
          return false;
        }
      }
    }
  }
  return true;
}

// Place the piece on the board
function placePiece() {
  const shape = currentPiece.shape;
  const color = currentPiece.color;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        board[currentPiece.y + r][currentPiece.x + c] = color;
      }
    }
  }
  checkLines(); // Call checkLines after placing a piece
  currentPiece = createPiece();
  if (!isValidMove(currentPiece)) {
    resetGame();
  }
}

// Check if any lines are full and clear them
function checkLines() {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(cell => cell)) { // Check if the line is full
      board.splice(r, 1); // Remove the full line
      board.unshift(Array(COLUMNS).fill(null)); // Add a new empty line at the top
      score += 100; // Increase the score
      document.getElementById('score').textContent = score; // Update score display
    }
  }
}

// Move the piece left or right
function movePiece(direction) {
  const newPiece = { ...currentPiece, x: currentPiece.x + direction };
  if (isValidMove(newPiece)) {
    currentPiece = newPiece;
  }
}

// Rotate the piece
function rotatePiece() {
  const newShape = currentPiece.shape[0].map((_, index) => currentPiece.shape.map(row => row[index])).reverse();
  const newPiece = { ...currentPiece, shape: newShape };
  if (isValidMove(newPiece)) {
    currentPiece = newPiece;
  }
}

// Drop the piece down by one row
function dropPiece() {
  const newPiece = { ...currentPiece, y: currentPiece.y + 1 };
  if (isValidMove(newPiece)) {
    currentPiece = newPiece;
  } else {
    placePiece();
    dropSound.play(); // Play drop sound when the piece hits the bottom
  }
}

// Drop the piece directly to the bottom
function dropPieceDirectly() {
  let newPiece = { ...currentPiece };
  while (isValidMove(newPiece)) {
    newPiece = { ...newPiece, y: newPiece.y + 1 };
  }
  currentPiece = { ...newPiece, y: newPiece.y - 1 }; // Move back one step to place the piece
  placePiece();
  dropSound.play(); // Play drop sound when the piece hits the bottom
}

// Reset the game to its initial state
function resetGame() {
  board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
  score = 0;
  document.getElementById('score').textContent = score;
  currentPiece = createPiece();
}

// Draw the shadow piece (slightly below the current piece)
function drawShadow() {
    const shadowPiece = { ...currentPiece, y: getShadowY() }; // Create a shadow piece
    const shape = shadowPiece.shape;
    const shadowColor = '#555'; // Shadow color (darker)
    
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          ctx.fillStyle = shadowColor;
          ctx.fillRect((shadowPiece.x + c) * BLOCK_SIZE, (shadowPiece.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    }
  }
  
  // Get the Y position of the shadow (where the piece will land)
  function getShadowY() {
    let shadowY = currentPiece.y;
    
    // Move the piece down until it collides with the board or the bottom
    while (isValidMove({ ...currentPiece, y: shadowY + 1 })) {
      shadowY++;
    }
    
    return shadowY;
  }
  
  // Modify the game loop to include shadow drawing
  function gameLoop() {
    drawBoard();
    drawShadow();  // Draw the shadow first
    drawPiece();   // Then draw the actual piece
    dropPiece();
  }
  

// Event listeners for user input
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    movePiece(-1);
  } else if (event.key === 'ArrowRight') {
    movePiece(1);
  } else if (event.key === 'ArrowDown') {
    dropPiece();
  } else if (event.key === 'ArrowUp') {
    rotatePiece();
  } else if (event.key === ' ') {
    dropPieceDirectly(); // Space key to drop the piece directly
  }
});

// Start the game
currentPiece = createPiece();
setInterval(gameLoop, 1000 / FPS);
