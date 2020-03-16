let Swal: any; // To suppress browser and TS warnings since it's pulled from the CDN
let diceLog: Array<Die> = [];
let diceContainer: HTMLElement = document.getElementById('diceContainer');
let dieHTMLString: string;
let imgPath: string;
let maxDiceValue: number = 6; // Initializing as a standard dice roll, until d20 mode is activated

class Die {
    value: number;
    id: string;

    constructor() {
        this.value = this.roll();
        this.id = this.createID();
    }

    // Returns 16 digit ID string off Math.random() seed converted to base 36
    createID(): string {
        return Math.random().toString(36).substr(2, 16);
    }

    roll(): number {
        return Math.floor((Math.random() * maxDiceValue) + 1);
    }
}

function generateDie() {
    let die:Die = new Die();
    let dieDiv: HTMLDivElement = document.createElement('div');
    dieDiv.className = 'column';
    imgPath = d20mode ? `d20-${die.value}.png` : `dice0${die.value}.png`
    dieHTMLString = `<figure class='image is-128x128'><img src="../assets/images/${imgPath}"></figure>`;
    dieDiv.innerHTML = dieHTMLString;
    dieDiv.addEventListener('click', () => rerollSingleDie(die.id));
    dieDiv.addEventListener('dblclick', () => removeSingleDie(die.id));
    diceContainer.appendChild(dieDiv);
    diceLog.push(die);
}

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
            });
        }
    });
}

let removeAll = () => {
    Array.prototype.slice.call(diceContainer.children).forEach(child => child.parentNode.removeChild(child))
    diceLog = [];
}

let reroll = () => {
    diceLog.forEach((die, index) => {
        die.value = die.roll();
        imgPath = d20mode ? `d20-${die.value}.png` : `dice0${die.value}.png`;
        dieHTMLString = `<figure class='image is-128x128'><img src="../assets/images/${imgPath}"></figure>`;
        diceContainer.children[index].innerHTML = `${dieHTMLString}`;
    });
}

let rerollSingleDie = (dieID) => {
    setTimeout(function() {
        let dieIndex = diceLog.map((dice) => dice.id).indexOf(dieID);
        if (diceLog[dieIndex]) {
            diceLog[dieIndex].value = diceLog[dieIndex].roll();
            imgPath = d20mode ? `d20-${diceLog[dieIndex].value}.png` : `dice0${diceLog[dieIndex].value}.png`
            dieHTMLString = `<figure class='image is-128x128'><img src="../assets/images/${imgPath}"></figure>`;
            diceContainer.children[dieIndex].innerHTML = dieHTMLString;   
        }
    }, 175 );
}

function removeSingleDie(dieID) {
    let dieIndex = diceLog.map((dice) => dice.id).indexOf(dieID);
    diceContainer.children[dieIndex].parentNode.removeChild(diceContainer.children[dieIndex]);
    diceLog.splice(dieIndex, 1);
}

let sumTheDice = () => {
    let vals:Array<number> = [];
    diceLog.forEach(d => vals.push(d.value));
    let sum = function(total: number, currentVal: number) { return total + currentVal } 
    Swal.fire(
        `Dice face value totals are: ${vals.reduce(sum, 0)}`
    )
}

document.getElementById('genDie').addEventListener('click', generateDie);
document.getElementById('reroll').addEventListener('click', reroll);
document.getElementById('removeAll').addEventListener('click', removeAllPrompt);
document.getElementById('sumTheDice').addEventListener('click', sumTheDice);

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
        removeAll();
        d20mode = !d20mode;
        maxDiceValue = d20mode ?  20 : 6;
        Swal.fire(
            `d20 mode ${d20mode ?  'activated!' : 'deactivated!'}`,
            'This took a while to code & to source and create the images; how about you toss a beer my way? 😉',
            `${d20mode ?  'success' : 'error'}`
        );
    }
}

document.addEventListener('keydown', d20listener);