// Query projects
const projects = dv.pages("#Project")
	.filter(project => !project.file.path.includes("📐 Templates"))
	.filter(project => project.status != '#🚧/🟥')
	.filter(project => project.status != '#🚧/🟩')
	.filter(project => !project.status.includes('🚩'));

// Query project milestones and map them to project.file.name
const milestones = dv.pages("#Project/Milestone") 
    .filter(milestone => !milestone.file.path.includes("📐 Templates"))
	.filter(milestone => milestone.status != '#🚩/🟥') 
	.filter(milestone => milestone.status != '#🚩/🟩');

const milestone_map = {};
for (const milestone of milestones) {
	const project = milestone.project.path.split("/")[1].replace(".md", "")
	if (!milestone_map.hasOwnProperty(project)) {
		milestone_map[project] = [];
	}
	milestone_map[project].push(milestone)
}

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

projects.forEach(project => {
	const status = project.status.replace('#🚧/', '');
	const title = project.file.name.replace('🚧', status);
	const link = `
		<a data-tooltip-position="top" 
			aria-label="${project.file.path}" 
			data-href="${project.file.path}" 
			href="${project.file.path}" 
			class="internal-link" 
			target="_blank" 
			style="font-weight: bold; font-size: 20; text-decoration: none"
			rel="noopener">${title}
		</a>`

	// Find amount of tasks / completed tasks
	const project_milestones = milestone_map[project.file.name] || [];
	const milestone_tasks = project_milestones.flatMap(milestone => milestone.file.tasks.values);
	const total_milestone_tasks = milestone_tasks.length;
	const total_finished_milestone_tasks = milestone_tasks.filter(task => task.fullyCompleted === true).length;
	
	const project_tasks = project.file.tasks.length;
	const finished_project_tasks = project.file.tasks.where((task) => task.fullyCompleted === true).length;

	const total_tasks = project_tasks + total_milestone_tasks;
	const total_finished_tasks = finished_project_tasks + total_finished_milestone_tasks;

	// Calculate the progress percentage 
	const project_max = total_tasks || 1; 
	const project_progress = total_finished_tasks || 0; 
	const project_percent = Math.round((project_progress / project_max) * 100) || 0;

	// Create the progress bar element 
	const progress_bar = ` 
		<progress 
			style="width: 100%;" 
			value="${project_progress}" 
			max="${project_max}">
		</progress> `; 

	// Create labels
	const progress_label = `<div style="text-align: center; margin-top: 5px;">${project_percent}% completed</div>`;
	const description_label = project.description ? `<div style="margin-top: 15px;">${project.description}</div>` : '';

    // Create blocks
	blocks += `
		<div style="${block_style}">
			${link}
			${progress_bar}
			${progress_label}
			${description_label}
		</div>
	`;
});

const table_content_style = `
	padding: 10px; 
	display: flex; 
	flex-wrap: wrap;
`;

let table_content = `<div style="${table_content_style}">${blocks}</div>`;
let root = await dv.el("div", table_content);