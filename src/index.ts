declare let Swal: any; // To suppress browser and TS warnings since it's pulled from the CDN

class Die {
    constructor() {
        this.value = this.roll();
        this.id = this.createID();
        this.generate();
        this.attachEventListeners();
        Die.diceList.push(this);
    }

    
    /* Instantiated properties */
    /* ======================= */

    value: number;
    id: string;
    div: HTMLElement;
    figure: HTMLElement;
    img: HTMLImageElement;
    imageSource: string;


    /* Instantiated methods */
    /* ==================== */

    attachEventListeners(): void {
        this.div.addEventListener('click', () => this.singleReRoll());
        this.div.addEventListener('dblclick', () => this.singleRemove());
    }

    /*  This is nonfunctional and is only an attribute attached to the div,
        and is unneccessary for the scope of this project,
        but is a nice feature to start implementing as projects get more complex
    */
    createID(): string {
        // Returns ID string from random seed & timestamp converted to base 36
        return `${Math.random().toString(36).substr(2, 16)}_${Date.now().toString(36)}`;
    }

    generate(): void {
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
    }

    roll(): number {
        return Math.floor((Math.random() * Die.maxDieValue) + 1);
    }

    singleRemove(): void {
        document.querySelector('#diceContainer').removeChild(this.div);
        let index = Die.diceList.indexOf(this);
        Die.diceList.splice(index, 1);
    }
    
    singleReRoll(): void {
        this.value = this.roll();
        this.updateImagePath();
    }

    updateImagePath(): void {
        this.imageSource = Die.isD20Mode ? `d20-${this.value}.png` : `dice0${this.value}.png`;
        this.img.src = `../assets/images/${this.imageSource}`;
    }


    /* Static class properties */
    /* ======================= */

    private static d20KeypressSeries: string[] = ['d', '2', '0'];
    private static diceList: Die[] = [];
    private static isD20Mode: boolean = false;
    private static maxDieValue: number = 6; // Initializing as a standard die roll, until d20 mode is activated
    private static successfulKeypressCount: number = 0;


    /* Static class methods */
    /* ==================== */
    
    static multiRemove() {
        for (let i = Die.diceList.length - 1; i >= 0; i--) {
            Die.diceList[i].singleRemove();
        }
    }
    
    static multiReRoll() {
        for (let i = Die.diceList.length - 1; i >= 0; i--) {
            Die.diceList[i].singleReRoll();
        }
    }

    static promptForDeletion() {
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
          }).then((result: { value: boolean }) => {
            if (result.value) {
                Die.multiRemove();
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

    static sumFaces() {
        const sum: number = Die.diceList.reduce((total, die) => (total += die.value), 0);
        Swal.fire(`Dice face value totals are: ${sum}`);
    }

    static watchForDiceModeChange(e: KeyboardEvent) {
        if (Die.d20KeypressSeries.indexOf(e.key) < 0 || e.key !== Die.d20KeypressSeries[Die.successfulKeypressCount]) {
            return Die.successfulKeypressCount = 0;
        }
        Die.successfulKeypressCount++;

        if (Die.successfulKeypressCount === Die.d20KeypressSeries.length) {
            Die.successfulKeypressCount = 0;
            Die.isD20Mode = !Die.isD20Mode;
            Die.maxDieValue = Die.isD20Mode ? 20 : 6;
            Die.multiReRoll();
            Swal.fire(
                `d20 mode ${Die.isD20Mode ?  'activated!' : 'deactivated!'}`,
                'This took a while to code & to source and create the images; how about you tossing a coin to support your local witchers?',
                `${Die.isD20Mode ?  'success' : 'error'}`
            );
        }
    }
}

document.getElementById('genDie').addEventListener('click', () => new Die());
document.getElementById('reroll').addEventListener('click', Die.multiReRoll);
document.getElementById('removeAll').addEventListener('click', Die.promptForDeletion);
document.getElementById('sumTheDice').addEventListener('click', Die.sumFaces);
document.addEventListener('keydown', Die.watchForDiceModeChange);
