const id = new URL(window.location.href).searchParams.get('id')
console.log(window.location.href)
const addToCartBtn = document.getElementById('addToCart')
// let localStorage = Window.localStorage
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
            let selectedColor = selectEl.options[selectEl.selectedIndex].text
            console.log(product._id)
            console.log(selectedColor)
            console.log(quant.value)
            //check if a color and a quantity has been selected
            if(quant.value > 0 && selectedColor != "--SVP, choisissez une couleur --"){

                let dataArray = ["", "", ""]
                dataArray[0] = product._id
                dataArray[1] = selectedColor
                dataArray[2] = parseInt(quant.value)
                let key = product.name + ' ' +  dataArray[1] //define a key with the name and the color

                //check if this selection already exists in the cart
                if(sameProduct(product._id, selectedColor)){
                    let theSameProduct = JSON.parse(findItemByIdAnColor(product._id, selectedColor))
                    dataArray[2] = dataArray[2] + parseInt(theSameProduct[2])
                    console.log(`Added ${theSameProduct[2]} to the product ${theSameProduct[0]} and now he got ${dataArray[2]}`)

                    localStorage.removeItem(key)
                    localStorage.setItem(key, JSON.stringify(dataArray))
                }
                else{
                    localStorage.setItem(key, JSON.stringify(dataArray))
                }
            }
            else{
                console.log("No color or quantity provided !");
            }
        }
});

function sameProduct(id, color){
    for (var i = 0; i < localStorage.length; i++){
        let actualItem = localStorage.getItem(localStorage.key(i))
        console.log(JSON.parse(actualItem)[0] + "  " + id);
        console.log(JSON.parse(actualItem)[1] + "  " + color);
        if(JSON.parse(actualItem)[0] == id && JSON.parse(actualItem)[1] == color){
            console.log("item already in the cart !")
            return true;
        }
    }

    return false;
}

function findItemByIdAnColor(id, color){
    for (var i = 0; i < localStorage.length; i++){
        let actualItem = localStorage.getItem(localStorage.key(i))
        if(JSON.parse(actualItem)[0] === id && JSON.parse(actualItem)[1] === color){
            
            return actualItem;
        }
    }
}