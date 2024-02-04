document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['currencyRate'], function(result) {
        let rate = result.currencyRate;
		console.log('Received rate from storage:', rate);
        let rateInput = document.getElementById('rate');
        rateInput.value = rate || 37;
    });

    const saveButton = document.getElementById('save');
    saveButton.addEventListener('click', function() {
        let rateInput = document.getElementById('rate');
        let rate = parseFloat(rateInput.value);

        chrome.storage.local.set({ currencyRate: rate }, function() {
            console.log('Saved rate to storage:', rate);

            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                const activeTab = tabs[0];
				try {
					chrome.tabs.sendMessage(activeTab.id, { type: 'setCurrencyRate', rate: rate });
				}
				catch(error) {
					console.error("Error: " + error.message); 
				}
                
            });

            window.close();
        });
    });
});
