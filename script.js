
document.addEventListener('alpine:init', () => {
    Alpine.data('game', () => ({
        init() {
            var r = document.querySelector(':root');
            r.style.setProperty('--rows', this.rows);
            r.style.setProperty('--columns', this.columns);
        },
        columns: 5,
        rows: 6,
        getRowColumn(tile) {
            return { row: Math.floor((tile - 1) / this.columns), column: ((tile - 1) % this.columns) }
        },
        correctWord: 'great',
        currentTry: '',
        tries: [],
        states: { "correct": "🟩", "present": "🟨", "absent": "⬜" },
        letterState(letter, position) {
            if (letter === undefined) return 'empty';
            let i = this.correctWord.toLowerCase().indexOf(letter.toLowerCase())
            if (i >= 0) {
                if (i === position) return 'correct';
                return 'present';
            }
            return 'absent';
        },
        letterClicked(e) {
            let letter = null;
            if (e.target.tagName.toLowerCase() === 'span') {
                letter = e.target.innerText;
            }
            else if (e.target.querySelector(':scope > span') !== null) {
                letter = e.target.querySelector(':scope > span').innerText;
            }
            this.insertLetter(letter)
        },
        removeClicked() {
            this.currentTry = this.currentTry?.slice(0, -1)
        },
        enterClicked() {
            if (this.currentTry?.length === this.columns) {
                this.tries.push(this.currentTry)
                this.currentTry = '';
            }
        },
        insertLetter(letter) {
            if (letter && this.currentTry.length < this.columns) {
                this.currentTry += letter
            }
        },
        get gameState() {
            if (this.tries.map(t => t.toLowerCase()).includes(this.correctWord.toLowerCase())) return true;
            if (this.tries.length === this.rows) return false;
            return null;
        },
        get result() {
            let result = "";
            this.tries.forEach(t => {
                result += t.split("").map((l, i) => this.states[this.letterState(l, i)]).join("")
                result += "\n"
            });
            return result;
        },
        isLetter(str) {
            return str.length === 1 && str.match(/[a-z]/i)?.[0];
        },
            nextWordClicked() {
                this.enteredTries = [];
                this.currentTry = '';
            }
})
