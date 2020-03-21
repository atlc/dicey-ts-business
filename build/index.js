var Die = /** @class */ (function () {
    function Die() {
        this.value = this.roll();
        this.id = this.createID();
        this.generate();
        this.attachEventListeners();
        Die.diceList.push(this);
    }
    /* Instantiated methods */
    /* ==================== */
    Die.prototype.attachEventListeners = function () {
        var _this = this;
        this.div.addEventListener('click', function () { return _this.singleReRoll(); });
        this.div.addEventListener('dblclick', function () { return _this.singleRemove(); });
    };
    /*  This is nonfunctional and is only an attribute attached to the div,
        and is unneccessary for the scope of this project,
        but is a nice feature to start implementing as projects get more complex
    */
    Die.prototype.createID = function () {
        // Returns ID string from random seed & timestamp converted to base 36
        return Math.random().toString(36).substr(2, 16) + "_" + Date.now().toString(36);
    };
    Die.prototype.generate = function () {
        this.div = document.createElement('div');
        this.div.id = this.id;
        this.div.className = 'column';
        this.figure = document.createElement('figure');
        this.figure.className = 'image is-128x128';
        this.img = document.createElement('img');
        this.updateImagePath();
        this.figure.appendChild(this.img);
        this.div.appendChild(this.figure);
        document.querySelector('#diceContainer').appendChild(this.div);
    };
    Die.prototype.roll = function () {
        return Math.floor((Math.random() * Die.maxDieValue) + 1);
    };
    Die.prototype.singleRemove = function () {
        document.querySelector('#diceContainer').removeChild(this.div);
        var index = Die.diceList.indexOf(this);
        Die.diceList.splice(index, 1);
    };
    Die.prototype.singleReRoll = function () {
        this.value = this.roll();
        this.updateImagePath();
    };
    Die.prototype.updateImagePath = function () {
        this.imageSource = Die.isD20Mode ? "d20-" + this.value + ".png" : "dice0" + this.value + ".png";
        this.img.src = "../assets/images/" + this.imageSource;
    };
    /* Static class methods */
    /* ==================== */
    Die.multiRemove = function () {
        for (var i = Die.diceList.length - 1; i >= 0; i--) {
            Die.diceList[i].singleRemove();
        }
    };
    Die.multiReRoll = function () {
        for (var i = Die.diceList.length - 1; i >= 0; i--) {
            Die.diceList[i].singleReRoll();
        }
    };
    Die.promptForDeletion = function () {
        Swal.fire({
            title: 'Are you sure you want to delete your dice?',
            text: "You won't ever be able to get them back!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete them!',
            backdrop: "\n                rgba(123,0,0,0.4)\n                url(\"../assets/images/nyan-cat.gif\")\n                left top\n                no-repeat\n            "
        }).then(function (result) {
            if (result.value) {
                Die.multiRemove();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your dice have been deleted.',
                    icon: 'success',
                    backdrop: "\n                        rgba(0,0,123,0.4)\n                        url(\"../assets/images/nyan-cat.gif\")\n                        left top\n                        no-repeat\n                    "
                });
            }
        });
    };
    Die.sumFaces = function () {
        var sum = Die.diceList.reduce(function (total, die) { return (total += die.value); }, 0);
        Swal.fire("Dice face value totals are: " + sum);
    };
    Die.watchForDiceModeChange = function (e) {
        if (Die.d20KeypressSeries.indexOf(e.key) < 0 || e.key !== Die.d20KeypressSeries[Die.successfulKeypressCount]) {
            return Die.successfulKeypressCount = 0;
        }
        Die.successfulKeypressCount++;
        if (Die.successfulKeypressCount === Die.d20KeypressSeries.length) {
            Die.successfulKeypressCount = 0;
            Die.isD20Mode = !Die.isD20Mode;
            Die.maxDieValue = Die.isD20Mode ? 20 : 6;
            Die.multiReRoll();
            Swal.fire("d20 mode " + (Die.isD20Mode ? 'activated!' : 'deactivated!'), 'This took a while to code & to source and create the images; how about you tossing a coin to support your local witchers?', "" + (Die.isD20Mode ? 'success' : 'error'));
        }
    };
    /* Static class properties */
    /* ======================= */
    Die.d20KeypressSeries = ['d', '2', '0'];
    Die.diceList = [];
    Die.isD20Mode = false;
    Die.maxDieValue = 6; // Initializing as a standard die roll, until d20 mode is activated
    Die.successfulKeypressCount = 0;
    return Die;
}());
document.getElementById('genDie').addEventListener('click', function () { return new Die(); });
document.getElementById('reroll').addEventListener('click', Die.multiReRoll);
document.getElementById('removeAll').addEventListener('click', Die.promptForDeletion);
document.getElementById('sumTheDice').addEventListener('click', Die.sumFaces);
document.addEventListener('keydown', Die.watchForDiceModeChange);
