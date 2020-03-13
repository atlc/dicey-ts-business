var Die = /** @class */ (function () {
    function Die(v) {
        this.value = v;
    }
    Die.prototype.roll = function () {
        this.value = Math.floor((Math.random() * 6) + 1);
    };
    return Die;
}());
var generateDie = new Die(1);
var diceRolls = 500;
var count1 = 0, count2 = 0, count3 = 0, count4 = 0, count5 = 0, count6 = 0;
var countArr = [count1, count2, count3, count4, count5, count6];
for (var i = 0; i < diceRolls; i++) {
    generateDie.roll();
    countArr[generateDie.value - 1]++;
    var die = "<div>Value:" + generateDie.value + "</div>";
    document.body.append(die);
}
console.log("Dice roll yields:\n");
countArr.forEach(function (n, i) {
    console.log("Value " + (i + 1) + ":\t" + n.toLocaleString());
});
