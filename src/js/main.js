// Health for California - Main JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Quote Form Handling
    const quoteForm = document.getElementById('quote-form');

    if (quoteForm) {
        quoteForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(quoteForm);
            const data = Object.fromEntries(formData);

            console.log('Quote request:', data);

            // Here you would typically send to your backend
            // For now, show a success message
            alert('Thank you! We\'ll get you a quote shortly.');

            // Track conversion (placeholder for Google Ads)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-XXXXXXXXX/XXXXXXXXXXXXXX'
                });
            }
        });
    }

    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);

            if (value.length >= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            }

            e.target.value = value;
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Testimonial Stacked Faces Carousel
    const stackedFaces = document.querySelectorAll('button.stacked-face');
    const testimonialQuotes = document.querySelectorAll('.testimonial-quote');

    if (stackedFaces.length > 0 && testimonialQuotes.length > 0) {
        stackedFaces.forEach(face => {
            face.addEventListener('click', function () {
                const index = this.getAttribute('data-index');

                // Update active face
                stackedFaces.forEach(f => f.classList.remove('active'));
                this.classList.add('active');

                // Show corresponding testimonial
                testimonialQuotes.forEach(quote => {
                    quote.classList.remove('active');
                });

                const targetQuote = document.getElementById(`testimonial-${index}`);
                if (targetQuote) {
                    targetQuote.classList.add('active');
                }
            });
        });
    }
});
