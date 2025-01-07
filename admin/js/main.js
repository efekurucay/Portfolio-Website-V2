// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const contentArea = document.querySelector('.content-area');
const themeToggle = document.querySelector('.theme-toggle');

// Theme Management
function initTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        const section = link.getAttribute('data-section');
        loadSectionContent(section);
    });
});

// Content Loading
async function loadSectionContent(section) {
    const contentArea = document.querySelector('.content-area');
    
    switch(section) {
        case 'dashboard':
            contentArea.innerHTML = generateDashboardContent();
            break;
        case 'profile':
            contentArea.innerHTML = generateProfileContent();
            initProfileHandlers();
            break;
        case 'about':
            loadAboutMe();
            break;
        case 'blog':
            contentArea.innerHTML = generateBlogContent();
            loadBlogPosts();
            break;
        case 'projects':
            contentArea.innerHTML = generateProjectsContent();
            loadGitHubProjects();
            break;
        // Add more sections as needed
    }
}

// Content Generators
function generateDashboardContent() {
    return `
        <h2>Dashboard</h2>
        <div class="dashboard-stats">
            <div class="stat-card">
                <i class="fas fa-project-diagram"></i>
                <div class="stat-info">
                    <h3>Projects</h3>
                    <p>12</p>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-blog"></i>
                <div class="stat-info">
                    <h3>Blog Posts</h3>
                    <p>8</p>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-code"></i>
                <div class="stat-info">
                    <h3>Skills</h3>
                    <p>15</p>
                </div>
            </div>
        </div>
    `;
}

function generateProfileContent() {
    return `
        <h2>Profile Management</h2>
        <div class="form-group">
            <label>Profile Image</label>
            <div class="profile-image-container">
                <img src="../assets/images/profile.jpg" alt="Profile" id="profile-preview">
                <input type="file" id="profile-image" accept="image/*" style="display: none;">
                <button class="btn btn-primary" onclick="document.getElementById('profile-image').click()">
                    <i class="fas fa-upload"></i> Change Profile Image
                </button>
            </div>
        </div>
        <div class="form-group">
            <label>Name</label>
            <input type="text" id="profile-name" value="Yahya Efe Kuruçay">
        </div>
        <div class="form-group">
            <label>Title</label>
            <input type="text" id="profile-title" value="Software Engineer">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea id="profile-description" rows="4">Building innovative solutions at the intersection of AI and software development. Currently working on TÜBİTAK projects and serving as a HUAWEI Student Developer Ambassador.</textarea>
        </div>
        <button class="btn btn-primary" id="save-profile-changes">
            <i class="fas fa-save"></i> Save Changes
        </button>
    `;
}

function loadAboutMe() {
    const content = `
        <div class="section-header">
            <h2>About Me Management</h2>
        </div>

        <div class="form-container">
            <div class="form-section">
                <h3>1. About Title</h3>
                <div class="form-group">
                    <input type="text" id="about-title" class="form-control">
                </div>

                <h3>2. Main Description</h3>
                <div class="form-group">
                    <textarea id="about-description" class="form-control" rows="6"></textarea>
                </div>

                <h3>3. Skill Cards</h3>
                <div class="skill-cards-editor">
                    <div class="card-item">
                        <h4>Card 1</h4>
                        <div class="form-group">
                            <input type="text" id="card1-title" class="form-control" placeholder="Card Title">
                            <textarea id="card1-description" class="form-control" rows="3" placeholder="Card Description"></textarea>
                        </div>
                    </div>

                    <div class="card-item">
                        <h4>Card 2</h4>
                        <div class="form-group">
                            <input type="text" id="card2-title" class="form-control" placeholder="Card Title">
                            <textarea id="card2-description" class="form-control" rows="3" placeholder="Card Description"></textarea>
                        </div>
                    </div>

                    <div class="card-item">
                        <h4>Card 3</h4>
                        <div class="form-group">
                            <input type="text" id="card3-title" class="form-control" placeholder="Card Title">
                            <textarea id="card3-description" class="form-control" rows="3" placeholder="Card Description"></textarea>
                        </div>
                    </div>

                    <div class="card-item">
                        <h4>Card 4</h4>
                        <div class="form-group">
                            <input type="text" id="card4-title" class="form-control" placeholder="Card Title">
                            <textarea id="card4-description" class="form-control" rows="3" placeholder="Card Description"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <button class="btn btn-primary" id="save-about-changes">
            <i class="fas fa-save"></i> Save Changes
        </button>
    `;

    document.querySelector('.content-area').innerHTML = content;

    // Load existing content from main page
    const aboutTitle = document.querySelector('#about .section-title')?.textContent || 'About Me';
    const aboutDescription = document.querySelector('.about-intro p')?.textContent || '';
    const cards = document.querySelectorAll('.info-card');

    // Set values in form
    document.getElementById('about-title').value = aboutTitle;
    document.getElementById('about-description').value = aboutDescription;

    // Set card values
    cards.forEach((card, index) => {
        const cardTitle = card.querySelector('h3')?.textContent || '';
        const cardDescription = card.querySelector('p')?.textContent || '';
        
        document.getElementById(`card${index + 1}-title`).value = cardTitle;
        document.getElementById(`card${index + 1}-description`).value = cardDescription;
    });

    // Add event listener for save button
    document.getElementById('save-about-changes').addEventListener('click', saveAboutChanges);
}

function saveAboutChanges() {
    const aboutData = {
        title: document.getElementById('about-title').value,
        description: document.getElementById('about-description').value,
        cards: [
            {
                title: document.getElementById('card1-title').value,
                description: document.getElementById('card1-description').value
            },
            {
                title: document.getElementById('card2-title').value,
                description: document.getElementById('card2-description').value
            },
            {
                title: document.getElementById('card3-title').value,
                description: document.getElementById('card3-description').value
            },
            {
                title: document.getElementById('card4-title').value,
                description: document.getElementById('card4-description').value
            }
        ]
    };

    // Save to localStorage
    localStorage.setItem('aboutContent', JSON.stringify(aboutData));

    // Update main page content
    const mainPageTitle = document.querySelector('#about .section-title');
    const mainPageDescription = document.querySelector('.about-intro p');
    const cards = document.querySelectorAll('.info-card');

    if (mainPageTitle) mainPageTitle.textContent = aboutData.title;
    if (mainPageDescription) mainPageDescription.textContent = aboutData.description;

    // Update cards
    cards.forEach((card, index) => {
        const cardData = aboutData.cards[index];
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        
        if (title) title.textContent = cardData.title;
        if (description) description.textContent = cardData.description;
    });

    showNotification('About section updated successfully!', 'success');
}

function generateEducationContent() {
    return `
        <h2>Education</h2>
        <div id="education-list">
            <!-- Education items will be loaded here -->
        </div>
        <button class="btn btn-primary" onclick="addNewEducation()">Add Education</button>
    `;
}

function generateExperienceContent() {
    return `
        <h2>Experience</h2>
        <div id="experience-list">
            <!-- Experience items will be loaded here -->
        </div>
        <button class="btn btn-primary" onclick="addNewExperience()">Add Experience</button>
    `;
}

function generateSkillsContent() {
    return `
        <h2>Skills</h2>
        <div id="skills-list">
            <!-- Skills will be loaded here -->
        </div>
        <button class="btn btn-primary" onclick="addNewSkill()">Add Skill</button>
    `;
}

function generateProjectsContent() {
    return `
        <div class="section-header">
            <h2>Projects</h2>
            <p>Your latest GitHub projects are automatically synced below.</p>
        </div>
        <div class="projects-container">
            <div id="github-projects" class="projects-grid">
                Loading projects...
            </div>
        </div>
    `;
}

function loadGitHubProjects() {
    const projectsContainer = document.getElementById('github-projects');
    const username = 'efekurucay';
    
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`)
        .then(response => response.json())
        .then(async repos => {
            const projectsHtml = await Promise.all(repos.map(async repo => {
                // Fetch README content
                let readmeContent = '';
                try {
                    const readmeResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`);
                    const readmeData = await readmeResponse.json();
                    if (readmeData.content) {
                        readmeContent = atob(readmeData.content)
                            .split('\n')
                            .slice(0, 3) // Get first 3 lines
                            .join('\n')
                            .replace(/<[^>]*>/g, ''); // Remove HTML tags
                    }
                } catch (error) {
                    console.log('No README found for', repo.name);
                }

                return `
                    <div class="project-card">
                        <div class="project-header">
                            <h3>
                                <i class="fas fa-code-branch"></i>
                                ${repo.name}
                            </h3>
                            ${repo.language ? `<span class="language-tag">${repo.language}</span>` : ''}
                        </div>
                        <div class="project-content">
                            <p class="project-description">
                                ${repo.description || readmeContent || 'No description available'}
                            </p>
                            <div class="project-meta">
                                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                                <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                                <span><i class="far fa-clock"></i> ${new Date(repo.updated_at).toLocaleDateString()}</span>
                            </div>
                            <a href="${repo.html_url}" target="_blank" class="btn btn-primary">View Project</a>
                        </div>
                    </div>
                `;
            }));
            
            projectsContainer.innerHTML = projectsHtml.join('');
            
            // Save to localStorage for main page
            localStorage.setItem('githubProjects', JSON.stringify(repos));
        })
        .catch(error => {
            console.error('Error:', error);
            projectsContainer.innerHTML = '<p>Error loading projects. Please try again later.</p>';
            
            // Try to load from cache
            const cachedProjects = localStorage.getItem('githubProjects');
            if (cachedProjects) {
                const repos = JSON.parse(cachedProjects);
                displayProjects(repos);
            }
        });
}

function generateBlogContent() {
    return `
        <div class="section-header">
            <h2>Blog Management</h2>
            <p>Your Medium blog posts are automatically synced below.</p>
        </div>
        <div class="blog-posts-container">
            <div id="medium-posts" class="blog-posts-grid">
                Loading blog posts...
            </div>
        </div>
    `;
}

function loadBlogPosts() {
    const postsContainer = document.getElementById('medium-posts');
    const username = 'efekurucay';
    const url = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok' && data.items.length > 0) {
                const postsHtml = data.items.map(post => {
                    // Extract first image from content if available
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = post.content;
                    const firstImage = tempDiv.querySelector('img');
                    const imageUrl = firstImage ? firstImage.src : '';
                    
                    // Get reading time
                    const words = post.content.split(' ').length;
                    const readingTime = Math.ceil(words / 200); // Assuming 200 words per minute
                    
                    // Clean description
                    const description = post.description
                        .replace(/<[^>]*>/g, '') // Remove HTML tags
                        .substring(0, 150) + '...'; // Limit length
                    
                    return `
                        <div class="blog-post-card">
                            ${imageUrl ? `<div class="post-image">
                                <img src="${imageUrl}" alt="${post.title}">
                            </div>` : ''}
                            <div class="post-content">
                                <h3>${post.title}</h3>
                                <p class="post-meta">${new Date(post.pubDate).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric'
                                })} · ${readingTime} min read</p>
                                <p class="post-excerpt">${description}</p>
                                <a href="${post.link}" target="_blank" class="btn btn-primary">Read More</a>
                            </div>
                        </div>
                    `;
                }).join('');
                
                postsContainer.innerHTML = postsHtml;
                
                // Save to localStorage for main page
                localStorage.setItem('mediumPosts', JSON.stringify(data.items));
            } else {
                postsContainer.innerHTML = '<p>No blog posts found.</p>';
            }
        })
        .catch(error => {
            postsContainer.innerHTML = '<p>Error loading blog posts. Please try again later.</p>';
            console.error('Error:', error);
        });
}

// Section Handlers
function initSectionHandlers(section) {
    switch (section) {
        case 'profile':
            initProfileHandlers();
            break;
        case 'about':
            loadAboutMe();
            break;
        // Add more handlers as needed
    }
}

// Profile Handlers
function initProfileHandlers() {
    const profileImage = document.getElementById('profile-image');
    if (profileImage) {
        profileImage.addEventListener('change', handleProfileImageChange);
    }

    const saveProfileChangesButton = document.getElementById('save-profile-changes');
    if (saveProfileChangesButton) {
        saveProfileChangesButton.addEventListener('click', saveProfileChanges);
    }
}

function handleProfileImageChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            
            // Update preview
            const profilePreview = document.getElementById('profile-preview');
            profilePreview.src = imageData;

            // Update all header profile images
            const headerProfileImages = document.querySelectorAll('.header-profile-image');
            headerProfileImages.forEach(img => {
                img.src = imageData;
            });

            // Save to localStorage
            localStorage.setItem('profileImage', imageData);

            // Show success message
            showNotification('Profile image updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

function saveProfileImage(file) {
    // Create a FormData object
    const formData = new FormData();
    formData.append('profile-image', file);

    // Save the image to the assets directory
    const targetPath = '../assets/images/profile.jpg';
    
    // You would typically make an API call here to save the file
    // For now, we'll just show a success message
    showNotification('Profile image updated successfully!', 'success');
}

function saveProfileChanges() {
    const name = document.getElementById('profile-name').value;
    const title = document.getElementById('profile-title').value;
    const description = document.getElementById('profile-description').value;
    const profilePreview = document.getElementById('profile-preview').src;

    // Update all profile images in the admin panel
    const headerProfileImages = document.querySelectorAll('.header-profile-image');
    headerProfileImages.forEach(img => {
        img.src = profilePreview;
    });

    // Update main page profile image
    const mainPageProfileImage = document.querySelector('.main-profile-image');
    if (mainPageProfileImage) {
        mainPageProfileImage.src = profilePreview;
    }

    // Update main page content
    const mainPageTitle = document.querySelector('.hero-title');
    const mainPageDescription = document.querySelector('.hero-description');
    
    if (mainPageTitle) {
        mainPageTitle.textContent = name;
        mainPageTitle.setAttribute('data-text', name);
    }
    
    if (mainPageDescription) {
        mainPageDescription.textContent = description;
    }

    // Show success message
    showNotification('Profile updated successfully!', 'success');
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', toggleTheme);
    
    // Load saved profile image on page load
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        const profilePreview = document.getElementById('profile-preview');
        const headerProfileImages = document.querySelectorAll('.header-profile-image');
        
        profilePreview.src = savedImage;
        headerProfileImages.forEach(img => {
            img.src = savedImage;
        });
    }
    
    // Load dashboard by default
    const dashboardLink = document.querySelector('[data-section="dashboard"]');
    dashboardLink.classList.add('active');
    loadSectionContent('dashboard');
});
