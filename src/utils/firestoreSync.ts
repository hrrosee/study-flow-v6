import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { UserSettings } from '../types';
import { StreakData } from './streakManager';

export interface StudyFlowCloudData {
  workspaces?: any[];
  workspaceSections?: Record<string, any[]>;
  activeWorkspaceId?: string;
  topics?: any[];
  deletedTopics?: any[];
  deletedWorkspaces?: any[];
  deletedNotes?: any[];
  deletedSections?: any[];
  deletedTasks?: any[];
  deletedTopicNotes?: any[];
  deletedTopicLinks?: any[];
  notes?: any[];
  standaloneTasks?: any[];
  userSettings?: UserSettings;
  streakData?: StreakData;
  updatedAt?: any;
}

/**
 * Save user data to Firestore Cloud Database
 */
export const saveUserDataToCloud = async (userId: string, data: StudyFlowCloudData) => {
  if (!userId) return;
  try {
    const userDocRef = doc(db, 'users', userId, 'data', 'studyflow');
    const syncData = { ...data };
    if (syncData.userSettings) {
      const { theme, ...restSettings } = syncData.userSettings as any;
      syncData.userSettings = restSettings;
    }
    await setDoc(userDocRef, {
      ...syncData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving data to Firestore:', error);
  }
};

/**
 * Fetch initial user data from Firestore Cloud Database
 */
export const fetchUserDataFromCloud = async (userId: string): Promise<StudyFlowCloudData | null> => {
  if (!userId) return null;
  try {
    const userDocRef = doc(db, 'users', userId, 'data', 'studyflow');
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as StudyFlowCloudData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    return null;
  }
};

/**
 * Real-time listener for user data updates from Firestore
 */
export const subscribeToCloudData = (
  userId: string, 
  onData: (data: StudyFlowCloudData) => void
) => {
  if (!userId) return () => {};
  const userDocRef = doc(db, 'users', userId, 'data', 'studyflow');
  return onSnapshot(userDocRef, (snap) => {
    if (snap.exists()) {
      onData(snap.data() as StudyFlowCloudData);
    }
  }, (error) => {
    console.error('Firestore real-time subscription error:', error);
  });
};
