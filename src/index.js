
// Fetches //

fetchQuotes().then(renderAllQuotes)
fetchQuotes().then(console.log)
function fetchQuotes() {
    return fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
}

// Render Quotes //

const quoteList = document.querySelector('#quote-list')

function renderOneQuote(quote) {
    const quoteCard = document.createElement('li')
    quoteCard.className = 'quote-card'
    quoteCard.dataset.id = quote.id

    const blockquote = document.createElement('blockquote')
    blockquote.className = 'blockquote'

    const p = document.createElement('p')
    p.className = 'mb-0'
    p.innerText = quote.quote

    const footer = document.createElement('footer')
    footer.className = 'blockquote-footer'
    footer.innerText = quote.author

    const br = document.createElement('br')

    const likeButton = document.createElement('button')
    likeButton.className = 'btn-success'
    quote.likes ? likeButton.innerText = quote.likes.length : likeButton.innerText = 0

    const deleteButton = document.createElement('button')
    deleteButton.className = 'btn-danger'
    deleteButton.innerText = 'Delete'

    blockquote.append(p, footer, br, likeButton, deleteButton)
    quoteCard.append(blockquote)
    quoteList.append(quoteCard)
}   

function renderAllQuotes(quoteArray) {
    quoteArray.forEach(renderOneQuote)
}

// Create New Quote //

const newQuoteForm = document.querySelector('#new-quote-form')

newQuoteForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const quote = e.target.quote.value
    const author = e.target.author.value

    const newQuote = {quote, author}
    e.target.reset()
    
    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuote)
    })
    .then(response => response.json())
    .then(renderOneQuote)
})

// Delete Quote && Like Quote //

quoteList.addEventListener('click', (e) => {
    if (e.target.className == 'btn-danger'){
        const quoteCard = e.target.parentElement.parentElement
        const id = quoteCard.dataset.id
        quoteCard.remove()

        fetch(`http://localhost:3000/quotes/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            }
        })
        
    }

    if (e.target.className == 'btn-success'){
        console.log(e)
        const quoteCard = e.target.parentElement.parentElement
        const quoteId = parseInt(quoteCard.dataset.id)
        const createdAt = Math.round(Date.now() / 1000)
        e.target.innerText++
        const newLike = {quoteId, createdAt}
        fetch('http://localhost:3000/likes', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newLike)
        })
    }
})



