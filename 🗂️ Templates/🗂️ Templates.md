---
Version: 1
tags:
  - Hub/Templates
---
```dataviewjs

const {pageTemplates} = customJS;
const note = {
	dv: dv, 
	container: this.container, 
	window: window,
};

pageTemplates.renderTemplateList(note);
```