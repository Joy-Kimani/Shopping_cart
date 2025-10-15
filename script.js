document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.getElementsByClassName('.addItem');
    const cart = document.getElementsByClassName('.cart');

    buttons.array.forEach(button => {
        button.addEventListener('click',(e)=>{
            const product = e.target.parentElement;
            const name = product.queryselector('h6').textContent;
            const price = product.getElementsByClassName('.price').textContent;

            //create a list item for the cart
            const li = document.createElement('li');
            li.textContent = `${name}` - `${price}`;

            //add to cart
            cart.appendChild(li);

        })
        
    });

});
