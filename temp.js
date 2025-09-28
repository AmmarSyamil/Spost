let x = [1,2,3,4,5,6,7,8,9,10]
let y = 10

// console.log(x/y)
// console.log(toString(x.reduce))
// console.log(x.reduce((a, b) => a + b, 0)/x.length)

if (x.length % 5==0) {
  console.log("tes")
}

// const data = new Map(
  // []
// );/

const data = new Map([
  ["scroll_time", 0],
  ["scroll_diff", new Map(
    [
      ["values", []],
      ["classification", []],
      ["at", []]
    ]
  )]
])