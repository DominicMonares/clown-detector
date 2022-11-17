chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      urlUpdated: true
    });
  }
  // chrome.action.setIcon({ path: '../assets/disabled_icon.png' });
});

// chrome.tabs.onActivated.addListener(info => {
//   console.log('WTFFFF ', info)
//   // chrome.tabs.get(info.tabId, change => {
//   //   const matching = false;
//   //   console.log('HEY PETER ', info)

//   //   if (matching) {
//   //     chrome.action.setIcon({ path: '../assets/disabled_icon.png', tabId: info.tabId});
//   //     return;
//   //   } else {
//   //     chrome.action.setIcon({ path: '../assets/clown.png', tabId: info.tabId});
//   //   }
//   // })
// });

chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.url.includes('https://www.linkedin.com/jobs/search/?currentJobId')) {
      console.log('SUCCESS ', msg.id, tabs[0]['id'])
      chrome.action.setIcon({ tabId: tabs[0]['id'], path: '/active_icon-32.png' });
    } else {
      console.log('FAIL')
      chrome.action.setIcon({ path: '/disabled_icon-32.png' });
    }
  })
});

export {};
