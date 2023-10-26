class pageTemplates {

    renderTemplateList(n) {
        // Gather components.
        const dv = n.dv;
        const current = dv.current();

        // Pages
        const pages = dv.pages('"📐 Templates"');

        // Group pages by page.file.path path.
        const groupedPages = {};
        pages.forEach((page) => {
            const pathSegments = page.file.path.split('/');
            if (pathSegments.length > 1) {
                const groupName = pathSegments[1]; // Assuming the second segment is the group name.
                if (!groupedPages[groupName]) {
                    groupedPages[groupName] = [];
                }
                groupedPages[groupName].push(page.file.link);
            }
        });

        // Create the bullet list
        const bulletList = [];
        for (const groupName in groupedPages) {
            const groupItems = groupedPages[groupName];
            dv.header(4, groupName);
            groupItems.forEach((item) => {
                dv.span(`* ${item}`);
            });
        }
    }
}