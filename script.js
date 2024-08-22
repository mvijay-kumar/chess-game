document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('chessboard');
    const boardSize = 8;
    const pieceSymbols = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
    };
    
    let selectedSquare = null;
    let boardState = initializeBoard();
    let currentPlayer = 'white';

    function initializeBoard() {
        return [
            'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
            'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
            'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'
        ];
    }

    function renderBoard() {
        board.innerHTML = '';
        boardState.forEach((piece, index) => {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((Math.floor(index / boardSize) + index) % 2 === 0 ? 'white' : 'black');
            square.dataset.index = index;
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece');
                pieceElement.innerHTML = pieceSymbols[piece];
                square.appendChild(pieceElement);
            }
            board.appendChild(square);
        });
    }

    function getPieceAt(index) {
        return boardState[index];
    }

    function isMoveValid(startIndex, endIndex, piece) {
        const startRow = Math.floor(startIndex / boardSize);
        const startCol = startIndex % boardSize;
        const endRow = Math.floor(endIndex / boardSize);
        const endCol = endIndex % boardSize;
        const dx = Math.abs(endRow - startRow);
        const dy = Math.abs(endCol - startCol);

        if (endIndex < 0 || endIndex >= boardState.length) return false;
        if (startIndex === endIndex) return false;

        const endPiece = getPieceAt(endIndex);
        if (endPiece && (piece === piece.toUpperCase() && endPiece === endPiece.toUpperCase() ||
            piece === piece.toLowerCase() && endPiece === endPiece.toLowerCase())) {
            return false;
        }

        switch (piece.toLowerCase()) {
            case 'p': // Pawn
                const direction = piece === 'p' ? 1 : -1;
                if (startCol === endCol) {
                    if (dx === 1 && !endPiece) return true;
                    if (dx === 2 && !endPiece && ((startRow === 1 && piece === 'p') || (startRow === 6 && piece === 'P'))) {
                        return !getPieceAt(startIndex + direction * boardSize);
                    }
                } else if (dx === 1 && dy === 1) {
                    return endPiece && (endPiece.toUpperCase() !== endPiece);
                }
                return false;

            case 'r': // Rook
                if (dx === 0 || dy === 0) {
                    return !isPathBlocked(startIndex, endIndex);
                }
                return false;

            case 'n': // Knight
                return dx * dy === 2;

            case 'b': // Bishop
                if (dx === dy) {
                    return !isPathBlocked(startIndex, endIndex);
                }
                return false;

            case 'q': // Queen
                return (dx === 0 || dy === 0 || dx === dy) && !isPathBlocked(startIndex, endIndex);

            case 'k': // King
                return dx <= 1 && dy <= 1;

            default:
                return false;
        }
    }

    function isPathBlocked(startIndex, endIndex) {
        const startRow = Math.floor(startIndex / boardSize);
        const startCol = startIndex % boardSize;
        const endRow = Math.floor(endIndex / boardSize);
        const endCol = endIndex % boardSize;
        const dx = Math.sign(endRow - startRow);
        const dy = Math.sign(endCol - startCol);
        
        let row = startRow + dx;
        let col = startCol + dy;

        while (row !== endRow || col !== endCol) {
            const index = row * boardSize + col;
            if (getPieceAt(index)) return true;
            row += dx;
            col += dy;
        }
        return false;
    }

    function handleSquareClick(event) {
        const square = event.target.closest('.square');
        if (!square) return;
        const index = parseInt(square.dataset.index);

        if (selectedSquare === null) {
            selectedSquare = index;
            square.classList.add('selected');
        } else {
            const piece = getPieceAt(selectedSquare);
            if (piece && isMoveValid(selectedSquare, index, piece)) {
                boardState[index] = piece;
                boardState[selectedSquare] = '';
                renderBoard();
                selectedSquare = null;
                currentPlayer = (currentPlayer === 'white') ? 'black' : 'white';
            } else {
                document.querySelector('.selected')?.classList.remove('selected');
                selectedSquare = null;
            }
        }
    }

    function setupEventListeners() {
        board.addEventListener('click', handleSquareClick);
    }

    function startGame() {
        renderBoard();
        setupEventListeners();
    }

    startGame();
});
