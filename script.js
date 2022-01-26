document.addEventListener('alpine:init', () => {
    Alpine.data('game', function () {
        return {
            init() {
                var r = document.querySelector(':root');
                r.style.setProperty('--rows', this.rows);
                r.style.setProperty('--columns', this.columns);
            },
            columns: 5,
            rows: 6,
            toastMessage: null,
            currentWordIndex: this.$persist(Math.floor(Math.random() * answers.length)),
            get correctWord() { return answers[this.currentWordIndex] },
            currentTry: this.$persist(''),
            enteredTries: this.$persist([]),
            _states: { "correct": "🟩", "present": "🟨", "absent": "⬜" },
            get gameState() {
                if (this.enteredTries.map(t => t.toLowerCase()).includes(this.correctWord.toLowerCase())) return true;
                if (this.enteredTries.length === this.rows) return false;
                return null;
            },
            get gameResult() {
                let result = "";
                this.enteredTries.forEach((t, r) => {
                    result += t.split("").map((l, c) => this._states[this.getTileState(r * this.columns + (c + 1))]).join("")
                    result += "\n"
                });
                return result;
            },
            getRowColumn(tile) {
                return { row: Math.floor((tile - 1) / this.columns), column: ((tile - 1) % this.columns) }
            },
            getTileLetter(tile) {
                const { row, column } = this.getRowColumn(tile);
                return this.enteredTries?.[row]?.[column] ?? (row === this.enteredTries.length ? this.currentTry?.[column] : null)
            },
            getTileState(tile) {
                const { row, column } = this.getRowColumn(tile);
                const letter = this.getTileLetter(tile);
                if (row === this.enteredTries.length && letter) {
                    return "tbd";
                }
                if (!letter) {
                    return 'empty';
                }
                if (this.correctWord.toLowerCase()[column] === letter.toLowerCase()) {
                    return 'correct';
                }
                if (this.correctWord.toLowerCase().includes(letter.toLowerCase())) {
                    return 'present';
                }
                return 'absent';
            },
            getLetterState(letter) {
                const letters = [];
                this.enteredTries.forEach((t, r) => {
                    t.split("").forEach((l, c) => {
                        const newState = this.getTileState(r * this.columns + (c + 1));
                        if(letters[l]!=="correct" || (letters[l]!=="present" && newState==="absent")) {
                            letters[l] = newState;
                        }
                    })
                });
                return letters[letter];
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
                if (this.currentTry?.length !== this.columns) {
                    this.showToast("Not enough letters");
                }
                else if (![...answers, ...allowedGuesses].includes(this.currentTry)) {
                    this.showToast("Not in word list");
                }
                else {
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
                this.currentWordIndex++;
                if (this.currentWordIndex >= answers.length) {
                    this.currentWordIndex = 0;
                }
            },
            showToast(toastMessage) {
                this.toastMessage = toastMessage
                setTimeout(() => {
                    this.toastMessage = null
                }, 2000)
            }
        }
    })
})
