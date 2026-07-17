import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    setupScrollAnimations();
    setupGlassEffects();
    setupTimeCostCalculator();
});

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fade-in');

    if (!animatedElements.length || !('IntersectionObserver' in window)) {
        animatedElements.forEach((element) => element.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, activeObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('visible');
            activeObserver.unobserve(entry.target);
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.12,
    });

    animatedElements.forEach((element) => observer.observe(element));
}

function setupGlassEffects() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach((card) => {
        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

function setupTimeCostCalculator() {
    const calculator = document.querySelector('[data-time-cost-calculator]');

    if (!calculator) {
        return;
    }

    const priceInput = calculator.querySelector('[data-price]');
    const wageInput = calculator.querySelector('[data-wage]');
    const wageTypeInput = calculator.querySelector('[data-wage-type]');
    const hoursPerWeekInput = calculator.querySelector('[data-hours-week]');
    const hoursOutput = calculator.querySelector('[data-output-hours]');
    const daysOutput = calculator.querySelector('[data-output-days]');
    const weeksOutput = calculator.querySelector('[data-output-weeks]');
    const statusOutput = calculator.querySelector('[data-output-status]');

    if (!priceInput || !wageInput || !wageTypeInput || !hoursPerWeekInput) {
        return;
    }

    const numberFormatter = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 1,
    });

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    });

    const updateOutputs = () => {
        const price = Number.parseFloat(priceInput.value);
        const wage = Number.parseFloat(wageInput.value);
        const wageType = wageTypeInput.value;
        const hoursPerWeek = Number.parseFloat(hoursPerWeekInput.value);

        if (!Number.isFinite(price) || !Number.isFinite(wage) || !Number.isFinite(hoursPerWeek) || price <= 0 || wage <= 0 || hoursPerWeek <= 0) {
            setPlaceholderState();
            return;
        }

        let hourlyRate = wage;

        if (wageType === 'monthly') {
            hourlyRate = (wage * 12) / 52 / hoursPerWeek;
        } else if (wageType === 'yearly') {
            hourlyRate = wage / 52 / hoursPerWeek;
        }

        if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
            setPlaceholderState();
            return;
        }

        const workHours = price / hourlyRate;
        const workDays = workHours / 8;
        const workWeeks = workHours / hoursPerWeek;

        if (hoursOutput) {
            hoursOutput.textContent = `${numberFormatter.format(workHours)}h`;
        }

        if (daysOutput) {
            daysOutput.textContent = `${numberFormatter.format(workDays)} days`;
        }

        if (weeksOutput) {
            weeksOutput.textContent = `${numberFormatter.format(workWeeks)} weeks`;
        }

        if (statusOutput) {
            statusOutput.textContent = `${currencyFormatter.format(price)} costs about ${numberFormatter.format(workHours)} hours of work at your current rate.`;
        }
    };

    const setPlaceholderState = () => {
        if (hoursOutput) {
            hoursOutput.textContent = '--';
        }

        if (daysOutput) {
            daysOutput.textContent = '--';
        }

        if (weeksOutput) {
            weeksOutput.textContent = '--';
        }

        if (statusOutput) {
            statusOutput.textContent = 'Enter a price and income to estimate the work time behind a purchase.';
        }
    };

    [priceInput, wageInput, wageTypeInput, hoursPerWeekInput].forEach((field) => {
        field.addEventListener('input', updateOutputs);
        field.addEventListener('change', updateOutputs);
    });

    updateOutputs();
}
