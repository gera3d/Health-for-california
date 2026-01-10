// Health for California - Main JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // =================================================================
    // QUOTE FORM - Flat Progressive Disclosure (HFC Style)
    // =================================================================

    const quoteForm = document.getElementById('quote-form');

    if (quoteForm) {
        // Track form state
        const formState = {
            familyMembers: [],
            memberCount: 0,
            primaryInfoComplete: false,
            startDateSelected: false,
            discountSelected: false
        };

        // Initialize
        generateStartDateOptions();
        setupGenderToggle();
        setupDOBFields();
        setupZipValidation();
        setupPrimaryCoverageToggle();
        setupDiscountToggle();
        setupFamilyMemberButtons();
        setupIncomeFields();

        // =================================================================
        // Gender Toggle
        // =================================================================

        function setupGenderToggle() {
            const container = document.getElementById('primary-gender-toggle');
            if (!container) return;

            const buttons = container.querySelectorAll('.gender-btn');
            const hiddenInput = document.getElementById('primary_gender');

            buttons.forEach(btn => {
                btn.addEventListener('click', function () {
                    buttons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    if (hiddenInput) {
                        hiddenInput.value = this.dataset.value;
                    }
                    checkPrimaryInfoComplete();
                });
            });
        }

        // =================================================================
        // Date of Birth Fields with Auto-Tab
        // =================================================================

        function setupDOBFields() {
            const dobFields = document.querySelectorAll('#primary-section .dob-field');
            dobFields.forEach(field => {
                field.addEventListener('input', function (e) {
                    this.value = this.value.replace(/\D/g, '');

                    const maxLength = parseInt(this.getAttribute('maxlength'));

                    // Add valid class when field is complete
                    if (this.value.length >= maxLength) {
                        this.classList.add('valid');
                        const next = this.nextElementSibling?.nextElementSibling;
                        if (next && next.classList.contains('dob-field')) {
                            next.focus();
                        }
                    } else {
                        this.classList.remove('valid');
                    }
                    checkPrimaryInfoComplete();
                });
            });
        }

        // =================================================================
        // Zip Code Validation
        // =================================================================

        function setupZipValidation() {
            const zipInput = document.getElementById('zipcode');
            const zipCheck = document.getElementById('zip-check');

            const caZipRanges = [[90001, 96162]];

            function isValidCAZip(zip) {
                const zipNum = parseInt(zip);
                if (zip.length !== 5 || isNaN(zipNum)) return false;
                return caZipRanges.some(([min, max]) => zipNum >= min && zipNum <= max);
            }

            // Make available globally for validateForm
            window.isValidCAZip = isValidCAZip;

            if (zipInput) {
                zipInput.addEventListener('input', function (e) {
                    this.value = this.value.replace(/\D/g, '').slice(0, 5);

                    if (this.value.length === 5) {
                        if (isValidCAZip(this.value)) {
                            zipCheck.classList.add('visible');
                            this.classList.add('valid');
                            checkPrimaryInfoComplete();
                        } else {
                            zipCheck.classList.remove('visible');
                            this.classList.remove('valid');
                        }
                    } else {
                        zipCheck.classList.remove('visible');
                        this.classList.remove('valid');
                    }
                });
            }
        }

        // =================================================================
        // Check Primary Info Complete - Show Start Date Section
        // =================================================================

        function checkPrimaryInfoComplete() {
            const gender = document.getElementById('primary_gender').value;
            const month = document.getElementById('primary-dob-month').value;
            const day = document.getElementById('primary-dob-day').value;
            const year = document.getElementById('primary-dob-year').value;
            const zip = document.getElementById('zipcode').value;
            const coverage = document.getElementById('primary_needs_coverage').value;

            const dobComplete = month.length === 2 && day.length === 2 && year.length === 4;
            const zipValid = window.isValidCAZip && window.isValidCAZip(zip);

            // Show DOB checkmark when complete
            const dobCheck = document.getElementById('dob-check');
            if (dobCheck) {
                if (dobComplete) {
                    dobCheck.classList.remove('hidden');
                    dobCheck.classList.add('visible');
                } else {
                    dobCheck.classList.add('hidden');
                    dobCheck.classList.remove('visible');
                }
            }

            if (gender && dobComplete && zipValid && coverage && !formState.primaryInfoComplete) {
                formState.primaryInfoComplete = true;

                // Show primary section checkmark
                const primaryCheck = document.getElementById('primary-check');
                if (primaryCheck) {
                    primaryCheck.classList.remove('hidden');
                    primaryCheck.classList.add('visible');
                }

                // Update progress indicator
                updateProgress(1);

                // Show start date section with animation
                const startDateSection = document.getElementById('start-date-section');
                if (startDateSection) {
                    startDateSection.classList.remove('hidden');
                    startDateSection.classList.add('slide-in');
                }
            }
            validateForm();
        }

        // =================================================================
        // Update Progress Indicator
        // =================================================================

        function updateProgress(step) {
            // Mark step as completed
            const progressDot = document.getElementById(`progress-${step}`);
            const progressLine = document.getElementById(`progress-line-${step}`);

            if (progressDot) {
                progressDot.classList.add('completed');
                progressDot.classList.remove('active');
            }
            if (progressLine) {
                progressLine.classList.add('completed');
            }

            // Make next step active
            const nextDot = document.getElementById(`progress-${step + 1}`);
            if (nextDot) {
                nextDot.classList.add('active');
            }
        }

        // =================================================================
        // Start Date Options
        // =================================================================

        function generateStartDateOptions() {
            const container = document.getElementById('start-date-options');
            if (!container) return;

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            const today = new Date();
            let currentMonth = today.getMonth();
            let currentYear = today.getFullYear();

            for (let i = 0; i < 3; i++) {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'start-date-btn';
                btn.textContent = `${months[currentMonth]} 1, ${currentYear}`;
                btn.dataset.value = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;

                btn.addEventListener('click', function () {
                    container.querySelectorAll('.start-date-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');

                    // Show start section checkmark
                    const startCheck = document.getElementById('start-check');
                    if (startCheck) {
                        startCheck.classList.remove('hidden');
                        startCheck.classList.add('visible');
                    }

                    if (!formState.startDateSelected) {
                        formState.startDateSelected = true;

                        // Update progress indicator
                        updateProgress(2);

                        // Show discount section
                        const discountSection = document.getElementById('discount-section');
                        if (discountSection) {
                            discountSection.classList.remove('hidden');
                            discountSection.classList.add('slide-in');
                        }
                    }
                    validateForm();
                });

                container.appendChild(btn);
            }
        }

        // =================================================================
        // Primary Coverage Toggle (only shown when family members exist)
        // =================================================================

        function setupPrimaryCoverageToggle() {
            const container = document.getElementById('primary-coverage-toggle');
            if (!container) return;

            const buttons = container.querySelectorAll('.toggle-btn');
            const hiddenInput = document.getElementById('primary_needs_coverage');

            buttons.forEach(btn => {
                btn.addEventListener('click', function () {
                    buttons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    if (hiddenInput) {
                        hiddenInput.value = this.dataset.value;
                    }
                    validateForm();
                    checkPrimaryInfoComplete(); // Updated to ensure progress check
                });
            });
        }

        function showPrimaryCoverageToggle() {
            const coverageGroup = document.getElementById('primary-coverage-group');
            if (coverageGroup && coverageGroup.classList.contains('hidden')) {
                coverageGroup.classList.remove('hidden');
                coverageGroup.classList.add('slide-in');
            }
        }

        function hidePrimaryCoverageToggle() {
            const coverageGroup = document.getElementById('primary-coverage-group');
            if (coverageGroup) {
                coverageGroup.classList.add('hidden');
                coverageGroup.classList.remove('slide-in');
                // Reset to default "yes"
                const hiddenInput = document.getElementById('primary_needs_coverage');
                if (hiddenInput) hiddenInput.value = 'yes';
                const yesBtn = coverageGroup.querySelector('.toggle-btn[data-value="yes"]');
                if (yesBtn) {
                    coverageGroup.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                    yesBtn.classList.add('active');
                }
            }
        }

        // =================================================================
        // Discount Toggle
        // =================================================================

        function setupDiscountToggle() {
            const container = document.getElementById('discount-toggle');
            if (!container) return;

            const buttons = container.querySelectorAll('.toggle-btn');
            const hiddenInput = document.getElementById('wants_discount');

            buttons.forEach(btn => {
                btn.addEventListener('click', function () {
                    buttons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    if (hiddenInput) {
                        hiddenInput.value = this.dataset.value;
                    }

                    // Show discount section checkmark
                    const discountCheck = document.getElementById('discount-check');
                    if (discountCheck) {
                        discountCheck.classList.remove('hidden');
                        discountCheck.classList.add('visible');
                    }

                    if (!formState.discountSelected) {
                        formState.discountSelected = true;

                        // Update progress indicator
                        updateProgress(3);
                    }

                    const incomeSection = document.getElementById('income-section');
                    if (this.dataset.value === 'yes') {
                        incomeSection.classList.remove('hidden');
                        incomeSection.classList.add('slide-in');
                    } else {
                        incomeSection.classList.add('hidden');
                    }
                    validateForm();
                });
            });
        }

        // =================================================================
        // Income Fields
        // =================================================================

        function setupIncomeFields() {
            const incomeInput = document.getElementById('income');
            if (incomeInput) {
                incomeInput.addEventListener('input', function (e) {
                    let value = this.value.replace(/\D/g, '');
                    if (value) {
                        value = parseInt(value).toLocaleString();
                        this.classList.add('valid');
                    } else {
                        this.classList.remove('valid');
                    }
                    this.value = value;
                    validateForm();
                });
            }

            const taxHouseholdInput = document.getElementById('tax_household_size');
            if (taxHouseholdInput) {
                taxHouseholdInput.addEventListener('input', function () {
                    if (this.value && parseInt(this.value) > 0) {
                        this.classList.add('valid');
                    } else {
                        this.classList.remove('valid');
                    }
                    validateForm();
                });
            }
        }

        // =================================================================
        // Initial Attention Grabber
        // =================================================================

        const genderContainer = document.getElementById('primary-gender-toggle');

        // Initial Attention: Soft Blue Breathing Glow
        if (genderContainer) {
            const selected = genderContainer.querySelector('.gender-btn.active');
            if (!selected) {
                const btns = genderContainer.querySelectorAll('.gender-btn');
                btns.forEach(btn => btn.classList.add('attention-glow'));

                // Remove glow on first interaction
                genderContainer.addEventListener('click', () => {
                    btns.forEach(btn => btn.classList.remove('attention-glow'));
                }, { once: true });
            }
        }

        // =================================================================
        // Add Family Members
        // =================================================================

        function setupFamilyMemberButtons() {
            const familyContainer = document.getElementById('family-members-container');
            const addSpouseBtn = document.getElementById('add-spouse');
            const addChildBtn = document.getElementById('add-child');
            const addDependentBtn = document.getElementById('add-dependent');

            if (addSpouseBtn) {
                addSpouseBtn.addEventListener('click', () => addFamilyMember('Spouse'));
            }
            if (addChildBtn) {
                addChildBtn.addEventListener('click', () => addFamilyMember('Child'));
            }
            if (addDependentBtn) {
                addDependentBtn.addEventListener('click', () => addFamilyMember('Dependent'));
            }
        }

        function addFamilyMember(type) {
            const familyContainer = document.getElementById('family-members-container');
            const addSpouseBtn = document.getElementById('add-spouse');

            formState.memberCount++;
            const memberId = formState.memberCount;

            if (type === 'Spouse' && addSpouseBtn) {
                addSpouseBtn.disabled = true;
            }

            // Show primary coverage toggle when first member added
            showPrimaryCoverageToggle();

            const section = document.createElement('div');
            section.className = 'family-member-section compact';
            section.id = `member-${memberId}`;

            // Add legal note for spouse
            const legalNote = type === 'Spouse'
                ? '<div class="member-note">Note: Must be legally married. Domestic Partners must get quotes and apply separately.</div>'
                : type === 'Dependent'
                    ? '<div class="member-note">Only include dependents you claim on your taxes.</div>'
                    : '';

            section.innerHTML = `
                <div class="section-label">
                    <span>${type}</span>
                    <button type="button" class="remove-member-btn" data-member-id="${memberId}" data-type="${type}">&times;</button>
                </div>
                ${legalNote}
                
                <div class="form-group compact-group">
                    <label class="form-label-sm">Does this person need coverage?</label>
                    <div class="yes-no-toggle compact" id="member-coverage-${memberId}">
                        <button type="button" class="toggle-btn compact active" data-value="yes">Yes</button>
                        <button type="button" class="toggle-btn compact" data-value="no">No</button>
                    </div>
                </div>
                
                <div class="form-row compact-row">
                    <div class="form-group compact-group">
                        <label class="form-label-sm">Gender</label>
                        <div class="gender-toggle compact" id="member-gender-${memberId}">
                            <button type="button" class="gender-btn compact" data-value="male">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9.5 11c1.93 0 3.5 1.57 3.5 3.5S11.43 18 9.5 18 6 16.43 6 14.5 7.57 11 9.5 11zm0-2C6.46 9 4 11.46 4 14.5S6.46 20 9.5 20s5.5-2.46 5.5-5.5c0-1.16-.36-2.24-.97-3.12L18 7.42V10h2V4h-6v2h2.58l-3.97 3.97C11.73 9.36 10.65 9 9.5 9z"/></svg>
                            </button>
                            <button type="button" class="gender-btn compact" data-value="female">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0-2C8.13 2 5 5.13 5 9c0 3.09 2.01 5.71 4.8 6.63L9 17h2v2H9v2h6v-2h-2v-2h2l-.8-1.37C16.99 14.71 19 12.09 19 9c0-3.87-3.13-7-7-7z"/></svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-group compact-group flex-grow">
                        <label class="form-label-sm">Date of Birth</label>
                        <div class="dob-inputs compact">
                            <input type="text" class="dob-field compact dob-month" placeholder="mm" maxlength="2" inputmode="numeric" data-person="member-${memberId}">
                            <span class="dob-separator">/</span>
                            <input type="text" class="dob-field compact dob-day" placeholder="dd" maxlength="2" inputmode="numeric" data-person="member-${memberId}">
                            <span class="dob-separator">/</span>
                            <input type="text" class="dob-field compact dob-year" placeholder="yyyy" maxlength="4" inputmode="numeric" data-person="member-${memberId}">
                        </div>
                    </div>
                </div>
            `;

            familyContainer.appendChild(section);

            // Setup toggles for new member
            const coverageToggle = section.querySelector(`#member-coverage-${memberId}`);
            const genderToggle = section.querySelector(`#member-gender-${memberId}`);

            setupMemberToggle(coverageToggle);
            setupMemberToggle(genderToggle);

            // Setup DOB fields for new member
            const newDobFields = section.querySelectorAll('.dob-field');
            newDobFields.forEach(field => {
                field.addEventListener('input', function (e) {
                    this.value = this.value.replace(/\D/g, '');
                    const maxLength = parseInt(this.getAttribute('maxlength'));

                    // Add valid class when field is complete
                    if (this.value.length >= maxLength) {
                        this.classList.add('valid');
                        const next = this.nextElementSibling?.nextElementSibling;
                        if (next && next.classList.contains('dob-field')) {
                            next.focus();
                        }
                    } else {
                        this.classList.remove('valid');
                    }
                    validateForm();
                });
            });

            // Setup remove button
            const removeBtn = section.querySelector('.remove-member-btn');
            removeBtn.addEventListener('click', function () {
                const memberType = this.dataset.type;
                section.remove();

                if (memberType === 'Spouse' && addSpouseBtn) {
                    addSpouseBtn.disabled = false;
                }

                // Hide primary coverage toggle if no more family members
                const remainingMembers = document.querySelectorAll('.family-member-section');
                if (remainingMembers.length === 0) {
                    hidePrimaryCoverageToggle();
                }

                validateForm();
            });

            formState.familyMembers.push({ id: memberId, type });
            validateForm();
        }

        function setupMemberToggle(container) {
            if (!container) return;
            const buttons = container.querySelectorAll('.toggle-btn, .gender-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', function () {
                    buttons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    validateForm();
                });
            });
        }

        // =================================================================
        // Form Validation
        // =================================================================

        const submitBtn = document.getElementById('submit-btn');

        function validateForm() {
            let isValid = true;
            const errors = [];

            // Check primary info
            const gender = document.getElementById('primary_gender').value;
            const month = document.getElementById('primary-dob-month')?.value || '';
            const day = document.getElementById('primary-dob-day')?.value || '';
            const year = document.getElementById('primary-dob-year')?.value || '';
            const zip = document.getElementById('zipcode').value;

            if (!gender) {
                isValid = false;
                errors.push('Select gender');
            }
            if (month.length !== 2 || day.length !== 2 || year.length !== 4) {
                isValid = false;
                errors.push('Enter complete date of birth');
            }
            if (!window.isValidCAZip || !window.isValidCAZip(zip)) {
                isValid = false;
                errors.push('Enter valid California zip code');
            }
            // Check primary coverage
            const coverage = document.getElementById('primary_needs_coverage').value;
            if (!coverage) {
                isValid = false;
            }

            // Check start date (must be selected)
            const startDate = document.querySelector('.start-date-btn.active');
            if (!startDate) {
                isValid = false;
            }

            // Check discount selection
            const discountValue = document.getElementById('wants_discount').value;
            if (!discountValue) {
                isValid = false;
            }

            // If discount = yes, check income fields
            if (discountValue === 'yes') {
                const taxHousehold = document.getElementById('tax_household_size').value;
                const income = document.getElementById('income').value;
                if (!taxHousehold || !income) {
                    isValid = false;
                }
            }

            // Check family members
            const memberSections = document.querySelectorAll('.family-member-section');
            memberSections.forEach(section => {
                const genderToggle = section.querySelector('.gender-toggle .gender-btn.active');
                const month = section.querySelector('.dob-month').value;
                const day = section.querySelector('.dob-day').value;
                const year = section.querySelector('.dob-year').value;

                if (!genderToggle) {
                    isValid = false;
                }
                if (month.length !== 2 || day.length !== 2 || year.length !== 4) {
                    isValid = false;
                }
            });

            // Update button state
            if (submitBtn) {
                if (isValid) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('btn-disabled');
                } else {
                    submitBtn.disabled = true;
                    submitBtn.classList.add('btn-disabled');
                }
            }

            return isValid;
        }

        // =================================================================
        // Form Submission
        // =================================================================

        quoteForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validateForm()) {
                // Show error message
                const errorContainer = document.getElementById('form-errors');
                const errorText = document.getElementById('error-message-text');
                if (errorContainer && errorText) {
                    errorText.textContent = 'Please complete all required fields before continuing.';
                    errorContainer.classList.remove('hidden');
                    errorContainer.classList.add('slide-in');

                    // Hide after 5 seconds
                    setTimeout(() => {
                        errorContainer.classList.add('hidden');
                    }, 5000);
                }
                return;
            }

            const formData = {
                primary: {
                    gender: document.getElementById('primary_gender').value,
                    dob: `${document.getElementById('primary-dob-year').value}-${document.getElementById('primary-dob-month').value}-${document.getElementById('primary-dob-day').value}`,
                    zipcode: document.getElementById('zipcode').value,
                    needsCoverage: document.getElementById('primary_needs_coverage').value || 'yes'
                },
                startDate: document.querySelector('.start-date-btn.active')?.dataset.value,
                wantsDiscount: document.getElementById('wants_discount').value,
                familyMembers: []
            };

            if (formData.wantsDiscount === 'yes') {
                formData.taxHouseholdSize = document.getElementById('tax_household_size').value;
                formData.income = document.getElementById('income').value.replace(/,/g, '');
            }

            const memberSections = document.querySelectorAll('.family-member-section');
            memberSections.forEach(section => {
                const member = {
                    type: section.querySelector('.section-label span').textContent,
                    needsCoverage: section.querySelector('.yes-no-toggle .toggle-btn.active')?.dataset.value,
                    gender: section.querySelector('.gender-toggle .gender-btn.active')?.dataset.value,
                    dob: `${section.querySelector('.dob-year').value}-${section.querySelector('.dob-month').value}-${section.querySelector('.dob-day').value}`
                };
                formData.familyMembers.push(member);
            });

            console.log('Quote request:', formData);
            localStorage.setItem('hfc_quote_data', JSON.stringify(formData));

            // Track conversion if gtag is available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-XXXXXXXXX/XXXXXXXXXXXXXX'
                });
            }

            // Redirect to Health for California quote page
            // Note: HFC doesn't pre-fill from URL params, so users will enter info there
            window.location.href = 'https://www.healthforcalifornia.com/individual-and-family-quote';
        });
    }

    // =================================================================
    // EXISTING FUNCTIONALITY
    // =================================================================

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
