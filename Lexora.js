"use strict";

const API = "https://lexora-words-api.onrender.com/words";

let words = [];
const loader = document.getElementById("loader");
const cont = document.querySelector(".cont");
const chancesCont = document.querySelector(".chances");

async function fetchWords() {
    try {
      const res = await fetch(API);
      words = await res.json();
      finishLoading();
      getWord();
    } catch (err) {
      alert("Failed to fetch words:", err);
    }
}
fetchWords();

function finishLoading() {
    loader.style.display = "none";
    chancesCont.style.display = "inline-block";
    cont.style.display = "inline-block"
}

const wordCont = document.getElementById("word-cont");
let numOfCorrectLetters = 0;
let word;
let hint;
let twoWords = false;
let firstWord;
let secondWord;
let firstWordLetters = new Array();
let secondWordLetters = new Array();
let subLetters = firstWordLetters;

function getWord() {
  const randomWord = Math.floor(Math.random() * words.length);
  word = words[randomWord].word;
  hint = words[randomWord].hint;
  if (word.includes(" ")) doubleWords();
    for (let i = 0; i < word.length; i++) {
      const letter = document.createElement("span");
      letter.textContent = "";
      letter.setAttribute("data-letter", word.charAt(i));
      letter.className = "hide";
      if (word.charAt(i) === " ") {
        letter.classList.add("space");
        letter.classList.remove("hide");
        numOfCorrectLetters++;
        subLetters = secondWordLetters;
      }
      if (twoWords) {
        subLetters.push(letter);
      }
      wordCont.appendChild(letter);
    }
  secondWordLetters.shift();
}

function doubleWords() {
  twoWords = true;
  firstWord = word.slice(0, word.indexOf(" "));
  secondWord = word.slice(word.indexOf(" ") + 1);
}

const letterInput = document.getElementById("input-field");
const submitBtn = document.getElementById("submit-btn");
const attemptedLttersCont = document.querySelector(".attempted-letters");
const messageCont = document.getElementById("message-cont");
let attemptedLetters = new Array();
const chances = document.getElementById("number-of-chances");
let numOfAttempts = 7;

submitBtn.addEventListener("click", e => e.preventDefault());
submitBtn.addEventListener("click", submitLetter);

letterInput.focus();
function submitLetter(e) {
  const value = letterInput.value.replace(/\s+/g, " ").trim().toLowerCase();
    if (letterInput.value.trim().length < 1 || letterInput.value.trim().length === 2 || attemptedLetters.includes(value)) return;
    if (!(/^[A-Za-z\s]+$/.test(letterInput.value.trim()))) {
        alert("only enter letters!");
        letterInput.value = "";
        return;
    }
    attemptedLetters.push(value);
  if (numOfAttempts) letterInput.focus();
    if (word.includes(value)) {
        if (letterInput.value.trim().length === 1) {
            document.querySelectorAll(".hide").forEach((e) => {
              if (e.classList.contains("show")) return;
              if (e.getAttribute("data-letter") === letterInput.value.trim().toLowerCase()) {
                  e.textContent = e.getAttribute("data-letter");
                   e.classList.add("show");
                   numOfCorrectLetters++;
              }
            })
            const letter = document.createElement("span");
            letter.textContent = letterInput.value.trim().toLowerCase();
            letter.className = "correct-letter";
            attemptedLttersCont.appendChild(letter);
            checkIfCorrect();
        } else {
            if (value === word) {
                document.querySelectorAll(".hide").forEach((e) => {
                    e.textContent = e.getAttribute("data-letter");
                    e.classList.add("show");  
                });
                const letter = document.createElement("span");
                letter.textContent = letterInput.value.trim().toLowerCase();
                letter.className = "correct-letter";
                attemptedLttersCont.appendChild(letter);

                submitBtn.removeEventListener("click", submitLetter);
                document.getElementById("message").textContent = "you win!!!";
                messageCont.classList.toggle("show-result");
              playAgainBtn.focus();
            } else if (value === firstWord || value === secondWord) {
              //let subWord = value === firstWord? firstWord: secondWord;
              subLetters = value === firstWord? firstWordLetters: secondWordLetters;
              subLetters.forEach(e => {
                  e.textContent = e.getAttribute("data-letter");
                  e.classList.add("show");
                numOfCorrectLetters++;
              });
              
              const letter = document.createElement("span");
              letter.textContent = letterInput.value.trim().toLowerCase();
              letter.className = "correct-letter";
              attemptedLttersCont.appendChild(letter);
              
              let num = 0;
              document.querySelectorAll(".hide").forEach(e => {
                if (e.classList.contains("show")) {
                  num++;
                }
                checkIfWon(num);
              })
            } else {
                const letter = document.createElement("span");
                letter.textContent = letterInput.value.trim().toLowerCase();
                letter.className = "wrong-letter";
                attemptedLttersCont.appendChild(letter);
            }
        }
    } else {
        numOfAttempts--;
        chances.textContent = numOfAttempts;
        if (numOfAttempts <= 2) chances.style.color = "#f70909";
        const letter = document.createElement("span");
        letter.textContent = letterInput.value.trim().toLowerCase();
        letter.className = "wrong-letter";
        attemptedLttersCont.appendChild(letter);
        if (numOfAttempts === 1) document.getElementById("hint").textContent = `hint: ${hint}`;
        if (numOfAttempts === 0) {
            submitBtn.removeEventListener("click", submitLetter);
            document.getElementById("message").textContent = "you lose!!!";
            messageCont.classList.toggle("show-result");
          playAgainBtn.focus();
        }
    }
    letterInput.value = "";
}

function checkIfWon(num) {
  if (document.querySelectorAll(".hide").length === num) {
    submitBtn.removeEventListener("click", submitLetter);
    document.getElementById("message").textContent = "congratulations, you win!!!";
    messageCont.classList.toggle("show-result");
    playAgainBtn.focus();
  }
}

function checkIfCorrect() {
    if (numOfCorrectLetters === word.length) {
        submitBtn.removeEventListener("click", submitLetter);
        document.getElementById("message").textContent = "congratulations, you win!!!";
        messageCont.classList.toggle("show-result");
      playAgainBtn.focus();
    }
}

const playAgainBtn = document.getElementById("play-again-btn");
playAgainBtn.addEventListener("click", () => {
    chances.style.color = "#0fe32b";
    messageCont.classList.toggle("show-result");
  if (twoWords) {
    firstWord = "";
    secondWord = "";
    firstWordLetters = new Array();
    secondWordLetters = new Array();
    subLetters = firstWordLetters;
    twoWords = false;
  }
    numOfAttempts = 7;
    numOfCorrectLetters = 0;
    chances.textContent = numOfAttempts;
    attemptedLetters = new Array();
    attemptedLttersCont.innerHTML = "";
    document.getElementById("hint").textContent = "";
    wordCont.innerHTML = "";
    getWord();
    submitBtn.addEventListener("click", submitLetter);
  letterInput.focus();
});
