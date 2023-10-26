class homePage {

    renderHubs(n) {
        // Gather components.
        const dv = n.dv;
        const current = dv.current();

        // Query and sort hubs.
        const groupedTags = {};
        const hubs = dv.pages("#Hub");
        hubs.forEach(hub => {
            // Retrieve relevant tags.
            let tags = hub.tags;
            const name = hub.file.name;
            const path = hub.file.path;
            if (Array.isArray(tags)) {
                tags = tags.find(tag => tag.includes("Hub"));
            }

            // Sort tags into groups.
            const tagParts = tags.split("/").slice(1);
            let currentGroup = groupedTags;
            tagParts.forEach(tagPart => {
                if (currentGroup[tagPart] == null) {
                    currentGroup[tagPart] = {};
                }
                currentGroup = currentGroup[tagPart];
            });

            // Add the hub to the group.
            currentGroup["name"] = name;
            currentGroup["path"] = path;
        });

        // Recursively create bullet list.
        dv.span(this.createBulletList(groupedTags));
    }

    createBulletList(tagGroup, depth = 0) {
        const indent = '    '.repeat(depth);
        const tags = Object.keys(tagGroup).sort();

        const bulletList = tags.map(tag => {
            let subBulletList;
            const subTags = tagGroup[tag];
            if (tag != "name" && tag != "path") {
                subBulletList = this.createBulletList(subTags, depth + 1);
                const name = subTags["name"];
                const path = subTags["path"];
                return `${indent}* [[${name}]]\n${subBulletList}`;
            }
        }).join('\n');

        return bulletList;
    };
}