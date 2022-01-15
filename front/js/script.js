fetch('http://localhost:3000/api/products')
  .then(response => response.json())
  .then(data => {
      const section = document.getElementById('items')
      for(let i of data){
        let a = document.createElement('a')
        a.href = './product.html?id=' + i._id;
        let article = document.createElement('article')
        let img = document.createElement('img')
        img.src = i.imageUrl;
        img.alt = i.altTxt;
        let h3 = document.createElement('h3')
        h3.textContent = i.name;
        let p = document.createElement('p')
        p.textContent = i.description;

        section.appendChild(a).appendChild(article).append(img, h3, p);
      }
  });