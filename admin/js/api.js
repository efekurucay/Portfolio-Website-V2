// Admin Panel Functions
const adminAPI = {
    // Projects
    async getAllProjects() {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        return projects;
    },

    async createProject(project) {
        const projects = await this.getAllProjects();
        project.id = Date.now().toString();
        project.createdAt = new Date().toISOString();
        
        // Handle tags
        if (project.tags) {
            const existingTags = await this.getAllTags();
            const newTags = project.tags.filter(tag => 
                !existingTags.some(t => t.name.toLowerCase() === tag.toLowerCase())
            );
            
            // Create new tags
            for (const tagName of newTags) {
                await this.createTag({ name: tagName });
            }
        }
        
        projects.push(project);
        localStorage.setItem('projects', JSON.stringify(projects));
        return project;
    },

    async updateProject(id, projectData) {
        let projects = await this.getAllProjects();
        const index = projects.findIndex(p => p.id === id);
        if (index !== -1) {
            projects[index] = { ...projects[index], ...projectData };
            localStorage.setItem('projects', JSON.stringify(projects));
            return projects[index];
        }
        throw new Error('Project not found');
    },

    async deleteProject(id) {
        let projects = await this.getAllProjects();
        projects = projects.filter(p => p.id !== id);
        localStorage.setItem('projects', JSON.stringify(projects));
    },

    // Blog Posts
    async getAllPosts() {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        return posts;
    },

    async createPost(post) {
        const posts = await this.getAllPosts();
        post.id = Date.now().toString();
        post.createdAt = new Date().toISOString();
        
        // Handle tags
        if (post.tags) {
            const existingTags = await this.getAllTags();
            const newTags = post.tags.filter(tag => 
                !existingTags.some(t => t.name.toLowerCase() === tag.toLowerCase())
            );
            
            // Create new tags
            for (const tagName of newTags) {
                await this.createTag({ name: tagName });
            }
        }
        
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
        return post;
    },

    async updatePost(id, postData) {
        let posts = await this.getAllPosts();
        const index = posts.findIndex(p => p.id === id);
        if (index !== -1) {
            posts[index] = { ...posts[index], ...postData };
            localStorage.setItem('posts', JSON.stringify(posts));
            return posts[index];
        }
        throw new Error('Post not found');
    },

    async deletePost(id) {
        let posts = await this.getAllPosts();
        posts = posts.filter(p => p.id !== id);
        localStorage.setItem('posts', JSON.stringify(posts));
    },

    // Experience
    async getAllExperience() {
        const experience = JSON.parse(localStorage.getItem('experience') || '[]');
        return experience;
    },

    async createExperience(exp) {
        const experience = await this.getAllExperience();
        exp.id = Date.now().toString();
        experience.push(exp);
        localStorage.setItem('experience', JSON.stringify(experience));
        return exp;
    },

    async updateExperience(id, expData) {
        let experience = await this.getAllExperience();
        const index = experience.findIndex(e => e.id === id);
        if (index !== -1) {
            experience[index] = { ...experience[index], ...expData };
            localStorage.setItem('experience', JSON.stringify(experience));
            return experience[index];
        }
        throw new Error('Experience not found');
    },

    async deleteExperience(id) {
        let experience = await this.getAllExperience();
        experience = experience.filter(e => e.id !== id);
        localStorage.setItem('experience', JSON.stringify(experience));
    },

    // Education
    async getAllEducation() {
        const education = JSON.parse(localStorage.getItem('education') || '[]');
        return education;
    },

    async createEducation(edu) {
        const education = await this.getAllEducation();
        edu.id = Date.now().toString();
        education.push(edu);
        localStorage.setItem('education', JSON.stringify(education));
        return edu;
    },

    async updateEducation(id, eduData) {
        let education = await this.getAllEducation();
        const index = education.findIndex(e => e.id === id);
        if (index !== -1) {
            education[index] = { ...education[index], ...eduData };
            localStorage.setItem('education', JSON.stringify(education));
            return education[index];
        }
        throw new Error('Education not found');
    },

    async deleteEducation(id) {
        let education = await this.getAllEducation();
        education = education.filter(e => e.id !== id);
        localStorage.setItem('education', JSON.stringify(education));
    },

    // Skills
    async getAllSkills() {
        const skills = JSON.parse(localStorage.getItem('skills') || '[]');
        return skills;
    },

    async createSkill(skill) {
        const skills = await this.getAllSkills();
        skill.id = Date.now().toString();
        skills.push(skill);
        localStorage.setItem('skills', JSON.stringify(skills));
        return skill;
    },

    async updateSkill(id, skillData) {
        let skills = await this.getAllSkills();
        const index = skills.findIndex(s => s.id === id);
        if (index !== -1) {
            skills[index] = { ...skills[index], ...skillData };
            localStorage.setItem('skills', JSON.stringify(skills));
            return skills[index];
        }
        throw new Error('Skill not found');
    },

    async deleteSkill(id) {
        let skills = await this.getAllSkills();
        skills = skills.filter(s => s.id !== id);
        localStorage.setItem('skills', JSON.stringify(skills));
    },

    // Tags
    async getAllTags() {
        const tags = JSON.parse(localStorage.getItem('tags') || '[]');
        return tags;
    },

    async createTag(tag) {
        const tags = await this.getAllTags();
        tag.id = Date.now().toString();
        tags.push(tag);
        localStorage.setItem('tags', JSON.stringify(tags));
        return tag;
    },

    async deleteTag(id) {
        let tags = await this.getAllTags();
        tags = tags.filter(t => t.id !== id);
        localStorage.setItem('tags', JSON.stringify(tags));
    },

    // File Upload
    async uploadFile(file, type = 'image') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const fileName = `${Date.now()}-${file.name}`;
                    const files = JSON.parse(localStorage.getItem('files') || '[]');
                    const fileData = {
                        id: Date.now().toString(),
                        name: fileName,
                        type: type,
                        data: e.target.result,
                        uploadedAt: new Date().toISOString()
                    };
                    files.push(fileData);
                    localStorage.setItem('files', JSON.stringify(files));
                    resolve(fileData);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('File reading failed'));
            reader.readAsDataURL(file);
        });
    },

    async getAllFiles() {
        const files = JSON.parse(localStorage.getItem('files') || '[]');
        return files;
    },

    async deleteFile(id) {
        let files = await this.getAllFiles();
        files = files.filter(f => f.id !== id);
        localStorage.setItem('files', JSON.stringify(files));
    },

    // Get items by tag
    async getItemsByTag(tag, type = 'all') {
        const projects = type === 'all' || type === 'projects' ? await this.getAllProjects() : [];
        const posts = type === 'all' || type === 'posts' ? await this.getAllPosts() : [];
        
        const filteredProjects = projects.filter(p => 
            p.tags && p.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
        
        const filteredPosts = posts.filter(p => 
            p.tags && p.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
        
        return {
            projects: filteredProjects,
            posts: filteredPosts
        };
    }
};

// Export API functions
window.adminAPI = adminAPI;
