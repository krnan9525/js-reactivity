const { beReactive, setWatcher } = require('./lib/reactiveWithProxy')

let product = {
  beer: {
    price: 20,
    amount: 3
  }
}

const productReactive = beReactive(product)

let totalPrice = {}

setWatcher(() => {totalPrice.beer = productReactive.beer.amount * productReactive.beer.price})

console.log(totalPrice)

productReactive.beer.amount = 10

console.log(totalPrice)

productReactive.tea = {amount: 10, price: 10}

setWatcher(() => {totalPrice.tea = productReactive.tea.amount * productReactive.tea.price})

console.log(totalPrice)

productReactive.tea.amount = 100

console.log(totalPrice)
