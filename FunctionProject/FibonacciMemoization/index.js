var bigInt = require("big-integer");
let fibonacciMap = new Map()
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let nth = req.body.nth
    let nth_1 = bigInt.one;
    let nth_0 = bigInt.zero;
    let answer = bigInt.zero;

    let fibonacci = (n) =>{
        if(!fibonacciMap.has(n) && fibonacciMap.has(n-1)){
            fibonacciMap.set(n,fibonacciMap.get(n-1).add(fibonacciMap.get(n-2)));
        }else if (!fibonacciMap.has(n)){
            fibonacciMap.set(n,fibonacci(n-1).add(fibonacci(n-2)));
        }return fibonacciMap.get(n);
    }
        
    if (nth < 0)
        throw 'must be greater than 0'
    else{
        if (fibonacciMap.has(nth)){
            answer = fibonacciMap.get(nth);
        }
        else{
            fibonacciMap = new Map()
            fibonacciMap.set(0,nth_0);
            fibonacciMap.set(1,nth_1);
            answer = fibonacci(nth);
        }
        
    }
    context.res = {
        body: answer.toString()
    };
}