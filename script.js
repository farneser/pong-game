const gameSettings = {
    gameActive: false,
    player1X: 0,
    player1Y: 0,
    player2X: 0,
    player2Y: 0,
    ballX: 0,
    ballY: 0,
    ballRadius: 10,
    ballSpeedX: 0,
    ballSpeedY: 0,
    player1SpeedY: 0,
    player2SpeedY: 0,
    isBotMode: false,
    player1Score: 0,
    player2Score: 0,
    playerSize: {
        width: 150,
        height: 10,
    },
    playersSpeed: 7,
};

function getRandomAngle() {
    const randomValue = Math.random() > 0.5 ? 1 : 0;

    const minAngle = -Math.PI / 4;
    const maxAngle = Math.PI / 4;
    let randomAngle = minAngle + Math.random() * (maxAngle - minAngle);

    if (randomValue === 1) {
        randomAngle = Math.PI - randomAngle;
    }

    return randomAngle;
}

function getRandomSpeed() {
    // if (Math.random() > 0.5) {
    //     return (5 + Math.random() * 3) * 2;
    // }

    return 5 + Math.random() * 3;
}

function resetGame(settings) {
    gameSettings.player1Y = canvas.height / 2;
    gameSettings.player2Y = canvas.height / 2;

    const angle = getRandomAngle();
    const speed = getRandomSpeed();

    gameSettings.ballX = canvas.width / 2;
    gameSettings.ballY = canvas.height / 2;
    gameSettings.ballRadius = 10;
    gameSettings.ballSpeedX = Math.cos(angle) * speed;
    gameSettings.ballSpeedY = Math.sin(angle) * speed;

    gameSettings.player1SpeedY = 0;
    gameSettings.player2SpeedY = 0;

    if (settings != null) {
        gameSettings.isBotMode =
            settings.isBotMode === null ? false : settings.isBotMode;
        gameSettings.player1Score =
            settings.player1Score === null ? 0 : settings.player1Score;
        gameSettings.player2Score =
            settings.player2Score === null ? 0 : settings.player2Score;
    } else {
        gameSettings.isBotMode = false;
        gameSettings.player1Score = 0;
        gameSettings.player2Score = 0;
    }

    gameSettings.player1X = 0;
    gameSettings.player2X = canvas.width - 10;
}

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const canvas = document.getElementById("canvas");
const gameOverPopup = document.getElementById("gameOverPopup");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 0.2 * window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const ctx = canvas.getContext("2d");
const playWithFriendButton = document.getElementById("playWithFriendButton");
const playWithBotButton = document.getElementById("playWithBotButton");
const backToMenuButton = document.getElementById("backToMenuButton");
document.addEventListener("keydown", (event) => {
    if (!gameSettings.gameActive) return;

    if (event.key === "w") {
        gameSettings.player1SpeedY = -gameSettings.playersSpeed;
    } else if (event.key === "s") {
        gameSettings.player1SpeedY = gameSettings.playersSpeed;
    }

    if (gameSettings.isBotMode) {
    } else {
        if (event.key === "ArrowUp") {
            gameSettings.player2SpeedY = -gameSettings.playersSpeed;
        } else if (event.key === "ArrowDown") {
            gameSettings.player2SpeedY = gameSettings.playersSpeed;
        }
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "w" || event.key === "s") {
        gameSettings.player1SpeedY = 0;
    }

    if (gameSettings.isBotMode) {
    } else {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            gameSettings.player2SpeedY = 0;
        }
    }
});

function update() {
    if (!gameSettings.gameActive) return;

    gameSettings.player1Y += gameSettings.player1SpeedY;
    gameSettings.player2Y += gameSettings.player2SpeedY;

    gameSettings.player1Y = Math.max(gameSettings.player1Y, 0);
    gameSettings.player1Y = Math.min(
        gameSettings.player1Y,
        canvas.height - gameSettings.playerSize.width
    );
    gameSettings.player2Y = Math.max(gameSettings.player2Y, 0);
    gameSettings.player2Y = Math.min(
        gameSettings.player2Y,
        canvas.height - gameSettings.playerSize.width
    );

    gameSettings.ballX += gameSettings.ballSpeedX;
    gameSettings.ballY += gameSettings.ballSpeedY;

    if (
        gameSettings.ballX + gameSettings.ballRadius > canvas.width ||
        gameSettings.ballX - gameSettings.ballRadius < 0
    ) {
        gameSettings.ballSpeedX = -gameSettings.ballSpeedX;
    }
    if (
        gameSettings.ballY + gameSettings.ballRadius > canvas.height ||
        gameSettings.ballY - gameSettings.ballRadius < 0
    ) {
        gameSettings.ballSpeedY = -gameSettings.ballSpeedY;
    }

    const speed = getRandomSpeed();

    // Обработка столкновения с игроками
    if (
        gameSettings.ballX - gameSettings.ballRadius < gameSettings.player1X + gameSettings.playerSize.height &&
        gameSettings.ballY + gameSettings.ballRadius > gameSettings.player1Y &&
        gameSettings.ballY - gameSettings.ballRadius < gameSettings.player1Y + gameSettings.playerSize.width
    ) {
        // Рассчитываем угол отскока мяча от ракетки игрока 1
        const deltaY = gameSettings.ballY - (gameSettings.player1Y + gameSettings.playerSize.width / 2);
        const normalizedDeltaY = deltaY / (gameSettings.playerSize.width / 2); // Нормализуем в диапазоне [-1, 1]
        const bounceAngle = normalizedDeltaY * (Math.PI / 4); // Максимальный угол отскока

        // Меняем направление мяча и скорость на основе угла отскока
        gameSettings.ballSpeedX = Math.abs(gameSettings.ballSpeedX); // Положительная горизонтальная скорость
        gameSettings.ballSpeedY = Math.sin(bounceAngle) * speed; // Вертикальная скорость на основе угла
    }

    if (
        gameSettings.ballX + gameSettings.ballRadius > gameSettings.player2X &&
        gameSettings.ballY + gameSettings.ballRadius > gameSettings.player2Y &&
        gameSettings.ballY - gameSettings.ballRadius < gameSettings.player2Y + gameSettings.playerSize.width
    ) {
        // Рассчитываем угол отскока мяча от ракетки игрока 2
        const deltaY = gameSettings.ballY - (gameSettings.player2Y + gameSettings.playerSize.width / 2);
        const normalizedDeltaY = deltaY / (gameSettings.playerSize.width / 2);
        const bounceAngle = normalizedDeltaY * (Math.PI / 4);

        // Меняем направление мяча и скорость на основе угла отскока
        gameSettings.ballSpeedX = -Math.abs(gameSettings.ballSpeedX); // Отрицательная горизонтальная скорость
        gameSettings.ballSpeedY = Math.sin(bounceAngle) * speed;
    }


    if (gameSettings.ballX - gameSettings.ballRadius < 0) {
        gameSettings.player2Score++;
        resetGame(gameSettings);
    } else if (gameSettings.ballX + gameSettings.ballRadius > canvas.width) {
        gameSettings.player1Score++;
        resetGame(gameSettings);
    }

    if (gameSettings.isBotMode) {
        const botSpeed = gameSettings.playersSpeed;

        if (gameSettings.ballY < gameSettings.player2Y + 50) {
            gameSettings.player2Y -= botSpeed;
        } else if (gameSettings.ballY > gameSettings.player2Y + 50) {
            gameSettings.player2Y += botSpeed;
        }
    }

    if (gameSettings.player1Score >= 10 || gameSettings.player2Score >= 10) {
        gameSettings.gameActive = false;
        showGameOverMessage();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(
        gameSettings.ballX,
        gameSettings.ballY,
        gameSettings.ballRadius,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "red";
    ctx.fillRect(
        gameSettings.player1X,
        gameSettings.player1Y,
        gameSettings.playerSize.height,
        gameSettings.playerSize.width
    );
    ctx.fillStyle = "blue";

    ctx.fillRect(
        gameSettings.player2X,
        gameSettings.player2Y,
        gameSettings.playerSize.height,
        gameSettings.playerSize.width
    );
    // console.log(performance.now())
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("First player: " + gameSettings.player1Score, 20, 40);
    ctx.fillText(
        "Second player: " + gameSettings.player2Score,
        canvas.width - 210,
        40
    );
}

function gameLoop() {
    update();
    draw();
    if (gameSettings.gameActive) {
        const fps = 144;

        setTimeout(function () {
            requestAnimationFrame(gameLoop);

        }, 1000 / fps);
    }
}

const player1Instructions = document.getElementById('player1Instructions');
const player2Instructions = document.getElementById('player2Instructions');

playWithFriendButton.addEventListener("click", () => {
    resetGame();
    menu.style.display = "none";
    game.style.display = "flex";
    canvas.style.display = "block";
    gameSettings.gameActive = true;
    gameSettings.isBotMode = false;
    player1Instructions.style.display = "block";
    player2Instructions.style.display = "block";
    gameLoop();
});

playWithBotButton.addEventListener("click", () => {
    resetGame();
    menu.style.display = "none";
    game.style.display = "flex";
    canvas.style.display = "block";
    gameSettings.gameActive = true;
    gameSettings.isBotMode = true;
    player1Instructions.style.display = "block";
    player2Instructions.style.display = "none";
    gameLoop();
});

backToMenuButton.addEventListener("click", () => {
    gameSettings.gameActive = false;
    gameOverPopup.style.display = "none";
    game.style.display = "none";
    canvas.style.display = "none";
    menu.style.display = "flex";
    player1Instructions.style.display = "none";
    player2Instructions.style.display = "none";
});

function showGameOverMessage() {
    const winner =
        gameSettings.player1Score >= 10 ? "First player" : "Second player";

    const gameOverText = document.getElementById("gameOverText");
    const player1ScoreText = document.getElementById("player1Score");
    const player2ScoreText = document.getElementById("player2Score");
    const restartButton = document.getElementById("restartButton");
    gameSettings.gameActive = false;
    gameOverText.textContent = `${winner} won!`;
    player1ScoreText.textContent = gameSettings.player1Score;
    player2ScoreText.textContent = gameSettings.player2Score;

    gameOverPopup.style.display = "block";

    restartButton.addEventListener("click", () => {
        gameOverPopup.style.display = "none";

        resetGame();
        gameSettings.gameActive = true;
        gameSettings.isBotMode = false;
        gameLoop();
    });
}
