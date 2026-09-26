const fs = require('fs');
let c = fs.readFileSync('client/src/components/ProductCard.jsx', 'utf8');

const oldDispatch = `dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1
    }));`;

const newDispatch = `dispatch(addToCart({
      product: product,
      quantity: 1
    }));`;

c = c.replace(oldDispatch, newDispatch);

fs.writeFileSync('client/src/components/ProductCard.jsx', c);
console.log('ProductCard updated with correct addToCart payload.');
