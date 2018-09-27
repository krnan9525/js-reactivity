const { beReactive, setWatcher } = require('./lib/reactive')

let product = {
  beer: {
    price: 20,
    amount: 3
  }
}

beReactive(product)

let totalPrice = {}
// totalPrice.beer = product.beer.amount * product.beer.price

setWatcher(() => {totalPrice.beer = product.beer.amount * product.beer.price})

console.log(totalPrice)

product.beer.amount = 10

console.log(totalPrice)
