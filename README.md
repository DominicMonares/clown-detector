# Clown Detector
A Google Chrome extension that helps you spot silly LinkedIn jobs at a glance.

## Features
Any LinkedIn job that meets the user's criteria will be flagged with a clown emoji.

DEMO IMAGE HERE

### Entry Level
Flag jobs that are explicitly listed as "entry level", yet require mid to senior levels of experience.

DEMO GIF HERE

Jobs not explicitly listed as "entry level" will not be flagged for years of experience required.

By default, the entry level threshold is set to flag jobs requiring 7+ years of experience. This can be set as low as 3+ years or disabled.

### Clownlist
Flag jobs that contain specific keywords.

DEMO GIF HERE

This will work for all jobs, regardless of experience level.

### Settings
Adjust settings from the extension popup.

DEMO GIF HERE

## Installation
```
npm install
```

## Usage
### Full Browser Development
```
npm run build
```
[Load build into Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)

### React Popup Styling Development Only
```
npm start
```

## Disclaimer
Clown Detector is **only** meant to save people time by flagging LinkedIn jobs that will likely waste the user's time, per the user's settings. I do **NOT** condone any form of harassment toward companies flagged by Clown Detector or their employees. Please be cool!

Clown Detector should be taken with a grain of salt, particularly with the entry level settings. Not every entry level job flagged is worth skipping over. There are many factors to consider when you come across these posts and they may be worth checking out - go with your gut!

Clown Detector does not require, use, or collect any personal user information.
