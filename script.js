
document.addEventListener('alpine:init', () => {
    Alpine.data('game', () => ({
        init() {
            var r = document.querySelector(':root');
            r.style.setProperty('--rows', this.rows);
            r.style.setProperty('--columns', this.columns);
        },
        columns: 5,
        rows: 6,
        correctWord: 'great',
        currentTry: '',
        enteredTries: [],
        _states: { "correct": "🟩", "present": "🟨", "absent": "⬜" },
        get gameState() {
            if (this.enteredTries.map(t => t.toLowerCase()).includes(this.correctWord.toLowerCase())) return true;
            if (this.enteredTries.length === this.rows) return false;
            return null;
        },
        get gameResult() {
            let result = "";
            this.enteredTries.forEach((t, r) => {
                result += t.split("").map((l, c) => this._states[this.getLetterState(r * this.columns + (c + 1))]).join("")
                result += "\n"
            });
            return result;
        },
        getRowColumn(tile) {
            return { row: Math.floor((tile - 1) / this.columns), column: ((tile - 1) % this.columns) }
        },
        getLetter(tile) {
            const { row, column } = this.getRowColumn(tile);
            return this.enteredTries?.[row]?.[column] ?? (row === this.enteredTries.length ? this.currentTry?.[column] : null)
        },
        getLetterState(tile) {
            const { row, column } = this.getRowColumn(tile);
            const letter = this.getLetter(tile);
            if (row === this.enteredTries.length && letter) {
                return "tbd";
            }
            if (!letter) return 'empty';
            let i = this.correctWord.toLowerCase().indexOf(letter.toLowerCase())
            if (i >= 0) {
                if (i === column) return 'correct';
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
                this.enteredTries.push(this.currentTry)
                this.currentTry = '';
            }
        },
        insertLetter(letter) {
            if (letter && this.currentTry.length < this.columns) {
                this.currentTry += letter
            }
        },
        isLetter(str) {
            return str.length === 1 && str.match(/[a-z]/i)?.[0];
        },
        nextWordClicked() {
            this.enteredTries = [];
            this.currentTry = '';
        }
    }))
})
