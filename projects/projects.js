// Projects Management
class ProjectsManager {
    constructor() {
        this.projects = [];
        this.tags = [];
        this.currentTag = 'all';
        
        // DOM Elements
        this.projectsGrid = document.getElementById('projectsGrid');
        this.tagFilters = document.getElementById('tagFilters');
        
        this.initialize();
    }
    
    async initialize() {
        await this.loadProjects();
        this.loadTags();
        this.setupEventListeners();
        this.renderProjects();
    }
    
    async loadProjects() {
        try {
            const projects = await this.fetchProjects();
            this.projects = projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = [];
        }
    }
    
    async fetchProjects() {
        // Replace with actual API call when backend is ready
        return JSON.parse(localStorage.getItem('projects') || '[]');
    }
    
    loadTags() {
        // Get unique tags from all projects
        const tagSet = new Set();
        this.projects.forEach(project => {
            project.tags?.forEach(tag => tagSet.add(tag));
        });
        this.tags = Array.from(tagSet);
        
        // Render tag filters
        this.renderTagFilters();
    }
    
    setupEventListeners() {
        // Tag filter clicks
        this.tagFilters.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag-filter')) {
                const tag = e.target.dataset.tag;
                this.filterByTag(tag);
            }
        });
    }
    
    filterByTag(tag) {
        this.currentTag = tag;
        
        // Update active state
        const filters = this.tagFilters.querySelectorAll('.tag-filter');
        filters.forEach(filter => {
            filter.classList.toggle('active', filter.dataset.tag === tag);
        });
        
        this.renderProjects();
    }
    
    getFilteredProjects() {
        if (this.currentTag === 'all') {
            return this.projects;
        }
        return this.projects.filter(project => 
            project.tags?.includes(this.currentTag)
        );
    }
    
    renderTagFilters() {
        const html = this.tags.map(tag => `
            <button class="tag-filter" data-tag="${tag}">
                ${tag}
            </button>
        `).join('');
        
        // Insert after "All" button
        const allButton = this.tagFilters.querySelector('[data-tag="all"]');
        allButton.insertAdjacentHTML('afterend', html);
    }
    
    renderProjects() {
        const filteredProjects = this.getFilteredProjects();
        
        if (filteredProjects.length === 0) {
            this.projectsGrid.innerHTML = `
                <div class="no-projects">
                    <h3>No projects found</h3>
                    <p>Try selecting a different tag</p>
                </div>
            `;
            return;
        }
        
        this.projectsGrid.innerHTML = filteredProjects.map(project => 
            this.createProjectCard(project)
        ).join('');
    }
    
    createProjectCard(project) {
        return `
            <article class="project-card" data-aos="fade-up">
                <img src="${project.image || '../img/project-placeholder.jpg'}" 
                     alt="${project.title}" 
                     class="project-image">
                <div class="project-content">
                    <h2 class="project-title">
                        <a href="/projects/${project.id}">${project.title}</a>
                    </h2>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags?.map(tag => `
                            <span class="project-tag">${tag}</span>
                        `).join('') || ''}
                    </div>
                    <div class="project-links">
                        ${project.link ? `
                            <a href="${project.link}" class="project-link" target="_blank">
                                <i class="fas fa-external-link-alt"></i>
                                <span>Live Demo</span>
                            </a>
                        ` : ''}
                        ${project.github ? `
                            <a href="${project.github}" class="project-link" target="_blank">
                                <i class="fab fa-github"></i>
                                <span>Source Code</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </article>
        `;
    }
}

// Initialize projects
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsManager();
});
