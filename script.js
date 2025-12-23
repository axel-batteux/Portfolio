// ==================== PARTICLE ANIMATION ====================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ==================== GITHUB API ====================
class GitHubPortfolio {
    constructor() {
        this.username = 'axel-batteux';
        this.apiBase = 'https://api.github.com';
        this.repos = [];
        this.featuredRepos = ['GeoMaster', 'Football_Predictor'];
    }
    
    async fetchRepos() {
        try {
            const response = await fetch(`${this.apiBase}/users/${this.username}/repos?sort=updated`);
            this.repos = await response.json();
            this.displayAllProjects();
            this.updateRepoCount();
        } catch (error) {
            console.error('Error fetching repos:', error);
            this.displayFallbackProjects();
        }
    }
    
    displayAllProjects() {
        const container = document.getElementById('projects-grid');
        if (!container) return;
        
        // Filter out featured projects
        const otherRepos = this.repos.filter(repo => !this.featuredRepos.includes(repo.name));
        
        container.innerHTML = otherRepos.map(repo => this.createProjectCard(repo)).join('');
    }
    
    createProjectCard(repo) {
        const languageColors = {
            'JavaScript': '#f1e05a',
            'Python': '#3572A5',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'TypeScript': '#2b7489'
        };
        
        const languageColor = languageColors[repo.language] || '#8b5cf6';
        
        return `
            <div class="project-card small" data-aos="fade-up">
                <div class="project-header">
                    <div class="project-icon" style="background: linear-gradient(135deg, ${languageColor}, #8b5cf6);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                            <polyline points="13 2 13 9 20 9"/>
                        </svg>
                    </div>
                    ${repo.language ? `<span class="project-badge">${repo.language}</span>` : ''}
                </div>
                <h3 class="project-title">${repo.name.replace(/_/g, ' ')}</h3>
                <p class="project-description">
                    ${repo.description || 'Projet de développement personnel'}
                </p>
                <div class="project-stats">
                    ${repo.stargazers_count > 0 ? `
                        <span class="project-stat">
                            ⭐ ${repo.stargazers_count}
                        </span>
                    ` : ''}
                    ${repo.forks_count > 0 ? `
                        <span class="project-stat">
                            🔀 ${repo.forks_count}
                        </span>
                    ` : ''}
                    <span class="project-stat">
                        📅 ${new Date(repo.updated_at).toLocaleDateString('fr-FR')}
                    </span>
                </div>
                <div class="project-links" style="margin-top: 1rem;">
                    <a href="${repo.html_url}" target="_blank" class="project-link primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Voir
                    </a>
                </div>
            </div>
        `;
    }
    
    displayFallbackProjects() {
        const container = document.getElementById('projects-grid');
        if (!container) return;
        
        const fallbackRepos = [
            { name: 'Gurobi_Project', language: 'Python', description: 'Projet d\'optimisation avec Gurobi' },
            { name: 'Projet_Gurobi', language: 'Python', description: 'Analyse et optimisation' }
        ];
        
        container.innerHTML = fallbackRepos.map(repo => `
            <div class="project-card small" data-aos="fade-up">
                <div class="project-header">
                    <div class="project-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                            <polyline points="13 2 13 9 20 9"/>
                        </svg>
                    </div>
                    <span class="project-badge">${repo.language}</span>
                </div>
                <h3 class="project-title">${repo.name.replace(/_/g, ' ')}</h3>
                <p class="project-description">${repo.description}</p>
                <div class="project-links" style="margin-top: 1rem;">
                    <a href="https://github.com/${this.username}/${repo.name}" target="_blank" class="project-link primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Voir
                    </a>
                </div>
            </div>
        `).join('');
    }
    
    updateRepoCount() {
        const countElement = document.getElementById('repo-count');
        if (countElement && this.repos.length > 0) {
            countElement.textContent = this.repos.length;
        }
    }
}

// ==================== SCROLL ANIMATIONS ====================
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver(
            entries => this.handleIntersection(entries),
            this.observerOptions
        );
        
        this.init();
    }
    
    init() {
        // Observe all elements with data-aos attribute
        const elements = document.querySelectorAll('[data-aos]');
        elements.forEach(el => this.observer.observe(el));
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== NAVBAR SCROLL EFFECT ====================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.8)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// ==================== ACTIVE NAV LINK ====================
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==================== CURSOR EFFECTS ====================
function initCursorEffects() {
    const cards = document.querySelectorAll('.project-card, .skill-category, .contact-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// ==================== TYPING EFFECT ====================
class TypingEffect {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }
    
    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }
    
    start() {
        this.element.textContent = '';
        this.type();
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    new ParticleSystem();
    
    // Initialize GitHub portfolio
    const portfolio = new GitHubPortfolio();
    portfolio.fetchRepos();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize navbar effects
    initNavbarScroll();
    
    // Initialize active nav link
    initActiveNavLink();
    
    // Initialize cursor effects
    initCursorEffects();
    
    // Add loading complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy load images
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
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
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize on load
window.addEventListener('load', () => {
    initLazyLoad();
});
