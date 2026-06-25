// ===== CONFIGURATION FOR EMAIL NOTIFICATIONS =====
// Enter your email below (e.g., "you@example.com") to receive email notifications when a user signs up.
// The first time someone submits a form, FormSubmit.co will send you a confirmation email. Click the link inside it to activate.
// (Once active, you can get a hidden hash key from FormSubmit.co to hide your real email in the code if you want).
const NOTIFICATION_EMAIL = "ibadkhan0903@gmail.com";

// ===== State Management =====
let selectedPlan = "Free Waitlist"; // Default plan type

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
});

// ===== Mobile Menu Toggle =====
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = mobileToggle.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Plan Selection Action (Intent-to-Pay Metric) =====
const ctaTitle = document.getElementById('cta-title');
const ctaSubtitle = document.getElementById('cta-subtitle');
const ctaSubmitBtn = document.getElementById('cta-submit').querySelector('span');

document.querySelectorAll('.btn-plan-select').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const plan = this.getAttribute('data-plan');
        selectedPlan = plan;

        // Custom pricing discount copy to optimize validation
        let subtitleText = "";
        if (plan.includes("Starter")) {
            subtitleText = "Secure your 35% founding member discount for the Starter Plan ($19/mo, usually $29/mo). Locked in for life, no credit card required today.";
        } else if (plan.includes("Pro")) {
            subtitleText = "Secure your Pro Plan founding discount of $49/mo (usually $79/mo) locked in for life. No credit card required right now.";
        } else if (plan.includes("Agency")) {
            subtitleText = "Secure your Agency Plan founding discount of $129/mo (usually $199/mo) locked in for life. No credit card required today.";
        }

        // Update CTA visual text dynamically to reflect their selection
        ctaTitle.innerHTML = `Pre-Register for the <span class="gradient-text">${plan.split(' ')[0]} Plan</span>`;
        ctaSubtitle.textContent = subtitleText;
        ctaSubmitBtn.textContent = "Lock in Founding Price";

        // Scroll smoothly to form
        const targetSection = document.getElementById('register');
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Reset plan selection to free pre-registration when clicking non-pricing CTA buttons
document.getElementById('nav-cta').addEventListener('click', () => {
    resetCTAPlan();
});

function resetCTAPlan() {
    selectedPlan = "Free Waitlist";
    ctaTitle.innerHTML = `Ready to build pages that <span class="gradient-text">actually convert</span>?`;
    ctaSubtitle.textContent = "Join 140+ founders who've already secured their spot. Pre-register now for early access and exclusive founding member pricing.";
    ctaSubmitBtn.textContent = "Secure My Spot";
}

// ===== Form Submissions & Local Lead Capture =====
const successModal = document.getElementById('success-modal');
const modalClose = document.getElementById('modal-close');
const successTitle = document.getElementById('success-title');
const successMessage = document.getElementById('success-message');

function showSuccessModal(plan) {
    if (plan === "Free Waitlist") {
        successTitle.textContent = "You're on the list!";
        successMessage.textContent = "We'll send you exclusive early access when LeadLander launches. Keep an eye on your inbox!";
    } else {
        successTitle.textContent = "Founding Slot Secured! 🎉";
        successMessage.innerHTML = `You've locked in the founding member price for the <strong>${plan}</strong>.<br>We'll notify you as soon as the private beta opens so you can claim your discount!`;
    }
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideSuccessModal() {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', hideSuccessModal);
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) hideSuccessModal();
});

// Lead Capture Handler
function captureLead(email, plan) {
    const leads = JSON.parse(localStorage.getItem('leadlander_leads') || '[]');
    
    // Check if email already registered
    const exists = leads.some(lead => lead.email.toLowerCase() === email.toLowerCase() && lead.plan === plan);
    if (!exists) {
        leads.push({
            email: email,
            plan: plan,
            timestamp: new Date().toLocaleString()
        });
        localStorage.setItem('leadlander_leads', JSON.stringify(leads));
    }

    // Dynamic Waitlist Counter Updates
    updateWaitlistStats();

    // Trigger Email Notification via AJAX (if configured by owner)
    if (NOTIFICATION_EMAIL && NOTIFICATION_EMAIL !== "YOUR_EMAIL_HERE") {
        sendEmailNotification(email, plan);
    }
}

// FormSubmit AJAX Sender
function sendEmailNotification(email, plan) {
    const subject = `LeadLander Signup: ${plan === "Free Waitlist" ? "Free Pre-Register" : "Intent to Pay - " + plan}`;
    
    fetch(`https://formsubmit.co/ajax/${NOTIFICATION_EMAIL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            email: email,
            plan: plan,
            category: plan === "Free Waitlist" ? "Waitlist Only" : "Validation - Intent to Pay",
            _subject: subject
        })
    })
    .then(response => response.json())
    .then(data => console.log("Notification email queued successfully:", data))
    .catch(error => console.error("Error sending notification email:", error));
}

// Hero Form Submission
document.getElementById('hero-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('hero-email').value;
    if (email) {
        captureLead(email, "Free Waitlist");
        showSuccessModal("Free Waitlist");
        this.reset();
    }
});

// Final CTA Form Submission
document.getElementById('cta-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('cta-email').value;
    if (email) {
        captureLead(email, selectedPlan);
        showSuccessModal(selectedPlan);
        this.reset();
        resetCTAPlan();
    }
});

// ===== Validation Dashboard Modal (Hidden Feature for Founder) =====
const leadsModal = document.getElementById('leads-modal');
const leadsModalClose = document.getElementById('leads-modal-close');
const leadsTableBody = document.getElementById('leads-table-body');

// Dashboard Stats elements
const valTotalLeads = document.getElementById('val-total-leads');
const valFreeLeads = document.getElementById('val-free-leads');
const valIntentLeads = document.getElementById('val-intent-leads');
const emailStatusText = document.getElementById('email-status-text');

function openLeadsDashboard() {
    refreshLeadsTable();
    leadsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLeadsDashboard() {
    leadsModal.classList.remove('active');
    document.body.style.overflow = '';
}

leadsModalClose.addEventListener('click', closeLeadsDashboard);
leadsModal.addEventListener('click', (e) => {
    if (e.target === leadsModal) closeLeadsDashboard();
});

// Shortcut toggles: Ctrl+Shift+L
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'L') {
        e.preventDefault();
        if (leadsModal.classList.contains('active')) {
            closeLeadsDashboard();
        } else {
            openLeadsDashboard();
        }
    }
    if (e.key === 'Escape' && leadsModal.classList.contains('active')) {
        closeLeadsDashboard();
    }
});

// Double click footer or nav logo triggers dashboard
document.getElementById('footer-logo').addEventListener('dblclick', (e) => {
    e.preventDefault();
    openLeadsDashboard();
});
document.getElementById('logo').addEventListener('dblclick', (e) => {
    e.preventDefault();
    openLeadsDashboard();
});

// Populate Table & Stats
function refreshLeadsTable() {
    const leads = JSON.parse(localStorage.getItem('leadlander_leads') || '[]');
    leadsTableBody.innerHTML = '';

    // Calculate Stats
    let total = leads.length;
    let freeCount = 0;
    let intentCount = 0;

    // Fill table backwards so newest are first
    for (let i = leads.length - 1; i >= 0; i--) {
        const lead = leads[i];
        const row = document.createElement('tr');
        
        const isPaid = lead.plan !== "Free Waitlist";
        if (isPaid) intentCount++;
        else freeCount++;

        row.innerHTML = `
            <td>${lead.email}</td>
            <td><span class="badge ${isPaid ? 'badge-pay' : 'badge-free'}">${lead.plan}</span></td>
            <td>${lead.timestamp}</td>
        `;
        leadsTableBody.appendChild(row);
    }

    if (total === 0) {
        leadsTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-tertiary);padding:30px 0;">No pre-registrations yet. Share your page to capture leads!</td></tr>`;
    }

    // Update numbers
    valTotalLeads.textContent = total;
    valFreeLeads.textContent = freeCount;
    valIntentLeads.textContent = intentCount;

    // Update Email Status
    if (NOTIFICATION_EMAIL && NOTIFICATION_EMAIL !== "YOUR_EMAIL_HERE") {
        emailStatusText.innerHTML = `🟢 Email notification active! Sends alerts to: <code>${NOTIFICATION_EMAIL}</code>`;
        emailStatusText.style.color = "var(--accent-green)";
    } else {
        emailStatusText.innerHTML = `⚠️ Email notifications are NOT active. Enter your email in <code>script.js</code> (line 5) to receive email notifications.`;
        emailStatusText.style.color = "var(--accent-amber)";
    }
}

// Export CSV
document.getElementById('btn-export-csv').addEventListener('click', () => {
    const leads = JSON.parse(localStorage.getItem('leadlander_leads') || '[]');
    if (leads.length === 0) {
        alert('No pre-registrations to export yet!');
        return;
    }

    let csvContent = "Email,Plan Type,Date Subscribed\n";
    leads.forEach(lead => {
        csvContent += `"${lead.email.replace(/"/g, '""')}","${lead.plan.replace(/"/g, '""')}","${lead.timestamp}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leadlander_leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Clear Data
document.getElementById('btn-clear-leads').addEventListener('click', () => {
    const leads = JSON.parse(localStorage.getItem('leadlander_leads') || '[]');
    if (leads.length === 0) return;

    if (confirm('Are you sure you want to permanently delete all collected validation leads? This cannot be undone.')) {
        localStorage.removeItem('leadlander_leads');
        refreshLeadsTable();
        updateWaitlistStats();
    }
});

// Update Waitlist Stats dynamically on the UI
function updateWaitlistStats() {
    const leads = JSON.parse(localStorage.getItem('leadlander_leads') || '[]');
    const extraWaitlist = leads.length;
    const baseWaitlist = 140;
    const newTotal = baseWaitlist + extraWaitlist;

    // Update numbers on page
    const badge = document.getElementById('avatar-count-badge');
    const textSpan = document.getElementById('waitlist-count-text');
    const statsUsers = document.getElementById('stat-users')?.querySelector('.stat-number');

    if (badge) badge.textContent = `+${newTotal}`;
    if (textSpan) textSpan.textContent = `${newTotal}+`;
    if (statsUsers) {
        statsUsers.setAttribute('data-target', newTotal);
        // Refresh counter animation if active
        statsUsers.textContent = newTotal;
    }
}

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
            faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Open clicked if it wasn't active
        if (!isActive) {
            item.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
        }
    });
});

// ===== Stats Counter Animation =====
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseFloat(stat.dataset.target);
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = target * ease;

            if (isDecimal) {
                stat.textContent = current.toFixed(1);
            } else {
                stat.textContent = Math.floor(current).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isDecimal) {
                    stat.textContent = target.toFixed(1);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            }
        }

        requestAnimationFrame(update);
    });
}

// ===== Scroll Reveal =====
function setupReveal() {
    const revealElements = document.querySelectorAll(
        '.feature-card, .step-card, .stat-item, .testimonial-card, .pricing-card, .faq-item, .section-header'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Start counter animation when stats section is visible
                if (entry.target.classList.contains('stat-item')) {
                    animateCounters();
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ===== Card Mouse Glow Effect =====
function setupCardGlow() {
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });
}

// ===== Staggered Reveal Delay =====
function setupStaggerDelay() {
    const grids = document.querySelectorAll('.features-grid, .steps-grid, .testimonials-grid, .pricing-grid');
    grids.forEach(grid => {
        const children = grid.querySelectorAll('.reveal');
        children.forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    setupReveal();
    setupCardGlow();
    setupStaggerDelay();
    updateWaitlistStats(); // Init waitlist count from local signs
});
