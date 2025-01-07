// Initialize Post Page
function initializePostPage() {
    // Get post slug from URL
    const slug = window.location.pathname
        .split('/')
        .pop()
        .replace('.html', '');
    
    // Get post data
    const post = contentManager.getBlogPost(slug);
    
    if (post) {
        // Update page metadata
        updatePageMetadata(post);
        
        // Render post content
        renderPostContent(post);
        
        // Load related posts
        loadRelatedPosts(post);
        
        // Initialize share buttons
        initializeShareButtons(post);
        
        // Initialize syntax highlighting
        Prism.highlightAll();
        
        // Initialize AOS
        AOS.refresh();
    } else {
        // Handle 404
        handlePostNotFound();
    }
}

// Update page metadata
function updatePageMetadata(post) {
    document.title = `${post.title} | Yahya Efe Kuruçay - Software Engineer`;
    document.querySelector('meta[name="description"]').content = post.excerpt;
}

// Render post content
function renderPostContent(post) {
    // Update post header
    document.querySelector('.category').textContent = post.category;
    document.querySelector('.date').innerHTML = `
        <i class="far fa-calendar"></i>
        ${new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}
    `;
    document.querySelector('.read-time').innerHTML = `
        <i class="far fa-clock"></i>
        ${post.readTime} min read
    `;
    document.querySelector('.post-title').textContent = post.title;
    
    // Update tags
    const tagsHTML = post.tags.map(tag => `
        <span class="tag">${tag}</span>
    `).join('');
    document.querySelector('.post-tags').innerHTML = tagsHTML;
    
    // Update featured image
    const postImage = document.querySelector('.post-image');
    postImage.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        ${post.imageCaption ? `<figcaption>${post.imageCaption}</figcaption>` : ''}
    `;
    
    // Update content sections
    const postContent = document.querySelector('.post-content');
    
    // Add introduction
    const introSection = document.createElement('div');
    introSection.className = 'post-section';
    introSection.setAttribute('data-aos', 'fade-up');
    introSection.innerHTML = `
        <p class="lead">${post.content.introduction}</p>
    `;
    postContent.appendChild(introSection);
    
    // Add main content sections
    post.content.sections.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'post-section';
        sectionElement.setAttribute('data-aos', 'fade-up');
        sectionElement.innerHTML = `
            <h2>${section.title}</h2>
            ${section.content}
        `;
        postContent.appendChild(sectionElement);
    });
    
    // Add conclusion
    const conclusionSection = document.createElement('div');
    conclusionSection.className = 'post-section';
    conclusionSection.setAttribute('data-aos', 'fade-up');
    conclusionSection.innerHTML = `
        <h2>Conclusion</h2>
        <p>${post.content.conclusion}</p>
    `;
    postContent.appendChild(conclusionSection);
}

// Load related posts
function loadRelatedPosts(currentPost) {
    const relatedPosts = contentManager.content.blogPosts
        .filter(post => 
            post.slug !== currentPost.slug && // Exclude current post
            (
                post.category === currentPost.category || // Same category
                post.tags.some(tag => currentPost.tags.includes(tag)) // Shared tags
            )
        )
        .slice(0, 3); // Get up to 3 related posts
    
    const relatedPostsGrid = document.querySelector('.related-posts .posts-grid');
    relatedPostsGrid.innerHTML = relatedPosts.map(post => `
        <article class="blog-card" data-aos="fade-up">
            <div class="card-image">
                <img src="${post.image}" alt="${post.title}">
                <div class="card-category">
                    <span>${post.category}</span>
                </div>
            </div>
            <div class="card-content">
                <div class="card-meta">
                    <span class="date">
                        <i class="far fa-calendar"></i>
                        ${new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                    <span class="read-time">
                        <i class="far fa-clock"></i>
                        ${post.readTime} min read
                    </span>
                </div>
                <h3 class="card-title">${post.title}</h3>
                <p class="card-excerpt">${post.excerpt}</p>
                <a href="${post.slug}.html" class="read-more">
                    Read More
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `).join('');
}

// Initialize share buttons
function initializeShareButtons(post) {
    const postUrl = window.location.href;
    const postTitle = post.title;
    
    window.shareOnTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`;
        window.open(twitterUrl, '_blank');
    };
    
    window.shareOnLinkedIn = () => {
        const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(postTitle)}`;
        window.open(linkedInUrl, '_blank');
    };
    
    window.shareOnFacebook = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        window.open(facebookUrl, '_blank');
    };
}

// Handle post not found
function handlePostNotFound() {
    document.querySelector('main').innerHTML = `
        <div class="container">
            <div class="not-found" data-aos="fade-up">
                <i class="fas fa-exclamation-circle"></i>
                <h1>Post Not Found</h1>
                <p>The blog post you're looking for doesn't exist or has been moved.</p>
                <a href="../" class="btn btn-primary">Back to Blog</a>
            </div>
        </div>
    `;
}

// Initialize when content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for content manager to be ready
    if (window.contentManager) {
        initializePostPage();
    } else {
        // If content manager is not ready, wait for it
        window.addEventListener('contentManagerReady', initializePostPage);
    }
});
