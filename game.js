
        // Game State Variables
        let clicks = 0;
        let clickPower = 1; // How many clicks per manual click
        let autoClickerLevel = 0;
        let superClickerLevel = 0;

        // Upgrade Costs
        const baseAutoClickerCost = 10;
        const autoClickerCostMultiplier = 1.2; // Each new auto-clicker costs 20% more
        const baseSuperClickerCost = 100;
        const superClickerCostMultiplier = 1.5; // Each new super-clicker costs 50% more

        // DOM Elements
        const clicksDisplay = document.getElementById('clicksDisplay');
        const clickButton = document.getElementById('clickButton');
        const autoClickerCostDisplay = document.getElementById('autoClickerCostDisplay');
        const autoClickerLevelDisplay = document.getElementById('autoClickerLevelDisplay');
        const buyAutoClickerButton = document.getElementById('buyAutoClickerButton');
        const superClickerCostDisplay = document.getElementById('superClickerCostDisplay');
        const superClickerLevelDisplay = document.getElementById('superClickerLevelDisplay');
        const buySuperClickerButton = document.getElementById('buySuperClickerButton');
        const cpsDisplay = document.getElementById('cpsDisplay');
        const clickPowerDisplay = document.getElementById('clickPowerDisplay');

        // Message Box Elements
        const messageBox = document.getElementById('messageBox');
        const messageText = document.getElementById('messageText');
        const closeMessageBox = document.getElementById('closeMessageBox');

        /**
         * Shows a custom message box with the given text.
         * @param {string} message - The message to display.
         */
        function showMessage(message) {
            messageText.textContent = message;
            messageBox.classList.remove('hidden');
        }

        /**
         * Hides the custom message box.
         */
        function hideMessageBox() {
            messageBox.classList.add('hidden');
        }

        /**
         * Updates the display of all game statistics and upgrade information.
         */
        function updateUI() {
            clicksDisplay.textContent = Math.floor(clicks);
            autoClickerCostDisplay.textContent = Math.floor(baseAutoClickerCost * Math.pow(autoClickerCostMultiplier, autoClickerLevel));
            autoClickerLevelDisplay.textContent = autoClickerLevel;
            superClickerCostDisplay.textContent = Math.floor(baseSuperClickerCost * Math.pow(superClickerCostMultiplier, superClickerLevel));
            superClickerLevelDisplay.textContent = superClickerLevel;
            cpsDisplay.textContent = autoClickerLevel; // Each auto-clicker gives 1 CPS
            clickPowerDisplay.textContent = clickPower;

            // Disable buy buttons if not enough clicks
            buyAutoClickerButton.disabled = clicks < Math.floor(baseAutoClickerCost * Math.pow(autoClickerCostMultiplier, autoClickerLevel));
            buySuperClickerButton.disabled = clicks < Math.floor(baseSuperClickerCost * Math.pow(superClickerCostMultiplier, superClickerLevel));
        }

        /**
         * Handles a manual click event, adding clicks based on clickPower.
         */
        function handleManualClick() {
            clicks += clickPower;
            updateUI();
            saveGame(); // Save game after each click
        }

        /**
         * Buys an Auto-Clicker upgrade.
         */
        function buyAutoClicker() {
            const cost = Math.floor(baseAutoClickerCost * Math.pow(autoClickerCostMultiplier, autoClickerLevel));
            if (clicks >= cost) {
                clicks -= cost;
                autoClickerLevel++;
                updateUI();
                saveGame();
            } else {
                showMessage("Not enough clicks to buy Auto-Clicker!");
            }
        }

        /**
         * Buys a Super Clicker upgrade.
         */
        function buySuperClicker() {
            const cost = Math.floor(baseSuperClickerCost * Math.pow(superClickerCostMultiplier, superClickerLevel));
            if (clicks >= cost) {
                clicks -= cost;
                superClickerLevel++;
                clickPower++; // Increase click power
                updateUI();
                saveGame();
            } else {
                showMessage("Not enough clicks to buy Super Clicker!");
            }
        }

        /**
         * Game loop: adds clicks from auto-clickers every second.
         */
        function gameLoop() {
            clicks += autoClickerLevel; // Each auto-clicker generates 1 click per second
            updateUI();
            saveGame(); // Save game periodically
        }

        /**
         * Saves the current game state to localStorage.
         */
        function saveGame() {
            const gameState = {
                clicks: clicks,
                clickPower: clickPower,
                autoClickerLevel: autoClickerLevel,
                superClickerLevel: superClickerLevel
            };
            try {
                localStorage.setItem('incrementalGameSave', JSON.stringify(gameState));
            } catch (e) {
                console.error("Failed to save game to localStorage:", e);
            }
        }

        /**
         * Loads the game state from localStorage.
         */
        function loadGame() {
            try {
                const savedState = localStorage.getItem('incrementalGameSave');
                if (savedState) {
                    const gameState = JSON.parse(savedState);
                    clicks = gameState.clicks || 0;
                    clickPower = gameState.clickPower || 1;
                    autoClickerLevel = gameState.autoClickerLevel || 0;
                    superClickerLevel = gameState.superClickerLevel || 0;
                }
            } catch (e) {
                console.error("Failed to load game from localStorage:", e);
                // Reset game state if loading fails
                clicks = 0;
                clickPower = 1;
                autoClickerLevel = 0;
                superClickerLevel = 0;
            }
            updateUI(); // Update UI after loading
        }

        // Event Listeners
        clickButton.addEventListener('click', handleManualClick);
        buyAutoClickerButton.addEventListener('click', buyAutoClicker);
        buySuperClickerButton.addEventListener('click', buySuperClicker);
        closeMessageBox.addEventListener('click', hideMessageBox);

        // Initialize game on window load
        window.onload = function() {
            loadGame(); // Load saved game
            updateUI(); // Initial UI update
            setInterval(gameLoop, 1000); // Start game loop (1000ms = 1 second)
        };

