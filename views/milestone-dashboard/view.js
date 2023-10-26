let {project} = input;

// Query milestones
const milestones = dv.pages("#Project/Milestone") 
    .filter(milestone => !milestone.file.path.includes("📐 Templates"))
	.filter(milestone => milestone.status != '#🚩/🟥') 
	.filter(milestone => milestone.status != '#🚩/🟩') 
	.filter(milestone => milestone.project != null)
	.filter(milestone => project == null || milestone.project.path.includes(project));

let blocks = '';
const block_count = 5;
const block_style = `
	color: rgb(237, 78, 96); 
	background-color: rgb(9, 11, 19); 
	
	width: calc(${100 / block_count}% - 20px);
	height: 250; 
	margin: 10px; 
	padding: 20px; 
	
    overflow: auto;
	border-radius: 10px; 
	display: inline-block; 
	box-sizing: border-box; 
	border: 1px solid rgb(32, 37, 54); 
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); `;

const table_content_style = `
	padding: 10px; 
	display: flex; 
	flex-wrap: wrap;
`;

milestones.forEach(milestone => {
    const status = milestone.status.replace('#🚩/', '');
    const title = milestone.file.name.replace('🚩', status);
	const link = `
		<a data-tooltip-position="top" 
			aria-label="${milestone.file.path}" 
			data-href="${milestone.file.path}" 
			href="${milestone.file.path}" 
			class="internal-link" 
			target="_blank" 
			style="font-weight: bold; font-size: 18; text-decoration: none"
			rel="noopener">${title}
		</a>`

    const project_link = `
        <div style="margin-top: 15px;">
            <a data-tooltip-position="top"
                aria-label="${milestone.project.path}"
                data-href="${milestone.project.path}"
                href="${milestone.project.path}"
                class="internal-link"
                target="_blank"
                style="text-decoration: none"
                rel="noopener">${milestone.project.path.split("/")[1].replace(".md", "")}
            </a>
        </div>
        
        <hr style={{ borderTop: '1px solid #000', width: '50%', margin: '10px auto' }} />`;

    // Find amount of tasks / completed tasks
    const milestone_tasks = milestone.file.tasks.length;
	const finished_milestone_tasks = milestone.file.tasks.where((task) => task.fullyCompleted === true).length;

    // Calculate the progress percentage 
	const milestone_max = milestone_tasks || 1; 
	const milestone_progress = finished_milestone_tasks || 0; 
	const milestone_percent = Math.round((milestone_progress / milestone_max) * 100) || 0;

	// Create the progress bar element 
	const progress_bar = ` 
		<progress 
			style="width: 100%;" 
			value="${milestone_progress}" 
			max="${milestone_max}">
		</progress> `; 

	// Create labels
	const progress_label = `<div style="text-align: center; margin-top: 5px;">${milestone_percent}% completed</div>`;
	const description_label = milestone.description ? `<div style="margin-top: 5px;">${milestone.description}</div>` : '';

    // Create blocks
    blocks += `
        <div style="${block_style}">
            ${link}
            ${progress_bar}
            ${progress_label}
            ${project_link}
            ${description_label}
        </div>
    `;
});

let table_content = `<div style="${table_content_style}">${blocks}</div>`;
let root = await dv.el("div", table_content);