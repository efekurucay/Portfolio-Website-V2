// Content yönetimi için class
class ContentManager {
    constructor() {
        // Initialize content storage
        this.content = {
            experience: [],
            education: [],
            skills: [{
                name: "Programming Languages",
                skills: [
                    { name: "JavaScript" },
                    { name: "Python" },
                    { name: "Java" },
                    { name: "C#" }
                ]
            }],
            projects: [],
            blogPosts: [],
            categories: {
                project: [],
                blog: []
            }
        };
        
        // Load content on initialization
        this.loadContent();
        
        // Initialize content sections
        this.initializeExperienceEducation();
        this.initializeSkills();
        this.initializeProjects();
        this.initializeBlog();
    }
    
    // Load content from localStorage
    loadContent() {
        const savedContent = localStorage.getItem('siteContent');
        if (savedContent) {
            this.content = JSON.parse(savedContent);
        }
    }
    
    // Save content to localStorage
    saveContent() {
        localStorage.setItem('siteContent', JSON.stringify(this.content));
    }
    
    // Experience & Education Section
    initializeExperienceEducation() {
        const experienceTimeline = document.getElementById('experience-timeline');
        const educationTimeline = document.getElementById('education-timeline');
        
        if (experienceTimeline) {
            this.renderTimeline(experienceTimeline, this.content.experience);
        }
        
        if (educationTimeline) {
            this.renderTimeline(educationTimeline, this.content.education);
        }
    }
    
    renderTimeline(container, items) {
        container.innerHTML = items.map(item => `
            <div class="timeline-item" data-aos="fade-up">
                <h4>${item.title}</h4>
                <p class="timeline-place">${item.place}</p>
                <p class="timeline-date">${item.date}</p>
                <p class="timeline-description">${item.description}</p>
            </div>
        `).join('');
    }
    
    // Skills Section
    initializeSkills() {
        const skillsContainer = document.querySelector('.skills-container');
        if (skillsContainer) {
            this.renderSkills(skillsContainer);
        }
    }
    
    renderSkills(container) {
        container.innerHTML = this.content.skills.map(category => `
            <div class="skill-category" data-aos="fade-up">
                <h3>${category.name}</h3>
                <div class="skill-list">
                    ${category.skills.map(skill => `
                        <div class="skill-item">
                            <div class="skill-name">
                                <span>${skill.name}</span>
                                <span>${skill.level}%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress" style="width: ${skill.level}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    
    // Projects Section
    initializeProjects() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            this.renderProjects(projectsGrid);
        }
    }
    
    renderProjects(container) {
        container.innerHTML = this.content.projects.map(project => `
            <div class="project-card" data-aos="fade-up">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-overlay">
                        <div class="project-links">
                            <a href="${project.github}" target="_blank" class="project-link">
                                <i class="fab fa-github"></i>
                            </a>
                            ${project.demo ? `
                                <a href="${project.demo}" target="_blank" class="project-link">
                                    <i class="fas fa-external-link-alt"></i>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Blog Section
    initializeBlog() {
        const latestPosts = document.getElementById('latest-posts');
        if (latestPosts) {
            this.renderLatestPosts(latestPosts);
        }
    }
    
    renderLatestPosts(container) {
        const latest = this.content.blogPosts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
            
        container.innerHTML = latest.map(post => `
            <div class="card" data-aos="fade-up">
                <img src="${post.image}" alt="${post.title}" class="card-image">
                <div class="card-content">
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-description">${post.excerpt}</p>
                    <div class="card-tags">
                        ${post.tags.map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                    <a href="blog/${post.slug}" class="btn btn-primary">Read More</a>
                </div>
            </div>
        `).join('');
    }
    
    // Content Management Methods
    addExperience(experience) {
        this.content.experience.push(experience);
        this.saveContent();
        this.initializeExperienceEducation();
    }
    
    addEducation(education) {
        this.content.education.push(education);
        this.saveContent();
        this.initializeExperienceEducation();
    }
    
    addSkill(categoryName, skill) {
        const category = this.content.skills.find(c => c.name === categoryName);
        if (category) {
            category.skills.push(skill);
        } else {
            this.content.skills.push({
                name: categoryName,
                skills: [skill]
            });
        }
        this.saveContent();
        this.initializeSkills();
    }
    
    addProject(project) {
        this.content.projects.push(project);
        project.tags.forEach(tag => {
            if (!this.content.categories.project.includes(tag)) {
                this.content.categories.project.push(tag);
            }
        });
        this.saveContent();
        this.initializeProjects();
    }
    
    addBlogPost(post) {
        this.content.blogPosts.push(post);
        post.tags.forEach(tag => {
            if (!this.content.categories.blog.includes(tag)) {
                this.content.categories.blog.push(tag);
            }
        });
        this.saveContent();
        this.initializeBlog();
    }
    
    // Filter Methods
    filterProjects(tag) {
        if (!tag) return this.content.projects;
        return this.content.projects.filter(project => 
            project.tags.includes(tag)
        );
    }
    
    filterBlogPosts(tag) {
        if (!tag) return this.content.blogPosts;
        return this.content.blogPosts.filter(post => 
            post.tags.includes(tag)
        );
    }
    
    // Get Methods
    getProject(slug) {
        return this.content.projects.find(project => project.slug === slug);
    }
    
    getBlogPost(slug) {
        return this.content.blogPosts.find(post => post.slug === slug);
    }
    
    getProjectCategories() {
        return this.content.categories.project;
    }
    
    getBlogCategories() {
        return this.content.categories.blog;
    }
}

// Initialize Content Manager
const contentManager = new ContentManager();

// Export for use in other files
window.contentManager = contentManager;
