let currentPlayer = 'X';
        let cells = document.querySelectorAll('.cell');
        let gameActive = false;
        let gameState = ['', '', '', '', '', '', '', '', ''];
        let countdown = 3;
        let filledCells = 0;
        let gameMode = 'multi'; 
        let rematchCountdown = 10;
        let rematchTimerInterval;
        const winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        function chooseGameMode(mode) {
            gameMode = mode;
            document.getElementById('gameMode').style.display = 'none';
            document.getElementById('timer').style.display = 'block';
            countdown = 3;
            document.getElementById('countdown').innerText = countdown;
            timer = setInterval(updateTimer, 1000);
        }

        function startGame() {
            gameActive = true;
            document.getElementById('timer').style.display = 'none';
            document.getElementById('board').style.display = 'grid';
            document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
        }

        function updateTimer() {
            countdown--;
            document.getElementById('countdown').innerText = countdown;
            if (countdown === 0) {
                clearInterval(timer);
                startGame();
            }
        }

        function checkWinner() {
            for (let condition of winningConditions) {
                const [a, b, c] = condition;
                if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                    return gameState[a];
                }
            }
            return null;
        }

        function handleClick(cellIndex) {
            if (!gameActive || gameState[cellIndex] !== '') return;

            gameState[cellIndex] = currentPlayer;
            cells[cellIndex].classList.add(currentPlayer.toLowerCase());

            filledCells++;
            let winner = checkWinner();
            if (winner) {
                document.getElementById('status').innerText = `${winner} wins!`;
                gameActive = false;
                showEndOptions();
            } else if (filledCells === 9) {
                document.getElementById('status').innerText = "It's a tie!";
                gameActive = false;
                showEndOptions();
            } else {
                if (gameMode === 'single') {
                    currentPlayer = 'O';
                    document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
                    makeAIMove();
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
                }
            }
        }

        function makeAIMove() {
            let bestScore = -Infinity;
            let bestMove;
            for (let i = 0; i < gameState.length; i++) {
                if (gameState[i] === '') {
                    gameState[i] = 'O';
                    let score = minimax(gameState, 0, false);
                    gameState[i] = '';
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }
            gameState[bestMove] = 'O';
            cells[bestMove].classList.add('o');
            filledCells++;
            let winner = checkWinner();
            if (winner) {
                document.getElementById('status').innerText = `${winner} wins!`;
                gameActive = false;
                showEndOptions();
            } else if (filledCells === 9) {
                document.getElementById('status').innerText = "It's a tie!";
                gameActive = false;
                showEndOptions();
            } else {
                currentPlayer = 'X';
                document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
            }
        }

        function minimax(newGameState, depth, isMaximizing) {
            let scores = {
                'O': 1,
                'X': -1,
                'tie': 0
            };

            let result = checkWinner();
            if (result !== null) {
                return scores[result];
            }

            if (isMaximizing) {
                let bestScore = -Infinity;
                for (let i = 0; i < newGameState.length; i++) {
                    if (newGameState[i] === '') {
                        newGameState[i] = 'O';
                        let score = minimax(newGameState, depth + 1, false);
                        newGameState[i] = '';
                        bestScore = Math.max(score, bestScore);
                    }
                }
                return bestScore;
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < newGameState.length; i++) {
                    if (newGameState[i] === '') {
                        newGameState[i] = 'X';
                        let score = minimax(newGameState, depth + 1, true);
                        newGameState[i] = '';
                        bestScore = Math.min(score, bestScore);
                    }
                }
                return bestScore;
            }
        }

        function restartGame() {
            currentPlayer = 'X';
            gameActive = true;
            gameState = ['', '', '', '', '', '', '', '', ''];
            filledCells = 0;
            cells.forEach(cell => {
                cell.classList.remove('x', 'o');
            });
            document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
            document.getElementById('options').style.display = 'none';
            if (gameMode === 'single' && currentPlayer === 'O') {
                makeAIMove();
            }
        }

        function switchGameMode() {
            gameMode = gameMode === 'single' ? 'multi' : 'single';
            restartGame();
        }

        function showEndOptions() {
            document.getElementById('options').style.display = 'block';
            if (gameMode === 'single') {
                document.getElementById('switchModeBtn').innerText = 'Multiplayer';
            } else {
                document.getElementById('switchModeBtn').innerText = 'Single Player';
            }
            startRematchTimer();
        }

        function startRematchTimer() {
            rematchCountdown = 10;
            document.getElementById('rematchBtn').innerText = `Rematch (${rematchCountdown})`;
            rematchTimerInterval = setInterval(updateRematchTimer, 1000);
        }

        function updateRematchTimer() {
            rematchCountdown--;
            if (rematchCountdown > 0) {
                document.getElementById('rematchBtn').innerText = `Rematch (${rematchCountdown})`;
            } else {
                clearInterval(rematchTimerInterval);
                document.getElementById('rematchBtn').innerText = 'Exit';
                document.getElementById('rematchBtn').onclick = () => window.location.reload();
            }
        }
        
    