# Clown Detector
A Google Chrome extension that helps you spot silly LinkedIn jobs at a glance.

![](https://github.com/DominicMonares/clown-detector/blob/main/demo/top_card.png)

## Features
Any LinkedIn job that meets the user's criteria will be flagged with a clown emoji.

![](https://github.com/DominicMonares/clown-detector/blob/main/demo/browse.gif)

### Entry Level
Flag jobs that are explicitly listed as "entry level", yet require mid to senior levels of experience.

![](https://github.com/DominicMonares/clown-detector/blob/main/demo/entry_level_setting.gif)

Jobs not explicitly listed as "entry level" will not be flagged for years of experience required.

By default, the entry level threshold is set to flag jobs requiring 7+ years of experience. This can be set as low as 3+ years or disabled.

### Clownlist
Flag jobs that contain specific keywords.

![](https://github.com/DominicMonares/clown-detector/blob/main/demo/clownlist_setting.gif)

This will work for all jobs, regardless of experience level.

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
