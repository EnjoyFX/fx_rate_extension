let contentScriptPorts = {};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.active) {
        if (contentScriptPorts[tabId]) {
            chrome.storage.local.get(['currencyRate'], function(result) {
                let rate = result.currencyRate || 25;
                contentScriptPorts[tabId].postMessage({ type: 'setCurrencyRate', rate: rate });
            });
        }
    }
});

chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === "content-script") {
        let tabId = port.sender.tab.id;
        contentScriptPorts[tabId] = port;
        port.onDisconnect.addListener(function() {
            delete contentScriptPorts[tabId];
        });
    }
});
