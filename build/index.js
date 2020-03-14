var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Swal; // To suppress browser and TS warnings since it's pulled from the CDN
var diceLog = [];
var diceContainer = document.getElementById('diceContainer');
var newDieVal;
var dieHTMLString;
var removeAll = function () {
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
            __spreadArrays(diceContainer.children).forEach(function (child) { return child.parentNode.removeChild(child); });
            diceLog = [];
            Swal.fire({
                title: 'Deleted!',
                text: 'Your dice have been deleted.',
                icon: 'success',
                backdrop: "\n                    rgba(0,0,123,0.4)\n                    url(\"../assets/images/nyan-cat.gif\")\n                    left top\n                    no-repeat\n                "
            });
        }
    });
};
var reroll = function () {
    diceLog.forEach(function (die) {
        die.value = die.roll();
        dieHTMLString = "<figure class='image is-128x128'><img src=\"https://bulma.io/images/placeholders/128x128.png\"><p class='has-text-centered has-text-grey-darker'>Dice value is " + newDieVal + "</p></figure>";
        die.newDie.innerHTML = "" + dieHTMLString;
    });
};
var sumTheDice = function () {
    var vals = [];
    diceLog.forEach(function (d) { return vals.push(d.value); });
    var sum = function (total, currentVal) { return total + currentVal; };
    Swal.fire("Total is " + vals.reduce(sum, 0));
};
document.getElementById('genDie').addEventListener('click', function () { diceLog.push(new Die()); });
document.getElementById('reroll').addEventListener('click', reroll);
document.getElementById('removeAll').addEventListener('click', removeAll);
document.getElementById('sumTheDice').addEventListener('click', sumTheDice);
var Die = /** @class */ (function () {
    function Die() {
        this.value = newDieVal;
        this.diceContainer = diceContainer;
        this.newDie = document.createElement('div');
        this.value = this.roll();
        this.newDie.className = 'column';
        dieHTMLString = "<figure class='image is-128x128'><img src=\"https://bulma.io/images/placeholders/128x128.png\"><p class='has-text-centered has-text-grey-darker'>Dice value is " + newDieVal + "</p></figure>";
        this.newDie.innerHTML = dieHTMLString;
        this.diceContainer.appendChild(this.newDie);
    }
    Die.prototype.roll = function () {
        return newDieVal = Math.floor((Math.random() * 6) + 1);
    };
    return Die;
}());
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
        Swal.fire('D20 mode activated!', "This took a while to code & to source the images; y'all owe me a beer!", 'success');
        d20mode = !d20mode;
    }
};
document.addEventListener('keydown', d20listener, false);
