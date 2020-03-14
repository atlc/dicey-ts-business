let Swal: any; // To suppress browser and TS warnings since it's pulled from the CDN
let diceLog: Array<Die> = [];
let diceContainer: HTMLElement = document.getElementById('diceContainer');
let newDieVal: number;
let dieHTMLString: string;
let imgPath: string;
let maxDiceValue: number = 6;

let removeAllPrompt = () => {
    Swal.fire({
        title: 'Are you sure you want to delete your dice?',
        text: "You won't ever be able to get them back!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete them!',
        backdrop: `
            rgba(123,0,0,0.4)
            url("../assets/images/nyan-cat.gif")
            left top
            no-repeat
        `
      }).then((result) => {
        if (result.value) {
            removeAll();
            Swal.fire({
                title: 'Deleted!',
                text: 'Your dice have been deleted.',
                icon: 'success',
                backdrop: `
                    rgba(0,0,123,0.4)
                    url("../assets/images/nyan-cat.gif")
                    left top
                    no-repeat
                `
            })
        }
    })
}

let removeAll = () => {
    Array.prototype.slice.call(diceContainer.children).forEach(child => child.parentNode.removeChild(child))
    diceLog = [];
}

let reroll = () => {
    diceLog.forEach(die => {
        die.value = die.roll();
        imgPath = d20mode ? `d20-${die.value}.png` : `dice0${die.value}.png`
        dieHTMLString = `<figure class='image is-128x128'><img src="../assets/images/${imgPath}"></figure>`;
        die.newDie.innerHTML = `${dieHTMLString}`;
    });
}

let sumTheDice = () => {
    let vals:Array<number> = [];
    diceLog.forEach(d => vals.push(d.value));
    let sum = function(total, currentVal) { return total + currentVal } 
    Swal.fire(
        `Total is ${vals.reduce(sum, 0)}`
    )
}

document.getElementById('genDie').addEventListener('click', function() { diceLog.push(new Die());});
document.getElementById('reroll').addEventListener('click', reroll);
document.getElementById('removeAll').addEventListener('click', removeAllPrompt);
document.getElementById('sumTheDice').addEventListener('click', sumTheDice);


class Die {
    value: number = newDieVal;
    diceContainer: HTMLElement = diceContainer;
    newDie: HTMLDivElement = document.createElement('div');

    constructor() {
        this.value = this.roll();
        this.newDie.className = 'column';
        imgPath = d20mode ? `d20-${this.value}.png` : `dice0${this.value}.png`
        dieHTMLString = `<figure class='image is-128x128'><img src="../assets/images/${imgPath}"></figure>`;
        this.newDie.innerHTML = dieHTMLString;
        this.diceContainer.appendChild(this.newDie);
    }

    roll(): number {
        return newDieVal = Math.floor((Math.random() * maxDiceValue) + 1);
    }
}



let d20mode: boolean = false;
let d20KeySeries: Array<string> = ['d', '2', '0'];
let keyHits:number = 0;

let d20listener = function(event) {
    let e:KeyboardEvent = event;
    if (d20KeySeries.indexOf(e.key) < 0 || e.key !== d20KeySeries[keyHits]) {
        return keyHits = 0;
    }
    keyHits++;

    if (keyHits === d20KeySeries.length) {
        keyHits = 0;
        Swal.fire(
            'D20 mode activated!',
            "This took a while to code & to source and create the images; every few visitors probably owes me a beer!",
            'success'
        );
        removeAll();
        d20mode = !d20mode;
        maxDiceValue = d20mode ?  20 : 6
    }
}

document.addEventListener('keydown', d20listener, false);