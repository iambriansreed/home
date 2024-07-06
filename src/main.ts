import './style.scss';
import { $, $$ } from './utils';
import data from './data';

export const isTouchDevice = 'ontouchstart' in window;

[
    { weight: 50, url: 'Metropolis-Thin.woff2' },
    { weight: 200, url: 'Metropolis-Light.woff2' },
    { weight: 500, url: 'Metropolis-SemiBold.woff2' },
].forEach(async ({ url, weight }) =>
    document.fonts.add(
        await new FontFace('base', `url(/fonts/${url})`, {
            weight: weight.toString(),
        }).load()
    )
);

async function main() {
    await document.fonts.ready;

    // if (window.location.hash !== '#recruiters') window.location.hash = '';

    $('body > .loading')!.remove();
    $('.sections')!.removeAttribute('style');
    $('body > footer')!.removeAttribute('style');

    function nextSubtitle(subtitle: Element | null) {
        setTimeout(() => {
            if (!subtitle) return;
            subtitle.classList.add('show');

            nextSubtitle(subtitle.nextElementSibling);
        }, 250);
    }

    nextSubtitle($('#welcome ul li:first-child'));

    const scrollElement = document.location.hash && $(document.location.hash);
    if (scrollElement) scrollElement.scrollIntoView({ behavior: 'smooth' });

    document.querySelectorAll('section').forEach((target) => {
        new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => entry.target.classList.toggle('active', entry.isIntersecting));
            },
            {
                rootMargin: '-20% 0px -20% 0px',
            }
        ).observe(target);
    });

    const nav = $('nav')!;

    let setNavActiveTimeout: ReturnType<typeof setTimeout> | null = null;
    function setNavActive(active: boolean, force?: boolean) {
        if (active === nav.classList.contains('active') && !setNavActiveTimeout) return;

        if (setNavActiveTimeout) clearTimeout(setNavActiveTimeout);
        setNavActiveTimeout = setTimeout(
            () => {
                nav.classList.toggle('active', active);
                console.log('setNavActive', active);
                setNavActiveTimeout = null;
            },
            force ? 0 : 1000
        );
    }

    // nav
    {
        nav.addEventListener('click', () => setNavActive(true, true));
        nav.addEventListener('mouseleave', () => setNavActive(false));
        nav.addEventListener('mouseenter', () => setNavActive(true));

        let intervalClick: ReturnType<typeof setInterval>;
        $$<HTMLAnchorElement>('a', nav).forEach((link) => {
            link.addEventListener('click', function (e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                setNavActive(false);

                clearInterval(intervalClick);
                // nav.style.pointerEvents = 'none';
                // nav.style.transitionDelay = '0s';
                const section = $('#' + link.href.split('#')[1]);
                section!.focus();
                intervalClick = setInterval(() => {
                    // nav.style.pointerEvents = 'all';
                    // nav.style.transitionDelay = '';
                }, 1000);
            });
        });

        setTimeout(() => setNavActive(false), 1000);
    }

    window.addEventListener('scroll', function () {
        document.body.classList.remove('active');
        setNavActive(false);
    });

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
            window.location.hash = '#recruiters';
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

        const button = $('button', form)!;
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
