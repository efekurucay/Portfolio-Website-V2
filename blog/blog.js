// Blog Management
class BlogManager {
    constructor() {
        this.posts = [];
        this.tags = [];
        this.currentPage = 1;
        this.postsPerPage = 9;
        this.currentTag = 'all';
        
        // DOM Elements
        this.blogGrid = document.getElementById('blogGrid');
        this.tagFilters = document.getElementById('tagFilters');
        this.pagination = document.getElementById('pagination');
        
        this.initialize();
    }
    
    async initialize() {
        await this.loadPosts();
        this.loadTags();
        this.setupEventListeners();
        this.renderPosts();
    }
    
    async loadPosts() {
        try {
            const posts = await this.fetchPosts();
            this.posts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error('Error loading posts:', error);
            this.posts = [];
        }
    }
    
    async fetchPosts() {
        // Replace with actual API call when backend is ready
        return JSON.parse(localStorage.getItem('posts') || '[]');
    }
    
    loadTags() {
        // Get unique tags from all posts
        const tagSet = new Set();
        this.posts.forEach(post => {
            post.tags?.forEach(tag => tagSet.add(tag));
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
        this.currentPage = 1;
        
        // Update active state
        const filters = this.tagFilters.querySelectorAll('.tag-filter');
        filters.forEach(filter => {
            filter.classList.toggle('active', filter.dataset.tag === tag);
        });
        
        this.renderPosts();
    }
    
    getFilteredPosts() {
        if (this.currentTag === 'all') {
            return this.posts;
        }
        return this.posts.filter(post => 
            post.tags?.includes(this.currentTag)
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
    
    renderPosts() {
        const filteredPosts = this.getFilteredPosts();
        const totalPages = Math.ceil(filteredPosts.length / this.postsPerPage);
        
        // Get current page posts
        const start = (this.currentPage - 1) * this.postsPerPage;
        const end = start + this.postsPerPage;
        const currentPosts = filteredPosts.slice(start, end);
        
        // Render posts
        this.blogGrid.innerHTML = currentPosts.map(post => this.createPostCard(post)).join('');
        
        // Render pagination
        this.renderPagination(totalPages);
    }
    
    createPostCard(post) {
        return `
            <article class="blog-card" data-aos="fade-up">
                <img src="${post.image || '../img/blog-placeholder.jpg'}" 
                     alt="${post.title}" 
                     class="blog-image">
                <div class="blog-content">
                    <h2 class="blog-title">
                        <a href="/blog/posts/${post.id}">${post.title}</a>
                    </h2>
                    <p class="blog-excerpt">${post.description}</p>
                    <div class="blog-meta">
                        <span>${this.formatDate(post.createdAt)}</span>
                        <span>${this.getReadTime(post.content)} min read</span>
                    </div>
                    <div class="blog-tags">
                        ${post.tags?.map(tag => `
                            <span class="blog-tag">${tag}</span>
                        `).join('') || ''}
                    </div>
                </div>
            </article>
        `;
    }
    
    renderPagination(totalPages) {
        if (totalPages <= 1) {
            this.pagination.innerHTML = '';
            return;
        }
        
        let html = '';
        
        // Previous button
        if (this.currentPage > 1) {
            html += `
                <button class="page-button" data-page="${this.currentPage - 1}">
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;
        }
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || 
                i === totalPages || 
                (i >= this.currentPage - 1 && i <= this.currentPage + 1)
            ) {
                html += `
                    <button class="page-button ${i === this.currentPage ? 'active' : ''}" 
                            data-page="${i}">
                        ${i}
                    </button>
                `;
            } else if (
                i === this.currentPage - 2 || 
                i === this.currentPage + 2
            ) {
                html += `<span class="page-ellipsis">...</span>`;
            }
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            html += `
                <button class="page-button" data-page="${this.currentPage + 1}">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }
        
        this.pagination.innerHTML = html;
        
        // Add click handlers
        this.pagination.querySelectorAll('.page-button').forEach(button => {
            button.addEventListener('click', () => {
                const page = parseInt(button.dataset.page);
                this.currentPage = page;
                this.renderPosts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }
    
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    getReadTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content?.split(/\s+/)?.length || 0;
        return Math.ceil(wordCount / wordsPerMinute);
    }
}

// Initialize blog
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
});
