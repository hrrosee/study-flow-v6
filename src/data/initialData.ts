import { Workspace, Section, Topic, Task, RecycleItem } from '../types';

export const INITIAL_WORKSPACES: Workspace[] = [
  { id: 'ws-1', name: 'English', isStarred: true, createdAt: '2026-07-20T10:00:00Z' },
  { id: 'ws-2', name: 'বাংলাদেশ', isStarred: false, createdAt: '2026-07-21T10:00:00Z' },
  { id: 'ws-3', name: 'ssss', isStarred: false, createdAt: '2026-07-22T10:00:00Z' },
  { id: 'ws-4', name: 'Math', isStarred: true, createdAt: '2026-07-23T10:00:00Z' },
];

export const INITIAL_SECTIONS: Section[] = [
  { id: 'sec-1', workspaceId: 'ws-1', name: 'Grammar' },
  { id: 'sec-2', workspaceId: 'ws-1', name: 'Vocabulary' },
  { id: 'sec-3', workspaceId: 'ws-1', name: 'Writing' },
  { id: 'sec-4', workspaceId: 'ws-1', name: 'Speaking' },

  { id: 'sec-5', workspaceId: 'ws-2', name: 'ব্যাকরণ' },
  { id: 'sec-6', workspaceId: 'ws-2', name: 'সাহিত্য' },

  { id: 'sec-7', workspaceId: 'ws-4', name: 'Algebra' },
  { id: 'sec-8', workspaceId: 'ws-4', name: 'Geometry' },
];

export const INITIAL_TOPICS: Topic[] = [
  { id: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', name: 'Verb', isCollapsed: false },
  { id: 'top-2', sectionId: 'sec-1', workspaceId: 'ws-1', name: 'Tense', isCollapsed: false },
  { id: 'top-3', sectionId: 'sec-2', workspaceId: 'ws-1', name: 'Synonyms', isCollapsed: false },
  { id: 'top-4', sectionId: 'sec-2', workspaceId: 'ws-1', name: 'Antonyms', isCollapsed: false },
];

export const INITIAL_TASKS: Task[] = [
  // Under Topic "Verb" (sec-1)
  { id: 'task-1', topicId: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', title: 'Cognate Verb', completed: true, createdDate: '21/07/2026', createdTime: '10:46 PM', completedAt: '2026-07-28T10:00:00Z' },
  { id: 'task-2', topicId: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', title: 'Auxiliary verb', completed: true, createdDate: '21/07/2026', createdTime: '10:46 PM', completedAt: '2026-07-28T10:15:00Z' },
  { id: 'task-3', topicId: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', title: 'Subtask 4', completed: false, createdDate: '21/07/2026', createdTime: '01:46 PM' },
  { id: 'task-4', topicId: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', title: '111', completed: true, createdDate: '27/07/2026', createdTime: '01:29 PM', completedAt: '2026-07-28T10:30:00Z' },
  { id: 'task-5', topicId: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', title: '1111', completed: false, createdDate: '27/07/2026', createdTime: '01:29 PM' },
  { id: 'task-6', topicId: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', title: '25252', completed: false, createdDate: '27/07/2026', createdTime: '01:29 PM' },
  { id: 'task-7', topicId: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', title: 'Transitive Verb', completed: false, createdDate: '28/07/2026', createdTime: '09:00 AM' },
  { id: 'task-8', topicId: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', title: 'Intransitive Verb', completed: false, createdDate: '28/07/2026', createdTime: '09:05 AM' },
  { id: 'task-9', topicId: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', title: 'Modal Verb', completed: false, createdDate: '28/07/2026', createdTime: '09:10 AM' },
  { id: 'task-10', topicId: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', title: 'Phrasal Verbs', completed: false, createdDate: '28/07/2026', createdTime: '09:15 AM' },
  { id: 'task-11', topicId: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', title: 'Irregular Verbs', completed: false, createdDate: '28/07/2026', createdTime: '09:20 AM' },
  { id: 'task-12', topicId: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', title: 'Gerunds & Infinitives', completed: false, createdDate: '28/07/2026', createdTime: '09:25 AM' },

  // Under Topic "Tense" (sec-1)
  { id: 'task-13', topicId: 'top-2', sectionId: 'sec-1', workspaceId: 'ws-1', title: 'Subtask 1', completed: false, createdDate: '26/07/2026', createdTime: '09:00 AM' },
  { id: 'task-14', topicId: 'top-2', sectionId: 'sec-1', workspaceId: 'ws-1', title: 'Subtask 2', completed: false, createdDate: '26/07/2026', createdTime: '09:00 AM' },
];

export const INITIAL_RECYCLE_ITEMS: RecycleItem[] = [
  {
    id: 'rec-1',
    type: 'workspace',
    name: 'StudyFlow Workspace',
    deletedFrom: '—',
    deletedOn: 'Jul 28, 2026 10:46 PM',
    daysLeft: 29,
    originalData: {
      workspace: { id: 'ws-old-1', name: 'StudyFlow Workspace', createdAt: '2026-06-01' }
    }
  },
  {
    id: 'rec-2',
    type: 'section',
    name: 'Grammar Section',
    deletedFrom: 'StudyFlow Workspace',
    deletedOn: 'Jul 28, 2026 10:43 PM',
    daysLeft: 29,
    originalData: {
      section: { id: 'sec-old-1', workspaceId: 'ws-1', name: 'Grammar Section' }
    }
  },
  {
    id: 'rec-3',
    type: 'section',
    name: 'Tense Section',
    deletedFrom: 'StudyFlow Workspace',
    deletedOn: 'Jul 27, 2026 01:29 PM',
    daysLeft: 28,
    originalData: {
      section: { id: 'sec-old-2', workspaceId: 'ws-1', name: 'Tense Section' }
    }
  },
  {
    id: 'rec-4',
    type: 'topic',
    name: 'Cognate Verb',
    deletedFrom: 'StudyFlow Workspace > Grammar',
    deletedOn: 'Jul 27, 2026 01:29 PM',
    daysLeft: 28,
    originalData: {
      topic: { id: 'top-old-1', sectionId: 'sec-1', workspaceId: 'ws-1', name: 'Cognate Verb' }
    }
  },
  {
    id: 'rec-5',
    type: 'topic',
    name: 'Auxiliary verb',
    deletedFrom: 'StudyFlow Workspace > Grammar',
    deletedOn: 'Jul 27, 2026 01:29 PM',
    daysLeft: 28,
    originalData: {
      topic: { id: 'top-old-2', sectionId: 'sec-1', workspaceId: 'ws-1', name: 'Auxiliary verb' }
    }
  },
  {
    id: 'rec-6',
    type: 'topic',
    name: '111',
    deletedFrom: 'StudyFlow Workspace > Grammar',
    deletedOn: 'Jul 27, 2026 01:29 PM',
    daysLeft: 28,
    originalData: {
      topic: { id: 'top-old-3', sectionId: 'sec-1', workspaceId: 'ws-1', name: '111' }
    }
  },
  {
    id: 'rec-7',
    type: 'task',
    name: 'Subtask 4',
    deletedFrom: 'StudyFlow Workspace > Grammar > Cognate Verb',
    deletedOn: 'Jul 27, 2026 01:46 PM',
    daysLeft: 28,
    originalData: {
      task: { id: 'task-old-1', topicId: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', title: 'Subtask 4', completed: false, createdDate: '21/07/2026', createdTime: '01:46 PM' }
    }
  },
  {
    id: 'rec-8',
    type: 'task',
    name: '1111',
    deletedFrom: 'StudyFlow Workspace > Grammar > 111',
    deletedOn: 'Jul 27, 2026 01:29 PM',
    daysLeft: 28,
    originalData: {
      task: { id: 'task-old-2', topicId: 'top-1', sectionId: 'sec-1', workspaceId: 'ws-1', title: '1111', completed: false, createdDate: '27/07/2026', createdTime: '01:29 PM' }
    }
  }
];
