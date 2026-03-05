import webApplicationTestScenarios from '../data/testscenarios/web-application.json';
import mobileApplicationTestScenarios from '../data/testscenarios/mobile-application.json';
import projectRunConfig from '../data/project-run-config.json';

type ProjectKey = 'webApplication' | 'mobileApplication';

export type ProjectRunConfig = {
  credentials: {
    email: string;
    password: string;
  };
  targetProjectDefault: string;
  targetProjects?: 'all' | ProjectKey[];
  projectLabels?: Record<ProjectKey, string>;
  projects?: Record<ProjectKey, string>;
  execution?: {
    all?: boolean;
    webApplication?: boolean;
    mobileApplication?: boolean;
  };
};

export type TestScenario = {
  id: number;
  name: string;
  project: string;
  task: string;
  column: string;
  tags: string[];
};

export const runConfig = projectRunConfig as ProjectRunConfig;

const defaultProjectLabels: Record<ProjectKey, string> = {
  webApplication: 'Web Application',
  mobileApplication: 'Mobile Application'
};

const projectLabels = runConfig.projectLabels ?? runConfig.projects ?? defaultProjectLabels;

export const categorizedTestScenarios: Record<string, TestScenario[]> = {
  [projectLabels.webApplication]: webApplicationTestScenarios as TestScenario[],
  [projectLabels.mobileApplication]: mobileApplicationTestScenarios as TestScenario[]
};

const projectKeyByName: Record<string, ProjectKey> = {
  [projectLabels.webApplication.toLowerCase().replace(/\s+/g, '')]: 'webApplication',
  [projectLabels.mobileApplication.toLowerCase().replace(/\s+/g, '')]: 'mobileApplication'
};

function getConfigKey(projectName: string): ProjectKey {
  const normalized = projectName.toLowerCase().replace(/\s+/g, '').trim();
  return projectKeyByName[normalized];
}

export function shouldRunProject(projectName: string): boolean {
  if (!runConfig.targetProjects || runConfig.targetProjects === 'all') {
    return true;
  }

  const configKey = getConfigKey(projectName);
  if (runConfig.targetProjects.includes(configKey)) {
    return true;
  }

  if (runConfig.execution?.all) {
    return true;
  }

  return Boolean(runConfig.execution?.[configKey]);
}

export function shouldRunRequestedProject(projectName: string): boolean {
  const requested = (process.env.TARGET_PROJECT ?? runConfig.targetProjectDefault)
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim();

  const currentProject = projectName.toLowerCase().replace(/\s+/g, '');

  if (!requested || requested === 'all') {
    return true;
  }

  return requested === currentProject;
}
