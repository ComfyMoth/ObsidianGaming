---
tags:
  - Hub/Home
---
# Index
---
```dataviewjs

const {homePage} = customJS;
const note = {dv: dv, container: this.container, window: window};

homePage.renderHubs(note);
```

# Overview
---
```dataviewjs
await dv.view("taskido", {
	pages: "",
	forward: true,
	options: "noCounters noQuickEntry noHeader noDone"
})
```