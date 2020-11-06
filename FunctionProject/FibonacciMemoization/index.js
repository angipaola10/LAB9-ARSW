var bigInt = require("big-integer");
let fibonacciList = []
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let nth = req.body.nth
    let nth_1 = bigInt.one;
    let nth_2 = bigInt.zero;
    let answer = bigInt.zero;

    let fibonacci = (n) =>{
        if (fibonacciList[n] != -1){
            return fibonacciList[n];
        }else{
            if (n === 0){
                return nth_2;
            }
            else if (n === 1){
                return nth_1;
            }else{
                fibonacciList[n] = fibonacci(n-1).add(fibonacci(n-2));
                return fibonacciList[n];
            }
        }
        
    }
    if (nth < 0)
        throw 'must be greater than 0'
    else{
        if (nth <= fibonacciList.length){
            answer = fibonacciList[nth];
        }
        else{
            fibonacciList = []
            fibonacciList = new Array(nth+1).fill(-1);
            answer = fibonacci(nth);
        }
        
    }
    context.res = {
        body: answer.toString()
    };
}