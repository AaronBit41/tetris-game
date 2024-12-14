<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tetris Game</title>
    <style>
         body {
            font-family: Arial, sans-serif;
            background: #2b2b2b;
            color: white;
            text-align: center;
        }
        canvas {
            background-color: #000;
            margin: 0 auto;
            display: block;
        }
        .score {
            font-size: 20px;
        }
    </style>
</head>
<body>
    <h1>Tetris Game</h1>
    <p>Score: <span id="score">0</span></p>
    <canvas id="tetris" width="300" height="600"></canvas>

    <!-- Background Music -->
    <audio id="bg-music" loop>
        <source src="Tetris.mp3" type="audio/mp3">
        Your browser does not support the audio element.
    </audio>

    <!-- Sound Effect for Piece Drop -->
    <audio id="drop-sound">
        <source src="water.mp3" type="audio/mp3">
        Your browser does not support the audio element.
    </audio>

    <script src="tetris.js"></script>
</body>
</html>
