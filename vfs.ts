import { VFSFile, VFSDirectory, Project, CaseStudy, AppID } from './types';
import { portfolioData, caseStudies } from './data';
import { APPS } from './constants';

const createProjectReadme = (project: Project): string => `
# ${project.title}
*Category: ${project.category}*

${project.description}

${project.contributions ? `### Contributions\n${project.contributions.map(c => `- ${c}`).join('\n')}` : ''}
${project.tasks ? `### Tasks\n${project.tasks.map(t => `- ${t}`).join('\n')}` : ''}
${project.features ? `### Features\n${project.features.map(f => `- ${f}`).join('\n')}` : ''}

### Links
${Object.entries(project.links).map(([key, value]) => value ? `- [${key.charAt(0).toUpperCase() + key.slice(1)}](${value})` : '').filter(Boolean).join('\n')}
`;

const createCaseStudyFileContent = (caseStudy: CaseStudy): string => `
# ${caseStudy.title}
*${caseStudy.subtitle} - ${caseStudy.date}*

---

${caseStudy.content}
`;

const buildVFS = (): VFSDirectory => {
    const root: VFSDirectory = {
        type: 'directory',
        name: '~',
        children: {},
    };

    // Create main user directories
    root.children['Desktop'] = { type: 'directory', name: 'Desktop', children: {} } as VFSDirectory;
    root.children['Documents'] = { type: 'directory', name: 'Documents', children: {} } as VFSDirectory;
    root.children['Projects'] = { type: 'directory', name: 'Projects', children: {} } as VFSDirectory;
    root.children['CaseStudies'] = { type: 'directory', name: 'Case Studies', children: {} } as VFSDirectory;

    const desktopDir = root.children['Desktop'] as VFSDirectory;
    
    // Add standard files to Desktop
    desktopDir.children['README.txt'] = {
        type: 'file',
        name: 'README.txt',
        content: portfolioData.readme,
    } as VFSFile;
    desktopDir.children['resume.pdf'] = {
        type: 'file',
        name: 'resume.pdf',
        content: '/tanmay-resume.pdf',
        isLink: true,
    } as VFSFile;

    // *** NEW: Create an "Apps" folder on the Desktop ***
    desktopDir.children['Apps'] = { type: 'directory', name: 'Apps', children: {} } as VFSDirectory;
    const appsDir = desktopDir.children['Apps'] as VFSDirectory;

    // *** NEW: Populate the "Apps" folder with shortcuts to all visible apps ***
    const visibleApps = APPS.filter(app => !app.hidden);
    visibleApps.forEach(app => {
        appsDir.children[`${app.title}.shortcut`] = {
            type: 'file',
            name: app.title,
            content: `Shortcut to the ${app.title} application.`,
            isShortcut: true,
            appId: app.id as AppID,
        } as VFSFile;
    });

    // Populate Projects directory
    const projectsDir = root.children['Projects'] as VFSDirectory;
    portfolioData.projects.forEach(project => {
        const projectDirName = project.title.replace(/[^a-zA-Z0-9]/g, '_');
        projectsDir.children[projectDirName] = {
            type: 'directory',
            name: project.title,
            children: {
                'README.md': {
                    type: 'file',
                    name: 'README.md',
                    content: createProjectReadme(project)
                } as VFSFile
            }
        } as VFSDirectory;
    });

    // Populate Case Studies directory
    const caseStudiesDir = root.children['CaseStudies'] as VFSDirectory;
    caseStudies.forEach(caseStudy => {
        const caseStudyFileName = `${caseStudy.id}.md`;
        caseStudiesDir.children[caseStudyFileName] = {
            type: 'file',
            name: `${caseStudy.title}.md`,
            content: createCaseStudyFileContent(caseStudy),
        } as VFSFile;
    });
    
    // Add resume to Documents as well
     (root.children['Documents'] as VFSDirectory).children['resume.pdf'] = {
        type: 'file',
        name: 'resume.pdf',
        content: '/tanmay-resume.pdf',
        isLink: true,
    } as VFSFile;

    return root;
};

export const VFS = buildVFS();
