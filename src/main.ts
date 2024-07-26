import './style.scss';
import { $, $$, intersecting } from './utils';
import data from './data';

export const isTouchDevice = 'ontouchstart' in window;

[{ weight: 200, url: 'Metropolis-Light.woff2' }].forEach(async ({ url, weight }) =>
    document.fonts.add(
        await new FontFace('base', `url(/fonts/${url})`, {
            weight: weight.toString(),
        }).load()
    )
);

async function main() {
    await document.fonts.ready;

    $('body > .loading')!.remove();
    $('.sections')!.removeAttribute('style');
    $('body > footer')!.removeAttribute('style');

    // toggleVisibility
    {
        const toggleVisibilityElements = $$('#skills li, .progress-bar, h2, h3, h4, article, fieldset');
        toggleVisibilityElements.forEach((element) => element.classList.add('invisible'));

        intersecting(
            toggleVisibilityElements,
            (entry, observer) => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('invisible');
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.5,
            }
        );
    }

    let setActiveSection = (_sectionId: string) => {};

    // nav
    {
        const nav = $('nav')!;

        let timeout: ReturnType<typeof setTimeout> | undefined;
        function toggleActiveDebounce(isActive: boolean | undefined = undefined) {
            timeout && clearTimeout(timeout);
            timeout = setTimeout(
                () => {
                    nav.classList.toggle('active', isActive);
                },
                timeout ? 250 : 1
            );
        }

        nav.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            toggleActiveDebounce();
        });

        nav.addEventListener('mouseenter', () => toggleActiveDebounce(true));
        nav.addEventListener('mouseleave', () => toggleActiveDebounce(false));

        const liElements = $$<HTMLLIElement>('li[data-section]', nav);

        setActiveSection = (sectionId: string) => {
            window.history.pushState({}, '', sectionId !== 'welcome' ? '/' + sectionId : '/');
            liElements.forEach((element) => {
                const elementSectionId = element.dataset.section!;
                element.classList.toggle('active', elementSectionId === sectionId);
            });
        };

        liElements.forEach((li) => {
            const sectionId = li.dataset.section!;
            const link = li.firstElementChild as HTMLAnchorElement;

            link.addEventListener('click', () => {
                setActiveSection(sectionId);
                $('#' + sectionId)!!.scrollIntoView({ behavior: 'instant' });
            });
        });

        intersecting($$('[data-anchor-id]'), (entry) => {
            const sectionId = (entry.target as HTMLElement).dataset.anchorId!;
            if (entry.isIntersecting) {
                setActiveSection(sectionId);
            }
        });

        setTimeout(() => {
            const initialSection = data.navigation.find(
                ({ id }) => window.location.pathname.includes(id) || window.location.hash.includes(id)
            );

            if (initialSection) {
                const sectionId = initialSection?.id;
                setActiveSection(sectionId);
                $('#' + sectionId)!.scrollIntoView({ behavior: 'instant' });
            } else setActiveSection('welcome');
        }, 1);
    }

    type ContactResponse = {
        email: string;
        message: string;
        type: 'contact' | 'quiz';
    };

    async function send(data: ContactResponse) {
        return Promise.all([
            new Promise<void>((resolve) => setTimeout(resolve, 1000)),
            fetch('https://api.iambrian.com/' + data.type, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then((response) => response.json()),
        ]).then(([, response]) => response);
    }

    {
        // contact
        const form = $<HTMLFormElement>('#contact form')!;
        const textarea = $<HTMLTextAreaElement>('textarea', form)!;
        const missingEmail = $('.error-description', form)!;
        const foundEmail = $('.found-email span', form)!;
        const button = $<HTMLButtonElement>('[type="submit"]', form)!;

        missingEmail.addEventListener('click', () => {
            const active = $('.active', missingEmail)!;
            active.classList.remove('active');
            const nextElement = active.nextElementSibling || missingEmail.firstElementChild;
            nextElement!.classList.add('active');
        });

        const getEmail = () => textarea.value.match(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/)?.[0] || '';

        textarea.addEventListener('input', function () {
            // sat lines
            const lines = textarea.value.split('\n').length;
            textarea.setAttribute('rows', lines.toString());

            const email = getEmail();

            form.classList.toggle('has-error', !email);

            form.classList.toggle('has-email', !!email);

            foundEmail.innerText = email || '';
        });

        $('button', form)!?.addEventListener('click', function () {
            form.classList.add('submitted');
            const email = getEmail();
            form.classList.toggle('has-error', !email);
        });

        form.addEventListener('submit', async function () {
            const emailValue = getEmail();

            if (!emailValue) {
                missingEmail.classList.add('horizontal-shake');
                missingEmail.click();
                setTimeout(() => missingEmail.classList.remove('horizontal-shake'), 500);
                return;
            }

            button.classList.add('busy');
            button.disabled = true;
            textarea.disabled = true;

            try {
                await send({
                    email: emailValue,
                    message: textarea.value,
                    type: 'contact',
                });
                form.classList.add('success');
            } catch (e) {
                console.error(e);
            }
        });
    }

    // recruiting
    {
        const recruiters = $('#recruiters')!;
        const form = $<HTMLFormElement>('form', recruiters)!;
        const formSend = $<HTMLFormElement>('form.send', recruiters)!;
        const setState = (state: 'intro' | 'quiz' | 'pass' | 'fail' | 'sending' | 'sent') => {
            recruiters.dataset.state = state;
        };

        $('[data-start-quiz]', recruiters)!.addEventListener('click', function () {
            setState('quiz');
            setActiveSection(recruiters.id);
            recruiters.scrollIntoView({ behavior: 'instant' });
        });

        const fields = () =>
            data.questions.map((question) => ({
                id: question.id,
                title: question.title,
                value: form[question.id].value,
            }));

        const hasFailed = () => fields().some((fields) => fields.value === 'fail');

        form.addEventListener('change', function () {
            setState(hasFailed() ? 'fail' : 'quiz');
        });

        const button = $('button.check-results', form)!;
        button!.addEventListener('click', async function () {
            form.classList.add('submitted');

            setState(hasFailed() ? 'fail' : 'quiz');
        });

        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            button.classList.add('busy');

            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (hasFailed()) {
                setState('fail');
                return;
            }

            setState('pass');
            button.classList.remove('busy');
        });

        // formSend
        {
            $('button', formSend)!.addEventListener('click', function () {
                formSend.classList.add('submitted');
                formSend.classList.toggle('error', !emailInput.validity.valid);
            });

            const emailInput = $<HTMLInputElement>('[type="email"]', formSend)!;

            emailInput.addEventListener('input', function () {
                if (formSend.classList.contains('submitted'))
                    formSend.classList.toggle('error', !emailInput.validity.valid);
            });

            emailInput.oninvalid = (e) => e.preventDefault();

            formSend.addEventListener('submit', async function () {
                if (!emailInput.validity.valid) return;

                $('button', formSend)?.classList.add('busy');
                emailInput.disabled = true;

                setState('sending');

                await send({
                    email: emailInput.value,
                    message: JSON.stringify(fields()),
                    type: 'quiz',
                });

                setState('sent');
            });
        }
    }

    return Promise.resolve();
}

// @ts-ignore
window.test = {
    fillQuiz() {
        $('[data-start-quiz]')!.click();
        $$('[type="radio"]:not([value="fail"])').forEach((radio) => radio.click());
    },
};

main();
