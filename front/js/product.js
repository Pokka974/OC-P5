const id = new URL(window.location.href).searchParams.get('id')
const addToCartBtn = document.getElementById('addToCart')
console.log(_lsGet('Kanap Calycé Red'))
fetch('http://localhost:3000/api/products/'+ id)
    .then(response => response.json())
    .then(product => {
        // ADD the image
        let imgItemEl = document.getElementsByClassName('item__img');
        let img = document.createElement('img')
        img.src = product.imageUrl
        imgItemEl[0].appendChild(img)

        // ADD the name
        let titleEl = document.getElementById('title')
        let h3 = document.createElement('h3')
        h3.textContent = product.name
        titleEl.appendChild(h3);

        // ADD the price
        let priceSpanEl = document.getElementById('price')
        let price = document.createTextNode(product.price)
        priceSpanEl.appendChild(price)

        // ADD the description
        let descrPEl = document.getElementById('description')
        let descri = document.createTextNode(product.description)
        descrPEl.appendChild(descri)

        //ADD the colors options
        let selectEl = document.getElementById('colors')
        let colors = product.colors
        for(let c of colors){
            let newOption = document.createElement('option')
            newOption.value = c
            let colorText = document.createTextNode(c)
            newOption.appendChild(colorText)
            selectEl.appendChild(newOption)
        }

        let quant = document.getElementById('quantity')
        
        // ADD the add to cart button listener
        addToCartBtn.onclick = function(){

            //Selected Color
            let selectedColor = selectEl.options[selectEl.selectedIndex].text

            //check if a color and a quantity has been selected
            if(quant.value > 0 && quant.value < 100 && selectedColor != "--SVP, choisissez une couleur --"){
                //check if 'basket' exists in local storage
                if('basket' in localStorage){
                    //check if this selection already exists in the cart
                    if(sameProduct(product._id, selectedColor)){
                        console.log("SAME")
                        let concernedItem = findItemByIdAnColor(product._id, selectedColor)
                        editQuantity(concernedItem, quant.value)
                    }
                    //IF NOT, create a new line in local storage
                    else{
                        let actualBasket = _lsGet('basket')
                        let currentProduct = {id: product._id, color: selectedColor, quantity: quant.value}
                        actualBasket.push(currentProduct)
                        _lsSet('basket', actualBasket)
                    }
                    
                }
                //IF 'basket' is not already created, create the first line
                else{
                    _lsSet('basket', [{id: product._id, color: selectedColor, quantity: quant.value}])
                }
            }
            else{
                alert("No color or available quantity provided !")
            }
        }
});

//return true if there is an item with the same id and color in basket
function sameProduct(id, color){
    let actualBasket = _lsGet('basket')
    for(let i of actualBasket){
        if(i.id == id && i.color == color) return true
    }
    return false
}

//return the item with the same id and color in basket (if it exists)
function findItemByIdAnColor(id, color){
    let actualBasket = _lsGet('basket')

    for(let i of actualBasket){
        console.log("TEST "+ i)
        if(i.id === id && i.color === color) return i
    }
}
//find the concerned item in basket and edit his quantity property
function editQuantity(value, quant){
    let actualBasket = _lsGet('basket')
    for(let i of actualBasket){
        if(JSON.stringify(value) === JSON.stringify(i)){
            let thisQuant = parseInt(i.quantity)
            thisQuant += parseInt(quant)
            if(thisQuant > 100){
                alert('Impossible d\'ajouter plus de 100 fois le même produit au panier !')
            }else{
                i.quantity = thisQuant
            }
        } 
    }
    _lsSet('basket', actualBasket)
}

//return the parsed element from localstorage
function _lsGet(key) {
    try {
        if(localStorage.getItem(key)){
            return JSON.parse(localStorage.getItem(key))
        }
        else{
            return undefined
        }
    } catch (e) {
        console.error(e)
    }
}

//Add or edit a stringify selected element in localstorage
function _lsSet(key, val){
    try {
        localStorage.setItem(key, JSON.stringify(val))
        console.log("NEW ITEM ADDED IN LOCALSTORAGE\n"+ JSON.stringify(val))
    } catch (e) {
        console.error(e)
    }
}


