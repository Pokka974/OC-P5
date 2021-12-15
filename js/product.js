const id = new URL(window.location.href).searchParams.get('id')
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
            let dataArray = ["", "", ""]
            dataArray[0] = product._id
            dataArray[1] = selectEl.options[selectEl.selectedIndex].text
            dataArray[2] = quant.value
            console.log(dataArray)
            localStorage.setItem("dataArray", JSON.stringify(dataArray))
        }
});
