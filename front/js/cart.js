// GET the localStorage content
var storage = [];
var totalQuantity = 0;

for (var j = 0; j < localStorage.length; j++){
    storage.push(JSON.parse(localStorage.getItem(localStorage.key(j))))
}
console.log(storage);

const section = document.getElementById("cart__items")
//loop in the database from the ids of the localStorage content
for(let i of storage){
    
    //get the total amount of product in the cart
    totalQuantity += parseInt(i[2])

    fetch('http://localhost:3000/api/products/'+ i[0])
    .then(response => response.json())
    .then(product => {
        // console.log(product)

        //ADD article
        let article = document.createElement("article")
        article.className = "cart__item"
        article.setAttribute("data-id", product._id)
        article.setAttribute("data-color", i[1])

        //ADD divImg
        let divImg = document.createElement("div")
        divImg.className = "cart__item__img"

        //ADD img
        let img = document.createElement("img")
        img.src = product.imageUrl
        img.alt = product.altTxt

        //ADD divContent
        let divContent = document.createElement("div")
        divContent.className ="cart__item__content"

        //ADD divContentDescription
        let divContentDescription = document.createElement("div")
        divContentDescription.className = "cart__item__content__description"

        //ADD H2 and <p>s
        let h2 = document.createElement("h2")
        h2.textContent = product.name

        let p1 = document.createElement("p")
        p1.textContent = i[1]
        
        let p2 = document.createElement("p")
        p2.textContent = product.price + " €"

        //ADD content settings
        let divContentSettings = document.createElement("div")
        divContentSettings.className = "cart__item__content__settings"

        //ADD divs settings quantity and settings delete
        let divSettingsQuantity = document.createElement("div")
        divSettingsQuantity.className = "cart__item__content__settings__quantity"

        let divSettingsDelete = document.createElement("div")
        divSettingsDelete.className = "cart__item__content__settings__delete"
        
        //ADD <p> and input for quantity
        let p3 = document.createElement("p")
        p3.textContent = "Qté : " + i[2]

        let input = document.createElement("input")
        input.type = "number"
        input.name = "itemQuant"
        input.className = "itemQuantity"
        input.min = 1
        input.max = 100
        // input.value = i[2]
        input.setAttribute('value', 0)
        //ADD <p> in delete div
        let p4 = document.createElement("p")
        p4.textContent = "Supprimer"
        p4.classList = "deleteItem"
        //ADD implement everything into the HTML
        section.appendChild(article).append(divImg, divContent)
        divImg.appendChild(img)
        divContent.append(divContentDescription, divContentSettings)
        divContentDescription.append(h2, p1, p2)
        divContentSettings.append(divSettingsQuantity, divSettingsDelete)
        divSettingsQuantity.append(p3, input)
        divSettingsDelete.appendChild(p4)
    })
}

var total = document.getElementById('totalQuantity')
total.textContent = totalQuantity



window.addEventListener('load', function (){

    let allInputs = document.getElementsByClassName("itemQuantity")
    console.log(allInputs)
    for(let i of allInputs){
        i.addEventListener('change', (e) => {
            console.log(e.target.valueAsNumber)

            //Updating the quantity in view
            updateQuantity(i)
        })
    }
})

function updateQuantity(i){

    let quant = i.closest(".cart__item__content__settings__quantity").firstElementChild

    //Updating the total amount
    let updateNumb = i.valueAsNumber - parseInt(quant.textContent.split(' ')[2])
    totalQuantity += updateNumb
    total.textContent = totalQuantity
    
    //Get the id and color of selected item
    let id = i.closest('.cart__item').dataset.id
    let color = i.closest('.cart__item').dataset.color
    quant.textContent = "Qté : " + i.valueAsNumber

    //updating the localstorage
    for(let l = 0; l < localStorage.length; l++){
        let loc = JSON.parse(localStorage.getItem(localStorage.key(l)))
        loc.splice(2, 1, i.valueAsNumber)
        if(loc[0] == id && loc[1] == color){
            localStorage.setItem(localStorage.key(l), JSON.stringify(loc))
            break;
        }
    }
}
