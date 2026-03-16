// Chess Game Engine
const PIECE_UNICODE = {
    'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
    'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
};

const PIECE_VALUES = {
    'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 0,
    'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
};

let gameState = {
    board: [],
    currentPlayer: 'white',
    selectedSquare: null,
    validMoves: [],
    moveHistory: [],
    lastMove: null,
    whiteCastling: { kingside: true, queenside: true },
    blackCastling: { kingside: true, queenside: true },
    enPassantTarget: null
};

function initializeGame() {
    gameState.board = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
    gameState.currentPlayer = 'white';
    gameState.selectedSquare = null;
    gameState.validMoves = [];
    gameState.moveHistory = [];
    gameState.lastMove = null;
    gameState.whiteCastling = { kingside: true, queenside: true };
    gameState.blackCastling = { kingside: true, queenside: true };
    gameState.enPassantTarget = null;
    renderBoard();
    updateGameStatus();
}

function renderBoard() {
    const board = document.getElementById('chessboard');
    board.innerHTML = '';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.className += (row + col) % 2 === 0 ? ' light' : ' dark';

            if (gameState.lastMove && 
                ((gameState.lastMove.from[0] === row && gameState.lastMove.from[1] === col) ||
                 (gameState.lastMove.to[0] === row && gameState.lastMove.to[1] === col))) {
                square.className += ' last-move';
            }

            if (gameState.selectedSquare && gameState.selectedSquare[0] === row && gameState.selectedSquare[1] === col) {
                square.className += ' selected';
            }

            if (gameState.validMoves.some(move => move[0] === row && move[1] === col)) {
                square.className += ' valid-move';
            }

            const piece = gameState.board[row][col];
            if (piece) {
                square.textContent = PIECE_UNICODE[piece];
            }

            square.addEventListener('click', () => handleSquareClick(row, col));
            board.appendChild(square);
        }
    }
}

function getValidMoves(row, col) {
    const piece = gameState.board[row][col];
    if (!piece) return [];

    const isWhite = piece === piece.toUpperCase();
    if (isWhite && gameState.currentPlayer !== 'white') return [];
    if (!isWhite && gameState.currentPlayer !== 'black') return [];

    const movesFunc = {
        'P': getPawnMoves, 'p': getPawnMoves,
        'N': getKnightMoves, 'n': getKnightMoves,
        'B': getBishopMoves, 'b': getBishopMoves,
        'R': getRookMoves, 'r': getRookMoves,
        'Q': getQueenMoves, 'q': getQueenMoves,
        'K': getKingMoves, 'k': getKingMoves
    };

    const moves = movesFunc[piece](row, col);
    return moves.filter(move => !isInCheck(row, col, move[0], move[1]));
}

function getPawnMoves(row, col) {
    const moves = [];
    const piece = gameState.board[row][col];
    const isWhite = piece === piece.toUpperCase();
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;

    // Forward move
    const newRow = row + direction;
    if (newRow >= 0 && newRow <= 7 && !gameState.board[newRow][col]) {
        moves.push([newRow, col]);

        // Double move from start
        if (row === startRow) {
            const doubleRow = row + 2 * direction;
            if (!gameState.board[doubleRow][col]) {
                moves.push([doubleRow, col]);
            }
        }
    }

    // Captures
    for (let newCol of [col - 1, col + 1]) {
        if (newCol >= 0 && newCol <= 7 && newRow >= 0 && newRow <= 7) {
            const target = gameState.board[newRow][newCol];
            if (target && (isWhite ? target === target.toLowerCase() : target === target.toUpperCase())) {
                moves.push([newRow, newCol]);
            }
        }
    }

    // En passant
    if (gameState.enPassantTarget && gameState.enPassantTarget[0] === newRow) {
        for (let newCol of [col - 1, col + 1]) {
            if (newCol >= 0 && newCol <= 7 && gameState.enPassantTarget[1] === newCol) {
                moves.push([newRow, newCol]);
            }
        }
    }

    return moves;
}

function getKnightMoves(row, col) {
    const moves = [];
    const piece = gameState.board[row][col];
    const isWhite = piece === piece.toUpperCase();
    const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (let [dRow, dCol] of knightMoves) {
        const newRow = row + dRow;
        const newCol = col + dCol;
        if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
            const target = gameState.board[newRow][newCol];
            if (!target || (isWhite ? target === target.toLowerCase() : target === target.toUpperCase())) {
                moves.push([newRow, newCol]);
            }
        }
    }
    return moves;
}

function getBishopMoves(row, col) {
    return getSlidingMoves(row, col, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
}

function getRookMoves(row, col) {
    return getSlidingMoves(row, col, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
}

function getQueenMoves(row, col) {
    return getSlidingMoves(row, col, [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ]);
}

function getSlidingMoves(row, col, directions) {
    const moves = [];
    const piece = gameState.board[row][col];
    const isWhite = piece === piece.toUpperCase();

    for (let [dRow, dCol] of directions) {
        let newRow = row + dRow;
        let newCol = col + dCol;

        while (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
            const target = gameState.board[newRow][newCol];
            if (!target) {
                moves.push([newRow, newCol]);
            } else {
                if (isWhite ? target === target.toLowerCase() : target === target.toUpperCase()) {
                    moves.push([newRow, newCol]);
                }
                break;
            }
            newRow += dRow;
            newCol += dCol;
        }
    }
    return moves;
}

function getKingMoves(row, col) {
    const moves = [];
    const piece = gameState.board[row][col];
    const isWhite = piece === piece.toUpperCase();

    for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dCol = -1; dCol <= 1; dCol++) {
            if (dRow === 0 && dCol === 0) continue;
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
                const target = gameState.board[newRow][newCol];
                if (!target || (isWhite ? target === target.toLowerCase() : target === target.toUpperCase())) {
                    moves.push([newRow, newCol]);
                }
            }
        }
    }

    // Castling
    if (isWhite && row === 7 && col === 4) {
        if (gameState.whiteCastling.kingside && !gameState.board[7][5] && !gameState.board[7][6] &&
            !isInCheck(7, 4, 7, 6)) {
            moves.push([7, 6]);
        }
        if (gameState.whiteCastling.queenside && !gameState.board[7][3] && !gameState.board[7][2] && !gameState.board[7][1] &&
            !isInCheck(7, 4, 7, 2)) {
            moves.push([7, 2]);
        }
    }
    if (!isWhite && row === 0 && col === 4) {
        if (gameState.blackCastling.kingside && !gameState.board[0][5] && !gameState.board[0][6] &&
            !isInCheck(0, 4, 0, 6)) {
            moves.push([0, 6]);
        }
        if (gameState.blackCastling.queenside && !gameState.board[0][3] && !gameState.board[0][2] && !gameState.board[0][1] &&
            !isInCheck(0, 4, 0, 2)) {
            moves.push([0, 2]);
        }
    }

    return moves;
}

function isInCheck(fromRow, fromCol, toRow, toCol) {
    const piece = gameState.board[fromRow][fromCol];
    const isWhite = piece === piece.toUpperCase();
    const targetPiece = gameState.board[toRow][toCol];

    // Simulate move
    gameState.board[toRow][toCol] = piece;
    gameState.board[fromRow][fromCol] = null;

    // Find king position
    let kingRow = -1, kingCol = -1;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (gameState.board[r][c] === (isWhite ? 'K' : 'k')) {
                kingRow = r;
                kingCol = c;
                break;
            }
        }
        if (kingRow !== -1) break;
    }

    // Check if king is under attack
    let inCheck = false;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const enemyPiece = gameState.board[r][c];
            if (!enemyPiece) continue;
            if ((isWhite && enemyPiece === enemyPiece.toUpperCase()) || 
                (!isWhite && enemyPiece === enemyPiece.toLowerCase())) continue;

            const attacks = getAttackSquares(r, c, enemyPiece);
            if (attacks.some(sq => sq[0] === kingRow && sq[1] === kingCol)) {
                inCheck = true;
                break;
            }
        }
        if (inCheck) break;
    }

    // Undo move
    gameState.board[fromRow][fromCol] = piece;
    gameState.board[toRow][toCol] = targetPiece;

    return inCheck;
}

function getAttackSquares(row, col, piece) {
    const squares = [];
    const type = piece.toLowerCase();

    if (type === 'p') {
        const direction = piece === 'p' ? 1 : -1;
        for (let dCol of [-1, 1]) {
            const newRow = row + direction;
            if (newRow >= 0 && newRow <= 7 && col + dCol >= 0 && col + dCol <= 7) {
                squares.push([newRow, col + dCol]);
            }
        }
    } else if (type === 'n') {
        const moves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
        for (let [dRow, dCol] of moves) {
            const newRow = row + dRow, newCol = col + dCol;
            if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
                squares.push([newRow, newCol]);
            }
        }
    } else if (type === 'b') {
        addSlidingAttacks(row, col, [[-1, -1], [-1, 1], [1, -1], [1, 1]], squares);
    } else if (type === 'r') {
        addSlidingAttacks(row, col, [[-1, 0], [1, 0], [0, -1], [0, 1]], squares);
    } else if (type === 'q') {
        addSlidingAttacks(row, col, [
            [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
        ], squares);
    } else if (type === 'k') {
        for (let dRow = -1; dRow <= 1; dRow++) {
            for (let dCol = -1; dCol <= 1; dCol++) {
                if (dRow === 0 && dCol === 0) continue;
                const newRow = row + dRow, newCol = col + dCol;
                if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
                    squares.push([newRow, newCol]);
                }
            }
        }
    }

    return squares;
}

function addSlidingAttacks(row, col, directions, squares) {
    for (let [dRow, dCol] of directions) {
        let newRow = row + dRow, newCol = col + dCol;
        while (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
            squares.push([newRow, newCol]);
            if (gameState.board[newRow][newCol]) break;
            newRow += dRow;
            newCol += dCol;
        }
    }
}

function handleSquareClick(row, col) {
    if (gameState.selectedSquare && gameState.validMoves.some(m => m[0] === row && m[1] === col)) {
        makeMove(gameState.selectedSquare[0], gameState.selectedSquare[1], row, col);
    } else {
        const piece = gameState.board[row][col];
        if (piece) {
            gameState.selectedSquare = [row, col];
            gameState.validMoves = getValidMoves(row, col);
        } else {
            gameState.selectedSquare = null;
            gameState.validMoves = [];
        }
    }
    renderBoard();
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = gameState.board[fromRow][fromCol];
    const capturedPiece = gameState.board[toRow][toCol];

    // Handle en passant
    if (piece.toLowerCase() === 'p' && toCol !== fromCol && !capturedPiece) {
        gameState.board[fromRow][toCol] = null;
    }

    // Handle castling
    if (piece.toLowerCase() === 'k' && Math.abs(toCol - fromCol) === 2) {
        if (toCol > fromCol) {
            gameState.board[fromRow][7] = null;
            gameState.board[fromRow][5] = piece === 'K' ? 'R' : 'r';
        } else {
            gameState.board[fromRow][0] = null;
            gameState.board[fromRow][3] = piece === 'K' ? 'R' : 'r';
        }
    }

    // Handle pawn promotion
    if (piece === 'P' && toRow === 0) {
        gameState.board[toRow][toCol] = 'Q';
    } else if (piece === 'p' && toRow === 7) {
        gameState.board[toRow][toCol] = 'q';
    } else {
        gameState.board[toRow][toCol] = piece;
    }

    gameState.board[fromRow][fromCol] = null;

    // Update castling rights
    if (piece === 'K') gameState.whiteCastling = { kingside: false, queenside: false };
    if (piece === 'k') gameState.blackCastling = { kingside: false, queenside: false };
    if (piece === 'R') {
        if (fromCol === 0) gameState.whiteCastling.queenside = false;
        if (fromCol === 7) gameState.whiteCastling.kingside = false;
    }
    if (piece === 'r') {
        if (fromCol === 0) gameState.blackCastling.queenside = false;
        if (fromCol === 7) gameState.blackCastling.kingside = false;
    }

    // Set en passant target
    gameState.enPassantTarget = null;
    if (piece.toLowerCase() === 'p' && Math.abs(toRow - fromRow) === 2) {
        gameState.enPassantTarget = [fromRow + (toRow - fromRow) / 2, fromCol];
    }

    gameState.lastMove = { from: [fromRow, fromCol], to: [toRow, toCol] };
    gameState.moveHistory.push({
        piece: piece,
        from: [fromRow, fromCol],
        to: [toRow, toCol],
        captured: capturedPiece
    });

    gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
    gameState.selectedSquare = null;
    gameState.validMoves = [];

    updateMoveHistory();
    renderBoard();
    updateGameStatus();
}

function updateGameStatus() {
    const isWhite = gameState.currentPlayer === 'white';
    const kingChar = isWhite ? 'K' : 'k';
    let kingRow = -1, kingCol = -1;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (gameState.board[r][c] === kingChar) {
                kingRow = r;
                kingCol = c;
                break;
            }
        }
        if (kingRow !== -1) break;
    }

    let hasValidMoves = false;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = gameState.board[r][c];
            if (p && ((isWhite && p === p.toUpperCase()) || (!isWhite && p === p.toLowerCase()))) {
                if (getValidMoves(r, c).length > 0) {
                    hasValidMoves = true;
                    break;
                }
            }
        }
        if (hasValidMoves) break;
    }

    const inCheck = isInCheck(kingRow, kingCol, kingRow, kingCol);

    document.getElementById('currentTurn').textContent = isWhite ? 'White' : 'Black';

    if (!hasValidMoves) {
        if (inCheck) {
            document.getElementById('gameStatus').textContent = `Checkmate! ${isWhite ? 'Black' : 'White'} wins!`;
        } else {
            document.getElementById('gameStatus').textContent = 'Stalemate! Draw!';
        }
    } else if (inCheck) {
        document.getElementById('gameStatus').textContent = 'Check!';
    } else {
        document.getElementById('gameStatus').textContent = 'Game In Progress';
    }
}

function updateMoveHistory() {
    const historyDiv = document.getElementById('moveHistory');
    historyDiv.innerHTML = '';
    
    for (let i = 0; i < gameState.moveHistory.length; i += 2) {
        const moveItem = document.createElement('div');
        moveItem.className = 'move-item';
        
        const whiteMove = gameState.moveHistory[i];
        let text = `${i / 2 + 1}. ${algebraicNotation(whiteMove)}`;
        
        if (i + 1 < gameState.moveHistory.length) {
            const blackMove = gameState.moveHistory[i + 1];
            text += ` ${algebraicNotation(blackMove)}`;
        }
        
        moveItem.textContent = text;
        historyDiv.appendChild(moveItem);
    }
}

function algebraicNotation(move) {
    const cols = 'abcdefgh';
    const rows = '87654321';
    const from = cols[move.from[1]] + rows[move.from[0]];
    const to = cols[move.to[1]] + rows[move.to[0]];
    let notation = move.piece.toUpperCase() === 'P' ? '' : move.piece.toUpperCase();
    notation += move.captured ? 'x' : '';
    notation += to;
    return notation || `${from}${to}`;
}

function resetGame() {
    initializeGame();
}

function undoMove() {
    if (gameState.moveHistory.length === 0) return;

    const move = gameState.moveHistory.pop();
    gameState.board[move.from[0]][move.from[1]] = move.piece;
    gameState.board[move.to[0]][move.to[1]] = move.captured;

    // Handle castling undo
    if (move.piece.toLowerCase() === 'k' && Math.abs(move.to[1] - move.from[1]) === 2) {
        if (move.to[1] > move.from[1]) {
            gameState.board[move.from[0]][7] = move.piece === 'K' ? 'R' : 'r';
            gameState.board[move.from[0]][5] = null;
        } else {
            gameState.board[move.from[0]][0] = move.piece === 'K' ? 'R' : 'r';
            gameState.board[move.from[0]][3] = null;
        }
    }

    gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
    gameState.lastMove = gameState.moveHistory.length > 0 ? 
        { from: gameState.moveHistory[gameState.moveHistory.length - 1].from, 
          to: gameState.moveHistory[gameState.moveHistory.length - 1].to } : null;
    gameState.selectedSquare = null;
    gameState.validMoves = [];

    updateMoveHistory();
    renderBoard();
    updateGameStatus();
}

// Initialize game on page load
document.addEventListener('DOMContentLoaded', initializeGame);
