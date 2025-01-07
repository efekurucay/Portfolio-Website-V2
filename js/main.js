// Tema değiştirme fonksiyonu
const themeToggle = document.getElementById('theme-toggle');
const moonIcon = themeToggle.querySelector('.fa-moon');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');

// Set initial theme based on user preference or saved theme
function initializeTheme() {
    const isDarkMode = savedTheme === 'dark-mode' || (!savedTheme && prefersDarkScheme.matches);
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    moonIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    themeToggle.setAttribute('aria-label', `Switch to ${isDarkMode ? 'light' : 'dark'} mode`);
}

// Toggle theme with keyboard support
themeToggle.addEventListener('click', toggleTheme);
themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
    }
});

function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    moonIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', isDarkMode ? 'dark-mode' : 'light-mode');
    themeToggle.setAttribute('aria-label', `Switch to ${isDarkMode ? 'light' : 'dark'} mode`);
}

// İçerik yönetimi
async function loadContent() {
    try {
        const savedContent = localStorage.getItem('siteContent');
        
        if (savedContent) {
            return JSON.parse(savedContent);
        }

        // Initialize with empty content if not found
        const initialContent = {
            projects: [],
            blogPosts: [],
            categories: {
                project: [],
                blog: []
            }
        };
        localStorage.setItem('siteContent', JSON.stringify(initialContent));
        return initialContent;
    } catch (error) {
        console.error('Error loading content:', error);
        return {
            projects: [],
            blogPosts: [],
            categories: {
                project: [],
                blog: []
            }
        };
    }
}

// Proje kartı oluştur
function createProjectCard(project) {
    return `
        <div class="project-card" data-category="${project.category}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-meta">
                    <span class="category">${project.categoryName || 'Uncategorized'}</span>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <a href="${project.link}" class="btn btn-primary" target="_blank">View Project</a>
            </div>
        </div>
    `;
}

// Blog kartı oluştur
function createBlogCard(post) {
    return `
    <div class="blog-card" onclick="showBlogDetails('${post.id}')">
        <div class="card-image">
            <img src="${post.image}" alt="${post.title}">
            <span class="category-badge">${post.categoryName}</span>
        </div>
        <div class="card-content">
            <h3>${post.title}</h3>
            <p class="description">${post.description}</p>
            <div class="meta">
                <span class="date">${post.date}</span>
                <span class="read-time">${post.readTime} min read</span>
            </div>
        </div>
    </div>`;
}

// Blog post sayfasını göster
function showBlogPost(postId) {
    const content = JSON.parse(localStorage.getItem('siteContent'));
    const post = content.blogPosts.find(p => p.id === postId);
    
    if (!post) {
        alert('Blog post not found!');
        return;
    }

    // Ana içeriği gizle
    document.querySelector('main').style.display = 'none';

    // Blog post içeriğini oluştur
    const blogPostHTML = `
        <div class="blog-post-container">
            <div class="blog-post-header">
                <button onclick="hideBlogPost()" class="btn btn-secondary mb-4">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <h1>${post.title}</h1>
                <div class="blog-post-meta">
                    <span class="category">${post.categoryName || 'Uncategorized'}</span>
                    <span class="date">${post.date}</span>
                    <span class="read-time">${post.readTime}</span>
                </div>
            </div>
            <div class="blog-post-content">
                <img src="${post.image}" alt="${post.title}" class="blog-post-image">
                <div class="blog-post-text">
                    <div class="introduction">
                        ${post.content.introduction}
                    </div>
                    ${post.content.sections.map(section => `
                        <div class="section">
                            <h2>${section.title}</h2>
                            <div class="section-content">
                                ${section.content}
                            </div>
                        </div>
                    `).join('')}
                    <div class="conclusion">
                        ${post.content.conclusion}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Blog post container oluştur ve içeriği ekle
    const container = document.createElement('div');
    container.id = 'blog-post-view';
    container.innerHTML = blogPostHTML;
    document.body.appendChild(container);

    // URL'i güncelle (sayfa yenilenmeden)
    window.history.pushState({ postId }, '', `#blog/${postId}`);
}

// Blog post sayfasını gizle
function hideBlogPost() {
    // Blog post container'ı kaldır
    const container = document.getElementById('blog-post-view');
    if (container) {
        container.remove();
    }

    // Ana içeriği göster
    document.querySelector('main').style.display = 'block';

    // URL'i güncelle
    window.history.pushState({}, '', window.location.pathname);
}

// Sayfa yüklendiğinde URL'deki blog post ID'sini kontrol et
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#blog/')) {
        const postId = hash.replace('#blog/', '');
        showBlogPost(postId);
    }
});

// Tarayıcı geri/ileri butonları için
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.postId) {
        showBlogPost(event.state.postId);
    } else {
        hideBlogPost();
    }
});

// Mobile Menu
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMenu() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
}

navToggle.addEventListener('click', toggleMenu);

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !navToggle.contains(e.target)) {
        toggleMenu();
    }
});

// Close menu when pressing Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMenu();
    }
});

// Smooth scroll with keyboard support
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            targetSection.focus({ preventScroll: true });
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        }
    });
});

// Intersection Observer for section visibility
const sections = document.querySelectorAll('section[id]');
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            updateActiveLink(id);
        }
    });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

function updateActiveLink(sectionId) {
    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        link.classList.toggle('active', href === sectionId);
    });
}

// Lazy loading images
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Her şeyi yükle
document.addEventListener('DOMContentLoaded', async () => {
    initializeTheme();
    
    const content = await loadContent();
    
    // Ana sayfadaysa featured projeleri göster
    const featuredProjectsContainer = document.getElementById('featured-projects');
    if (featuredProjectsContainer) {
        // Son eklenen 3 projeyi göster
        const featuredProjects = content.projects.slice(0, 3);
        featuredProjectsContainer.innerHTML = featuredProjects
            .map(project => createProjectCard(project))
            .join('');
    }

    // Ana sayfadaysa featured blog yazılarını göster
    const featuredBlogsContainer = document.getElementById('featured-blogs');
    if (featuredBlogsContainer) {
        // Son eklenen 3 blog yazısını göster
        const featuredPosts = content.blogPosts.slice(0, 3);
        featuredBlogsContainer.innerHTML = featuredPosts
            .map(post => createBlogCard(post))
            .join('');
    }

    // Projeleri yükle
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        projectsGrid.innerHTML = content.projects.map(project => 
            createProjectCard(project)
        ).join('');
    }
    
    // Blog yazılarını yükle
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
        blogGrid.innerHTML = content.blogPosts.map(post => 
            createBlogCard(post)
        ).join('');
    }
    
    // Proje filtreleri
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.filter;
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Spotify yükle
    const spotifySection = document.querySelector('.spotify-player');
    if (spotifySection) {
        spotifySection.innerHTML = `
            <iframe style="border-radius:12px" 
                    src="https://open.spotify.com/embed/artist/0FPNPRzTrILWRWVRor7uKp?utm_source=generator&theme=0" 
                    width="100%" 
                    height="400" 
                    frameBorder="0" 
                    allowfullscreen="" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy">
            </iframe>
        `;
    }
    
    // AOS'u başlat
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
});

// Handle system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        document.body.className = e.matches ? 'dark-mode' : 'light-mode';
        moonIcon.className = e.matches ? 'fas fa-sun' : 'fas fa-moon';
    }
});

// Theme Management
class ThemeManager {
    constructor() {
           this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;
        this.xLogos = document.querySelectorAll('.x-logo');
        
        this.initialize();
    }
    
    initialize() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.body.classList.toggle('dark-mode', savedTheme === 'dark');
            this.updateXLogos(savedTheme === 'dark');
        }
        
        // Theme toggle click handler
        this.themeToggle.addEventListener('click', () => {
            this.body.classList.toggle('dark-mode');
            const isDark = this.body.classList.contains('dark-mode');
            
            // Save theme preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Update X logos
            this.updateXLogos(isDark);
        });
    }
    
    updateXLogos(isDark) {
        this.xLogos.forEach(logo => {
            logo.src = isDark ? 'img/x.svg' : 'img/x-logo.svg';
        });
    }
}

// Navbar Management
class NavbarManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.initialize();
    }
    
    initialize() {
        // Handle scroll
        window.addEventListener('scroll', () => {
            this.header.classList.toggle('scrolled', window.scrollY > 0);
        });
        
        // Handle mobile menu toggle
        this.navToggle.addEventListener('click', () => {
            this.navToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });
        
        // Handle nav link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Remove active class from all links
                this.navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Close mobile menu
                this.navToggle.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });
        
        // Handle section scrolling
        this.handleSectionScroll();
    }
    
    handleSectionScroll() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => link.classList.remove('active'));
                    navLink?.classList.add('active');
                }
            });
        });
    }
}

// Typed Text Animation
class TypedTextAnimation {
    constructor() {
        this.typedTextSpan = document.querySelector('.typed-text');
        this.textArray = [
            'Computer Science Student',
            'AI Developer',
            'HSD Campus Ambassador'
        ];
        this.typingDelay = 100;
        this.erasingDelay = 50;
        this.newTextDelay = 2000;
        this.textArrayIndex = 0;
        this.charIndex = 0;
        
        this.initialize();
    }
    
    initialize() {
        if (this.typedTextSpan) {
            this.type();
        }
    }
    
    type() {
        if (this.charIndex < this.textArray[this.textArrayIndex].length) {
            this.typedTextSpan.textContent += this.textArray[this.textArrayIndex].charAt(this.charIndex);
            this.charIndex++;
            setTimeout(() => this.type(), this.typingDelay);
        } else {
            setTimeout(() => this.erase(), this.newTextDelay);
        }
    }
    
    erase() {
        if (this.charIndex > 0) {
            this.typedTextSpan.textContent = this.textArray[this.textArrayIndex].substring(0, this.charIndex - 1);
            this.charIndex--;
            setTimeout(() => this.erase(), this.erasingDelay);
        } else {
            this.textArrayIndex++;
            if (this.textArrayIndex >= this.textArray.length) {
                this.textArrayIndex = 0;
            }
            setTimeout(() => this.type(), this.typingDelay + 1100);
        }
    }
}

// Smooth Scroll
class SmoothScroll {
    constructor() {
        this.initialize();
    }
    
    initialize() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Project Filter
class ProjectFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        
        this.initialize();
    }
    
    initialize() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get filter value
                const filter = button.getAttribute('data-filter');
                
                // Filter projects
                this.filterProjects(filter);
            });
        });
    }
    
    filterProjects(filter) {
        this.projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || filter === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 0);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Contact Form
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.initialize();
    }
    
    initialize() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: this.form.querySelector('#name').value,
                email: this.form.querySelector('#email').value,
                subject: this.form.querySelector('#subject').value,
                message: this.form.querySelector('#message').value
            };
            
            // Validate form data
            if (this.validateForm(formData)) {
                // Send email (you'll need to implement this with a backend service)
                this.sendEmail(formData);
            }
        });
    }
    
    validateForm(data) {
        // Simple validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            this.showNotification('Please fill in all fields', 'error');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        return true;
    }
    
    sendEmail(data) {
        // Here you would typically send the data to a backend service
        // For now, we'll just show a success message
        console.log('Form data:', data);
        this.showNotification('Message sent successfully! I will get back to you soon.', 'success');
        this.form.reset();
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add notification to the page
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new NavbarManager();
    new TypedTextAnimation();
    new SmoothScroll();
    new ProjectFilter();
    new ContactForm();
});
