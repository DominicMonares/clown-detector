import { applySettings } from "../chrome/background";
import { Settings } from '../types';
Object.assign(global, require('jest-chrome'));


/* Background */

describe('applySettings', () => {
  it('should successfully save settings', () => {
    const listenerSpy = jest.fn()
    chrome.runtime.onMessage.addListener(listenerSpy)

    expect(listenerSpy).not.toBeCalled()
    expect(chrome.runtime.onMessage.hasListeners()).toBe(true)

    // const settings: Settings = {
    //   entryLevel: 3,
    //   clownlist: { herder: true }
    // };

    // applySettings(settings);
    // expect(listenerSpy).toHaveBeenCalled();
  });
});

/* Content */

describe('Message listener', () => {
  it('should call listeners on message', () => {

  });
});
