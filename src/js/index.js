window.onload = function () {
    // Simulate loading time (remove this in actual implementation)
    var totalTime = 5000; // Total loading time in milliseconds
    var incrementTime = 100; // Increment time in milliseconds
    var currentTime = 0;

    var loadingInterval = setInterval(function () {
        currentTime += incrementTime;
        var progress = (currentTime / totalTime) * 100;
        updateProgressBar(progress);

        if (currentTime >= totalTime) {
            clearInterval(loadingInterval);
            // Hide loading screen
            document.getElementById('loading-screen').style.display = 'none';
            // Show game content
            document.getElementById('game-division').style.display = 'block';
            // Initialize your game (e.g., load assets, start game loop)
            initializeGame();
        }
    }, incrementTime);
};

function updateProgressBar(progress) {
    var progressBar = document.querySelector('.progress');
    progressBar.style.width = progress + '%';
}

function initializeGame() {
    // Your game initialization code here
    console.log('Game initialized');
}
