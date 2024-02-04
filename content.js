let currencyRate;

let port = chrome.runtime.connect({name: "content-script"});

port.onMessage.addListener(function(msg) {
    if (msg.type === 'setCurrencyRate') {
        currencyRate = msg.rate;
    }
});


function extractNumbersFromString(str) {
    try {
        const matches = str.match(/[\d.]+/g);
        if (matches) {
            return matches.map(Number);
        } else {
            return null;
        }
    } catch (error) {
        console.error(error.message);
        return null
    }
}

/* function identifyCurrency(str, defaultValue = "USD") {
    let candidate = str.toString().toLowerCase();
    if (/грн|UAH/i.test(candidate)) {
        return "UAH";
    }
    else if (/usd|dol|\$/i.test(candidate)) {
        return "USD";
    }
    else {
        return defaultValue;
    }
} */
 
document.addEventListener('mouseover', function(e) {
  const target = e.target;
  let text = target.textContent;
  let number_candidate = extractNumbersFromString(text);
  if (number_candidate) {
    if (number_candidate.length < 5){
        let lines = []
        for (let cur of number_candidate) {
            cur = parseFloat(cur);
            if (!isNaN(cur)){
                let multipliedValue = cur * currencyRate;
                let line = `$${cur} x ${currencyRate} = ${multipliedValue.toFixed(2)} UAH`;
                lines.push(line);
            }
        }
        // tooltip set:
        lines.push(`(rate = ${currencyRate} UAH/USD)`);
        target.title = lines.join("\n");
    }
  } else {
    // target.title = `${number_candidate} Cursor over element: ${target.tagName}, id: ${target.id}`;
  }
});


// eslint-disable-next-line no-unused-vars
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'setCurrencyRate') {
        const newRate = request.rate;
        currencyRate = newRate;
    }
});



