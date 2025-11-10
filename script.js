
const cartBtn = document.querySelector('.cart-button');

cartBtn.addEventListener('click', () => {

    cartBtn.classList.add('clicked');

    // Optional
    // setTimeout(() => {
    //     cartBtn.classList.remove('clicked');
    // }, 3000);

});
