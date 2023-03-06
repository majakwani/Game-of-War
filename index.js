let deckId
const cardsContainer = document.getElementById("cards")
const newDeckBtn = document.getElementById("new-deck")
const drawCardBtn = document.getElementById("draw-cards")
const remaining = document.getElementById("remaining")
const result = document.getElementById("result")
let userScore = 0
let computerScore = 0

function handleClick() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            resetGame()
            deckId = data.deck_id
            remaining.innerHTML = `Remaining Cards: ${data.remaining}`
            updateScore(computerScore, userScore)
        })
}

newDeckBtn.addEventListener("click", handleClick)

drawCardBtn.addEventListener("click", () => {
    fetch(`https:/deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            const res = determineCardWinner(data.cards[0].value, data.cards[1].value)
            updateScore(computerScore, userScore)
            cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
            `
            cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
            `
            result.innerHTML = res
            remaining.innerHTML = `Remaining Cards: ${data.remaining}`
            if (data.remaining === 0){
                drawCardBtn.disabled = true
                displayResults()
            }
        })
})

function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = valueOptions.indexOf(card1)
    const card2ValueIndex = valueOptions.indexOf(card2)
    
    if (card1ValueIndex > card2ValueIndex) {
        computerScore++
        return `Computer Point`
    } else if (card1ValueIndex < card2ValueIndex) {
        userScore++
        return `Your point`
    } else {
        return `War!`
    }
}

function updateScore(computerScore, userScore){
    document.getElementById('computer-score').innerHTML = `Computer Score: ${computerScore}`
    document.getElementById('user-score').innerHTML = `My Score: ${userScore}`
}

function displayResults(){
    if(userScore > computerScore){
        result.innerHTML = `You Won The Game!`
    }
    else if(userScore < computerScore){
        result.innerHTML = `Computer Won!`
    }
    else{
        result.innerHTML = `Draw!`
    }
}

function resetGame(){
    userScore = 0
    computerScore = 0
    result.innerHTML = ""
}