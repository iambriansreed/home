const present = 2024;

const data: {
    svg: { github: string };
    skills: { title: string; progress: number; years: number }[];
    projects: {
        title: string;
        description: string;
        skills: string[];
        sources: { title: string; url: string }[];
    }[];
    questions: { title: string; answers: { title: string; failReason?: string }[]; id: string }[];
    skillLevels: { id: number; title: string; description: string; range: [number, number] }[];
} = {
    svg: {
        github: `<svg viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
    <g fill="currentcolor">
        <path clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
    </g>
</svg>`,
    },
    skillLevels: [
        { id: 1, title: 'Fundamental Awareness', description: 'basic knowledge', range: [0, 25] },
        { id: 2, title: 'Novice', description: 'limited experience', range: [25, 50] },
        { id: 3, title: 'Intermediate', description: 'practical application', range: [50, 75] },
        { id: 4, title: 'Advanced', description: 'applied theory', range: [75, 100] },
    ],
    skills: [
        { title: 'React', progress: 80, years: present - 2015 },
        { title: 'React Relay', progress: 50, years: 3 },
        { title: 'Redux', progress: 75, years: 5 },
        { title: 'VR Paintball', progress: 35, years: 2 },
        { title: 'React Native', progress: 50, years: 0.5 },
        { title: 'HyperText', progress: 60, years: present - 2007 },
        { title: 'CSS', progress: 85, years: present - 2007 },
        { title: 'Tailwind', progress: 70, years: 4 },
        { title: 'SASS', progress: 65, years: 6 },
        { title: 'Nunchucks', progress: 95, years: present - 1980 },
        { title: 'JavaScript', progress: 85, years: present - 2009 },
        { title: 'Angular', progress: 65, years: 3 },
        { title: 'Node.js', progress: 70, years: present - 2015 },
        { title: 'GraphQL', progress: 85, years: 7 },
        { title: 'Crane kick', progress: 70, years: present - 1984 },
        { title: 'TypeScript', progress: 76, years: present - 2015 },
        { title: 'Bowstaff', progress: 15, years: present - 1980 },
        { title: 'Sass/SCSS', progress: 85, years: present - 2013 },
        { title: 'C#', progress: 55, years: 6 },
        { title: 'PHP', progress: 70, years: 7 },
        { title: 'SQL', progress: 45, years: 8 },
        { title: 'Java', progress: 1, years: 0.1 },
        { title: 'Settlers of Catan', progress: 65, years: 18 },
        { title: 'Next.js', progress: 5, years: 0.1 },
    ],
    projects: [
        {
            title: `Sordle`,
            description: `A wordle clone that uses a static backend. You can play as much as you want. When you're done, it gives you the definition(s) of the word.`,
            skills: ['TypeScript', 'SASS', 'Vite'],
            sources: [
                { title: 'Frontend', url: 'https://github.com/iambriansreed/sordle' },
                { title: 'Backend (Static)', url: 'https://github.com/iambriansreed/sordle-words' },
            ],
        },
        {
            title: `Connect 4 - Human vs Robot`,
            description: `Engage in a game of Connect 4 against a robot. I consistently improve the robot's abilities to ensure it offers a competitive experience that keeps you entertained.`,
            skills: ['TypeScript', 'SASS', 'Vite'],
            sources: [{ title: 'Frontend', url: 'https://github.com/iambriansreed/connect4' }],
        },
        {
            title: `Socket Chat`,
            description: `A private chat application that ensures messages are only stored on the clients devices. It supports multiple rooms and only sends messages to the room the client is connected to. It leverages socket technology for real-time message transmission and employs a lightweight server to facilitate client connections.`,
            skills: ['TypeScript', 'SASS', 'Socket.io', 'Tailwind', 'Jest', 'Vite'],
            sources: [
                { title: 'Frontend', url: 'https://github.com/iambriansreed/comm-client' },
                { title: 'Backend', url: 'https://github.com/iambriansreed/comm-server' },
                { title: 'Utility', url: 'https://github.com/iambriansreed/comm-utils' },
            ],
        },
    ],
    questions: [
        {
            title: 'Is this role 100% remote?',
            answers: [
                { title: 'Yes' },
                {
                    title: 'No',
                    failReason: 'I am only taking roles that are 100% remote.',
                },
            ],
            id: 'remote',
        },
        {
            title: 'This role requires:',
            answers: [
                {
                    title: 'A bachelors or masters degree',
                    failReason: "Even though I love learning, I don't have a college degree.",
                },
                { title: 'A degree OR equivalent experience of at least 10 years' },
                { title: 'A degree OR equivalent experience of at least 5 years' },
            ],
            id: 'education',
        },
        {
            title: 'What type of role is this?',
            answers: [
                {
                    title: 'Junior / Intermediate',
                    failReason: 'I am looking for a Senior or higher role.',
                },
                { title: 'Other' },
                { title: 'Senior' },
                { title: 'Team Lead' },
                { title: 'Architect / Advisor' },
            ],
            id: 'role',
        },
        {
            title: 'What is the annual base compensation, salary not including bonuses?',
            answers: [
                {
                    title: 'Unavailable',
                    failReason: "If budgets aren't transparent we can't move forward.",
                },
                { title: 'below $150k' },
                { title: '$150k - $200k' },
                { title: '$200k - $250k' },
                { title: 'above $250k' },
            ],
            id: 'compensation',
        },
        {
            title: 'Is a sign-on bonus available?',
            answers: [{ title: 'Yes' }, { title: 'No' }],
            id: 'sign-on-bonus',
        },
        {
            title: 'This role requires expert knowledge in:',
            answers: [
                {
                    title: 'Java',
                    failReason:
                        'I am not an expert in Java. Did you mean JavaScript? I do have experience in other OOP languages, like C#.',
                },
                { title: 'React' },
                { title: 'React Native' },
                { title: 'Angular' },
                { title: 'Other' },
            ],
            id: 'expertise',
        },
        {
            title: 'What type of role is this?',
            answers: [
                { title: 'Full Time / Direct Hire' },
                { title: 'Contract to Hire' },
                { title: 'Freelance / 1099' },
            ],
            id: 'employment',
        },
        {
            title: 'How many interviews are part of the hiring process?',
            answers: [{ title: '3 or less' }, { title: '4 or more' }, { title: '5 or more' }],
            id: 'interviews',
        },
        {
            title: "How is the company's PTO benefit structured?",
            answers: [
                { title: 'Unlimited' },
                { title: '20 days or more including holidays' },
                { title: '10 days or more excluding holidays' },
                { title: 'Other' },
            ],
            id: 'vacation',
        },
    ],
};

export default data;
