import { findById } from '../../back/models/Product.js';

const id = new URL(window.location.href).searchParams.get('id');
const currObj = findById(id);

currObj.then((product) => {
    // ADD the image
    let imgItemEl = document.getElementsByClassName('item__img');
    let img = document.createElement('img')
    img.src = "../../back/images/" + product.imageUrl;
    imgItemEl[0].appendChild(img);

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
    let colors = product.colors;
    for(let c of colors){
        let newOption = document.createElement('option')
        newOption.value = c;
        let colorText = document.createTextNode(c);
        newOption.appendChild(colorText)
        selectEl.appendChild(newOption)
    }
});


