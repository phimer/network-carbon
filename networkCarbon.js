const { co2 } = require('@tgwf/co2')
var argv = require('minimist')(process.argv.slice(2));


const handleUserInput = (argv) => {
    
    let model = argv.model
    let green = argv.green
    let bytes = argv.bytes

    if (model === undefined) {
        console.log("Model was not specified. Using model 'swd'. Specify model with --model.");
        model = 'swd'
    } else if (model !== 'swd' && model !== '1byte') {
        console.log("Model input is not allowed. Only viable parameters are swd and 1byte.");
        process.exit(0)
    }

    if (green === undefined) {
        console.log("Green host was not specified. Using non green host as standard value. Specify greenhost with --green.");
        green = false
    } else if (green !== 'true' && green !== 'false') {
        console.log("Green host input not allowed. Input has to be true or false.")
        process.exit(0)
    }

    if (bytes === undefined || isNaN(bytes)) {
        console.log("Bytes to measure has to be specified and has to be a number. Use --bytes. Example: --bytes 100");
        process.exit(0)
    }

    bytes = parseInt(bytes)
    green = (green === 'true') ? true : false
    return {model: model,
            green: green,
            bytes: bytes}
}

const calcEmissions = (greenHost=false, modelType='swd', bytes) => {

    let model = {}
    if (modelType == '1byte') {
        model = new co2({ model: "1byte"})
    } else {
        model = new co2({ model: "swd"})
    }

    const emissions = model.perByte(bytes, greenHost)
    
    return emissions
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const printEmissions = (emissions, modelType, greenHost, bytes) => {

    console.log (
        `Sending ${numberWithCommas(bytes)} bytes had a carbon footprint of ${emissions.toFixed(3)} grams of CO2.`
        + `\n(Using the ${modelType} model and a ${greenHost? 'green' : 'non-green'} webhost)`
      );
}

let input = handleUserInput(argv)
let emissions = calcEmissions(input.green, input.model, input.bytes)
printEmissions(emissions, input.model, input.green, input.bytes)

