class Die {
    value: number;

    constructor(v: number) {
        this.value = v;
    }

    roll() {
        this.value = Math.floor((Math.random() * 6) + 1);
    }
}

let generateDie = new Die(1);

let diceRolls:number = 500;
let count1 = 0, count2 =0, count3=0,count4=0,count5=0,count6=0;
let countArr = [count1, count2, count3, count4, count5, count6]

for (let i: number=0; i<diceRolls; i++) {
    generateDie.roll();
    countArr[generateDie.value-1]++;
    let die = `<div>Value:${generateDie.value}</div>`
    document.body.append(die)
}

console.log(`Dice roll yields:\n`)
countArr.forEach((n, i) => {
    console.log(`Value ${i+1}:\t${n.toLocaleString()}`);
});