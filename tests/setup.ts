import webApplicationTestScenarios from '../data/testscenarios/web-application.json';
import mobileApplicationTestScenarios from '../data/testscenarios/mobile-application.json';
import projectRunConfig from '../data/project-run-config.json';

export type ProjectRunConfig = {
  credentials: {
    email: string;
    password: string;
  };
  targetProjectDefault: string;
  projects: {
    webApplication: string;
    mobileApplication: string;
  };
  execution: {
    all: boolean;
    webApplication: boolean;
    mobileApplication: boolean;
  };
};

export type TestScenario = {
  id: number;
  name: string;
  project: string;
  task: string;
  column: string;
  tags: string[];
  expectedResult?: 'positive' | 'negative';
  negativeCheck?: 'taskNotFound' | 'taskNotInColumn' | 'missingTags' | 'projectNotFound';
};

export const runConfig = projectRunConfig as ProjectRunConfig;

export const categorizedTestScenarios: Record<string, TestScenario[]> = {
  [runConfig.projects.webApplication]: webApplicationTestScenarios as TestScenario[],
  [runConfig.projects.mobileApplication]: mobileApplicationTestScenarios as TestScenario[]
};

const projectKeyByName: Record<string, keyof Omit<ProjectRunConfig['execution'], 'all'>> = {
  [runConfig.projects.webApplication.toLowerCase().replace(/\s+/g, '')]: 'webApplication',
  [runConfig.projects.mobileApplication.toLowerCase().replace(/\s+/g, '')]: 'mobileApplication'
};

function getConfigKey(projectName: string): keyof Omit<ProjectRunConfig['execution'], 'all'> {
  const normalized = projectName.toLowerCase().replace(/\s+/g, '').trim();
  return projectKeyByName[normalized];
}

export function shouldRunProject(projectName: string): boolean {
  if (runConfig.execution.all) {
    return true;
  }

  const configKey = getConfigKey(projectName);
  return runConfig.execution[configKey];
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
