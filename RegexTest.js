const returnedPrice = extractAdditionalPrice('2.2GHz selectedHDDText: 400 GB [+100.00]');
console.log(returnedPrice + 1)

function extractAdditionalPrice(fullText) {
    // selectedHDDText: 400 GB [+100.00]
    const regex = /\+\d+\.\d+/g;
    const matches = fullText.match(regex);
    return Number(matches[0].replace('+', ''));
}