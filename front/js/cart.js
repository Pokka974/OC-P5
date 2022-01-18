
let actualURL = window.location.href
let URLEl = actualURL.split('/')
const section = document.getElementById("cart__items")
if(URLEl[URLEl.length-1].startsWith('confirmation')){
    displayConfirmation()
}else{
    displayCart()
}

//load de code for cart.html
function displayCart(){
    console.log("CART PAGE !")
    
    let products = new Array()
    let actualBasket = _lsGet('basket')
    
    //loop in basket local storage
    for(let i of actualBasket){
    products.push(i.id)
        fetch('http://localhost:3000/api/products/'+ i.id)
        .then(response => response.json())
        .then(product => {

            displayProduct(product, i)
        });
    }

    //submit button listener
    document.getElementById('cart__order__form').addEventListener('submit', e => {
        e.preventDefault()
        console.log('clic on submit')
        let contact = checkInputs()
        let orderIdValue = document.getElementById('orderId')
        if(allInputsAreValid()){
            console.log(JSON.stringify({contact, products}))
            fetch('http://localhost:3000/api/products/order', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify({contact, products})
            })
            .then(function(res){
                if(res.ok){
                    localStorage.removeItem('basket')
                    return(res.json())
                }else{
                    console.error('No order ID generated')
                }
            })
            .then(function(orderRes) {
                let domain = URLEl[2]
                window.location.replace('http://'+ domain + '/front/html/confirmation.html?orderId=' + orderRes.orderId)
            })
            .catch(function(err){
                console.error(err)
            })
        }
    });

    //execute the code inside AFTER the page loaded
    window.addEventListener('load', function (){

        let allInputs = document.getElementsByClassName("itemQuantity")

        //loop in quantity changes input
        for(let i of allInputs){
            i.addEventListener('change', (e) => {
                console.log(e.target.valueAsNumber)
    
                //Updating the quantity in view and localStorage
                updateQuantity(i)
            })
        }
    
        let allDeleteBtn = document.getElementsByClassName("deleteItem")
        // deleteItem(allDeleteBtn[0])
        for(let j of allDeleteBtn){
            j.addEventListener('click', () => {
                deleteItem(j)
            })
        }

        //update the total price and quantity
        updateTotalQuantity()
        updateTotalPrice()
    })
}

//load the code for confirmation.html
function displayConfirmation(){
    console.log("CONFIRMATION PAGE !")

    const orderIdSpan = document.getElementById('orderId')
    const orderId = new URL(window.location.href).searchParams.get('orderId')

    orderIdSpan.textContent = orderId
}

//check if the form inputs are all valid or not
function allInputsAreValid(){
    let errors = document.getElementsByClassName('error')
    console.log(errors)
    if(errors.length != 0){
        console.log("it's not valid")
        return false;
    } else {
        console.log("It's valid !")
        return true;
    }
}

//uses RegEx for all the form inputs
function checkInputs(){
    let contact = {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        email: ''
    }
    const firstName = document.getElementsByClassName('cart__order__form__question')[0].children[1]
    const lastName = document.getElementsByClassName('cart__order__form__question')[1].children[1]
    const address = document.getElementsByClassName('cart__order__form__question')[2].children[1]
    const city = document.getElementsByClassName('cart__order__form__question')[3].children[1]
    const email = document.getElementsByClassName('cart__order__form__question')[4].children[1]

    console.log(firstName)
    if(firstName.value == ''){
        setErrorFor(firstName, 'First name cannot be blank')
    }else if (!isAName(firstName.value)){
        setErrorFor(firstName, 'Not a valid first name')
    }else {
        setSuccessFor(firstName)
        contact.firstName = firstName.value
    }

    if(lastName.value == ''){
        setErrorFor(lastName, 'Last name cannot be blank')
    } else if (!isAName(lastName.value)){
        setErrorFor(lastName, 'Not a valid last name')
    } else {
        setSuccessFor(lastName)
        contact.lastName = lastName.value
    }

    if(address.value == ''){
        setErrorFor(address, 'Address cannot be blank')
    } else if (!isAnAddress(address.value)){
        setErrorFor(address, 'Not a valid address')
    } else {
        setSuccessFor(address)
        contact.address = address.value
    }

    if(city.value == ''){
        setErrorFor(city, 'City cannot be blank')
    } else if (!isACity(city.value)){
        setErrorFor(city, 'Not a valid city')
    } else {
        setSuccessFor(city)
        contact.city = city.value
    }

    if(email.value == ''){
        setErrorFor(email, 'Email cannot be blank')
    } else if (!isAnEmail(email.value)){
        setErrorFor(email, 'Not a valid email')
    } else {
        setSuccessFor(email)
        contact.email = email.value
    }

    return contact;
}

//handle the error message and class changes for form's input
function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const errorP = formControl.children[2]
	formControl.className = 'cart__order__form__question error';
	errorP.innerText = message;
}

//handle the class changes for the form's inputs when success
function setSuccessFor(input) {
	const formControl = input.parentElement;
	formControl.className = 'cart__order__form__question success';
}

//the following functions return true if it succeeds the RegEx tests
function isAName(name){
    return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(name);
}

function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function isAnAddress(address){
    return /^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/.test(address);
}

function isACity(city){
    return /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(city);
}
function isAnEmail(email){
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email);
}

//Update the quantity of the corresponding item in local storage and in the DOM
function updateQuantity(i){
    let quant = i.closest(".cart__item__content__settings__quantity").firstElementChild

    let inputIsEmpty = i.value.toString().trim().length == 0 ? true : false
    
    //Get the id and color of selected item
    let id = i.closest('.cart__item').dataset.id
    let color = i.closest('.cart__item').dataset.color

    if(!inputIsEmpty){
        quant.textContent = "Qté : " + i.valueAsNumber
    }
    
    //updating the localstorage
        //check if this selection already exists in the cart
    if(sameProduct(id, color)){
        console.log("SAME")
        let concernedItem = findItemByIdAnColor(id, color)
        editQuantity(concernedItem, i.value)
        updateTotalQuantity()
        updateTotalPrice()
    }
    
}

//Delete the corresponding item in the local storage and in the DOM
function deleteItem(i){
    if(confirm('Voulez vous vraiment supprimer l\'article du panier ?')){
        // cart__item
        let promise2
        let id = i.closest('.cart__item').dataset.id
        let found = false
        //GET the color and the name of the corresponding item
        let bloc = i.closest('.cart__item')
        let bloc_description = i.closest('.cart__item__content').firstElementChild
        let color = bloc_description.children[1]
        
        
        let actualBasket = _lsGet('basket')
        let itemToDelete = findItemByIdAnColor(id, color.textContent)
    
        for(let [i, v] of actualBasket.entries()){
            if(JSON.stringify(v) === JSON.stringify(itemToDelete)){
                actualBasket.splice(i, 1)
                _lsSet('basket', actualBasket)
                // bloc.remove()
                found = true
                break;
            }
        }

        console.log(actualBasket)
        // delete the HTML element in the DOM
        if(found){
            promise2 = new Promise((resolve, reject) => {
                resolve(bloc.remove())
            })
        }
        promise2.then((value) =>{
            updateTotalQuantity()
            updateTotalPrice()
        })
    }
    
}

// update the total price in the DOM
function updateTotalPrice(){

    let totalPriceElement = document.getElementById('totalPrice')
   
    let totalPrice = 0
    let totalQuant = []
    let totalPrices = []
    let allPricesEl = document.getElementsByClassName('item__price')
    let allQuantEl = document.getElementsByClassName('cart__item__content__settings__quantity')

    for(let i of allQuantEl){
        totalQuant.push(i.firstChild.textContent.split(' ')[2])
    }

    console.log(allPricesEl)
    for(let j of allPricesEl){
        totalPrices.push(parseInt(j.textContent.split(' ')[0]))
    }

    for(let k = 0; k < totalQuant.length; k++){
        let x = totalPrices[k] * totalQuant[k]
        totalPrice += x
    }
    console.log(totalPrice)

    totalPriceElement.textContent = totalPrice
}

//Update the total quantity in the DOM
function updateTotalQuantity(){
    let totalQuantityElement = document.getElementById('totalQuantity')

    let totalQuantity = 0
    let allQuantEl = document.getElementsByClassName('cart__item__content__settings__quantity')

    for(let i of allQuantEl){
        totalQuantity += parseInt(i.firstChild.textContent.split(' ')[2])
    }

    console.log(totalQuantity)

    totalQuantityElement.textContent = totalQuantity
}

//display the corresponding product into the DOM
function displayProduct(product, i){
    //ADD article
    let article = document.createElement("article")
    article.className = "cart__item"
    article.setAttribute("data-id", product._id)
    article.setAttribute("data-color", i.color)

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
    p1.textContent = i.color
    
    let p2 = document.createElement("p")
    p2.className = 'item__price'
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
    p3.textContent = "Qté : " + i.quantity

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
}

//Check if the corresponding item according to id and color exists in local storage
function sameProduct(id, color){
    let actualBasket = _lsGet('basket')

    for(let i of actualBasket){
        if(i.id == id && i.color == color) return true
    }

    return false
}

//Return and item from local storage according to id and color
function findItemByIdAnColor(id, color){
    let actualBasket = _lsGet('basket')

    for(let i of actualBasket){
        console.log("TEST "+ i)
        if(i.id === id && i.color === color) return i
    }
}

//Changes the quantity of an item in basket local storage
function editQuantity(value, quant){
    let actualBasket = _lsGet('basket')

    for(let i of actualBasket){
        if(JSON.stringify(value) === JSON.stringify(i)) i.quantity = quant
    }

    _lsSet('basket', actualBasket)
}

//Add item in local storage
function _lsSet(key, val){
    try {
        localStorage.setItem(key, JSON.stringify(val))
        console.log("NEW ITEM ADDED IN LOCALSTORAGE\n"+ JSON.stringify(val))
    } catch (e) {
        console.error(e)
    }
}

//Get item from local storage
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