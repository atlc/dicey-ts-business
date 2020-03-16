var Swal; // To suppress browser and TS warnings since it's pulled from the CDN
var diceLog = [];
var diceContainer = document.getElementById('diceContainer');
var dieHTMLString;
var imgPath;
var maxDiceValue = 6; // Initializing as a standard dice roll, until d20 mode is activated
var Die = /** @class */ (function () {
    function Die() {
        this.value = this.roll();
        this.id = this.createID();
    }
    // Returns 16 digit ID string off Math.random() seed converted to base 36
    Die.prototype.createID = function () {
        return Math.random().toString(36).substr(2, 16);
    };
    Die.prototype.roll = function () {
        return Math.floor((Math.random() * maxDiceValue) + 1);
    };
    return Die;
}());
function generateDie() {
    var die = new Die();
    var dieDiv = document.createElement('div');
    dieDiv.className = 'column';
    imgPath = d20mode ? "d20-" + die.value + ".png" : "dice0" + die.value + ".png";
    dieHTMLString = "<figure class='image is-128x128'><img src=\"../assets/images/" + imgPath + "\"></figure>";
    dieDiv.innerHTML = dieHTMLString;
    dieDiv.addEventListener('click', function () { return rerollSingleDie(die.id); });
    dieDiv.addEventListener('dblclick', function () { return removeSingleDie(die.id); });
    diceContainer.appendChild(dieDiv);
    diceLog.push(die);
}
var removeAllPrompt = function () {
    Swal.fire({
        title: 'Are you sure you want to delete your dice?',
        text: "You won't ever be able to get them back!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete them!',
        backdrop: "\n            rgba(123,0,0,0.4)\n            url(\"../assets/images/nyan-cat.gif\")\n            left top\n            no-repeat\n        "
    }).then(function (result) {
        if (result.value) {
            removeAll();
            Swal.fire({
                title: 'Deleted!',
                text: 'Your dice have been deleted.',
                icon: 'success',
                backdrop: "\n                    rgba(0,0,123,0.4)\n                    url(\"../assets/images/nyan-cat.gif\")\n                    left top\n                    no-repeat\n                "
            });
        }
    });
};
var removeAll = function () {
    Array.prototype.slice.call(diceContainer.children).forEach(function (child) { return child.parentNode.removeChild(child); });
    diceLog = [];
};
var reroll = function () {
    diceLog.forEach(function (die, index) {
        die.value = die.roll();
        imgPath = d20mode ? "d20-" + die.value + ".png" : "dice0" + die.value + ".png";
        dieHTMLString = "<figure class='image is-128x128'><img src=\"../assets/images/" + imgPath + "\"></figure>";
        diceContainer.children[index].innerHTML = "" + dieHTMLString;
    });
};
var rerollSingleDie = function (dieID) {
    setTimeout(function () {
        var dieIndex = diceLog.map(function (dice) { return dice.id; }).indexOf(dieID);
        if (diceLog[dieIndex]) {
            diceLog[dieIndex].value = diceLog[dieIndex].roll();
            imgPath = d20mode ? "d20-" + diceLog[dieIndex].value + ".png" : "dice0" + diceLog[dieIndex].value + ".png";
            dieHTMLString = "<figure class='image is-128x128'><img src=\"../assets/images/" + imgPath + "\"></figure>";
            diceContainer.children[dieIndex].innerHTML = dieHTMLString;
        }
    }, 175);
};
function removeSingleDie(dieID) {
    var dieIndex = diceLog.map(function (dice) { return dice.id; }).indexOf(dieID);
    diceContainer.children[dieIndex].parentNode.removeChild(diceContainer.children[dieIndex]);
    diceLog.splice(dieIndex, 1);
}
var sumTheDice = function () {
    var vals = [];
    diceLog.forEach(function (d) { return vals.push(d.value); });
    var sum = function (total, currentVal) { return total + currentVal; };
    Swal.fire("Dice face value totals are: " + vals.reduce(sum, 0));
};
document.getElementById('genDie').addEventListener('click', generateDie);
document.getElementById('reroll').addEventListener('click', reroll);
document.getElementById('removeAll').addEventListener('click', removeAllPrompt);
document.getElementById('sumTheDice').addEventListener('click', sumTheDice);
var d20mode = false;
var d20KeySeries = ['d', '2', '0'];
var keyHits = 0;
var d20listener = function (event) {
    var e = event;
    if (d20KeySeries.indexOf(e.key) < 0 || e.key !== d20KeySeries[keyHits]) {
        return keyHits = 0;
    }
    keyHits++;
    if (keyHits === d20KeySeries.length) {
        keyHits = 0;
        removeAll();
        d20mode = !d20mode;
        maxDiceValue = d20mode ? 20 : 6;
        Swal.fire("d20 mode " + (d20mode ? 'activated!' : 'deactivated!'), 'This took a while to code & to source and create the images; how about you toss a beer my way? 😉', "" + (d20mode ? 'success' : 'error'));
    }
};
document.addEventListener('keydown', d20listener);
