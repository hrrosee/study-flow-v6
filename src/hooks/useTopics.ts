import { useState, useMemo } from 'react';

export interface TopicType {
  id: number;                     // Unique, sequential integers: 1, 2, 3...
  title: string;
  isPinned: boolean;
  pinnedPosition: number | null;  // Independent order position: 1, 2, or 3
  pinnedId?: number | null;       // Separate identifier for rearranging pinned topics
  isDeleted: boolean;             // Set to true for soft-delete/recycle bin
}

export function useTopics(initialTopics: TopicType[] = []) {
  const [topics, setTopics] = useState<TopicType[]>(initialTopics);

  /**
   * RULE 1: CREATE TOPIC
   * Find the maximum id in the current list and add 1 to it.
   */
  const createTopic = (title: string): { success: boolean; message: string; topic: TopicType } => {
    const trimmed = title.trim();
    if (!trimmed) {
      return { success: false, message: "Title cannot be empty.", topic: null as any };
    }
    const maxId = topics.reduce((max, t) => (t.id > max ? t.id : max), 0);
    const newId = maxId + 1;
    const newTopic: TopicType = {
      id: newId,
      title: trimmed,
      isPinned: false,
      pinnedPosition: null,
      pinnedId: null,
      isDeleted: false
    };
    setTopics(prev => [...prev, newTopic]);
    return { success: true, message: `Topic "${trimmed}" created successfully with ID ${newId}.`, topic: newTopic };
  };

  /**
   * Sorting & Rendering Selector
   * The active topic list on the web page must ALWAYS be rendered using this strict sorting priority:
   * "isPinned DESC, pinnedPosition ASC, id ASC".
   */
  const activeSortedTopics = useMemo(() => {
    return topics
      .filter(t => !t.isDeleted)
      .sort((a, b) => {
        // Pinned topics first (isPinned DESC)
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1;
        }
        // If both are pinned, order strictly by pinnedPosition ASC
        if (a.isPinned && a.pinnedPosition !== null && b.pinnedPosition !== null) {
          return a.pinnedPosition - b.pinnedPosition;
        }
        // If neither is pinned, order strictly by sequential id ASC
        return a.id - b.id;
      });
  }, [topics]);

  /**
   * Helper selector for Recycle Bin
   */
  const recycleBinTopics = useMemo(() => {
    return topics.filter(t => t.isDeleted);
  }, [topics]);

  /**
   * RULE 2: Soft Delete & ID Freeze
   * Sets isDeleted = true.
   * Pinned topics cannot be deleted directly while pinned (must be unpinned first).
   * Topic ID remains completely frozen; no other topic shifts or takes its ID.
   */
  const softDeleteTopic = (id: number): { success: boolean; message: string } => {
    const topic = topics.find(t => t.id === id);
    if (!topic) {
      return { success: false, message: "Topic not found." };
    }
    if (topic.isPinned) {
      return { success: false, message: "Cannot delete a pinned topic. Please unpin it first." };
    }

    setTopics(prev =>
      prev.map(t => (t.id === id ? { ...t, isDeleted: true } : t))
    );
    return { success: true, message: `Topic "${topic.title}" moved to Recycle Bin.` };
  };

  /**
   * RULE 3: Main Section Reordering Logic (with Frozen IDs)
   * - Reordering regular active topics must NOT affect pinned topics or deleted topics.
   * - Swap/shift the IDs of currently VISIBLE (Active, non-pinned) topics.
   * - If there is a frozen ID (soft-deleted) sitting numerically within the drag-and-drop range,
   *   this function skips that frozen ID and leaves its ID completely untouched.
   */
  const reorderMainTopics = (draggedId: number, targetId: number): { success: boolean; message: string } => {
    // Get visible active non-pinned topics, sorted by ID ascending
    const visibleActive = topics
      .filter(t => !t.isDeleted && !t.isPinned)
      .sort((a, b) => a.id - b.id);

    const draggedIndex = visibleActive.findIndex(t => t.id === draggedId);
    const targetIndex = visibleActive.findIndex(t => t.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return { success: false, message: "Invalid drag or target topic." };
    }

    // Extract original IDs of the visible topics in ascending order
    const originalIds = visibleActive.map(t => t.id);

    // Perform standard array move on the visible topics
    const rearrangedVisible = [...visibleActive];
    const [movedTopic] = rearrangedVisible.splice(draggedIndex, 1);
    rearrangedVisible.splice(targetIndex, 0, movedTopic);

    // Map the original set of sequential IDs back to the rearranged visible topics
    const updatedVisibleMap = new Map<number, number>();
    rearrangedVisible.forEach((topic, index) => {
      updatedVisibleMap.set(topic.id, originalIds[index]);
    });

    setTopics(prev =>
      prev.map(t => {
        if (updatedVisibleMap.has(t.id)) {
          return {
            ...t,
            id: updatedVisibleMap.get(t.id)!
          };
        }
        return t; // Other topics (pinned, deleted) remain completely unchanged and untouched
      })
    );

    return { success: true, message: "Active topics reordered successfully." };
  };

  /**
   * RULE 4: Restore Logic
   * - Set isDeleted = false.
   * - If the topic was previously pinned, validate that we don't exceed the limit of 3.
   *   If pinned slots are full, restore it as an unpinned normal topic.
   * - The sorting rule (id ASC) naturally snaps the topic back to its perfect relative position.
   */
  const restoreTopic = (id: number): { success: boolean; message: string } => {
    const topic = topics.find(t => t.id === id);
    if (!topic) {
      return { success: false, message: "Topic not found." };
    }

    let shouldPin = topic.isPinned;
    let finalPinnedPosition = topic.pinnedPosition;
    let finalPinnedId = topic.pinnedId;

    if (shouldPin) {
      const activePinnedCount = topics.filter(t => !t.isDeleted && t.isPinned).length;
      if (activePinnedCount >= 3) {
        // Pinned slots full: demote to normal unpinned topic
        shouldPin = false;
        finalPinnedPosition = null;
        finalPinnedId = null;
      }
    }

    setTopics(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              isDeleted: false,
              isPinned: shouldPin,
              pinnedPosition: finalPinnedPosition,
              pinnedId: finalPinnedId
            }
          : t
      )
    );

    const recoveryNotice = topic.isPinned && !shouldPin
      ? " (restored as unpinned because maximum pinned slots are full)"
      : "";

    return { success: true, message: `Topic "${topic.title}" restored successfully${recoveryNotice}.` };
  };

  /**
   * RULE 5: Pinned Section Independence
   * - Max 3 pinned topics.
   * - Pinned reordering must ONLY update `pinnedPosition` and `pinnedId` (1, 2, or 3) and NEVER modify core IDs.
   * - This ensures that their core ID remains exactly as it was, and unpinning them returns them perfectly to their original spot.
   */
  const reorderPinnedTopics = (draggedId: number, targetPosition: number): { success: boolean; message: string } => {
    if (targetPosition < 1 || targetPosition > 3) {
      return { success: false, message: "Pinned positions must be 1, 2, or 3." };
    }

    const pinnedTopics = topics
      .filter(t => !t.isDeleted && t.isPinned)
      .sort((a, b) => (a.pinnedPosition || 0) - (b.pinnedPosition || 0));

    const draggedIdx = pinnedTopics.findIndex(t => t.id === draggedId);
    if (draggedIdx === -1) {
      return { success: false, message: "Dragged pinned topic not found." };
    }

    // Move the item inside our pinned list
    const rearrangedPinned = [...pinnedTopics];
    const [moved] = rearrangedPinned.splice(draggedIdx, 1);
    
    // Map targetPosition to array index
    const targetIdx = Math.max(0, Math.min(pinnedTopics.length - 1, targetPosition - 1));
    rearrangedPinned.splice(targetIdx, 0, moved);

    // Build the position mapping
    const positionMap = new Map<number, number>();
    rearrangedPinned.forEach((t, index) => {
      positionMap.set(t.id, index + 1);
    });

    setTopics(prev =>
      prev.map(t => {
        if (positionMap.has(t.id)) {
          const newPos = positionMap.get(t.id)!;
          return {
            ...t,
            pinnedPosition: newPos,
            pinnedId: newPos // Use a separate pinnedId aligned with the position to rearrange
          };
        }
        return t;
      })
    );

    return { success: true, message: "Pinned topics reordered successfully. Topic IDs remain completely unchanged." };
  };

  /**
   * Helper to pin a topic (Max 3)
   */
  const pinTopic = (id: number): { success: boolean; message: string } => {
    const topic = topics.find(t => t.id === id);
    if (!topic) {
      return { success: false, message: "Topic not found." };
    }
    if (topic.isDeleted) {
      return { success: false, message: "Cannot pin a deleted topic." };
    }
    if (topic.isPinned) {
      return { success: true, message: "Topic is already pinned." };
    }

    const activePinned = topics.filter(t => !t.isDeleted && t.isPinned);
    if (activePinned.length >= 3) {
      return { success: false, message: "Maximum of 3 pinned topics allowed." };
    }

    const nextPosition = activePinned.length + 1;

    setTopics(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              isPinned: true,
              pinnedPosition: nextPosition,
              pinnedId: nextPosition
            }
          : t
      )
    );

    return { success: true, message: `Pinned "${topic.title}" to position ${nextPosition}.` };
  };

  /**
   * Helper to unpin a topic
   */
  const unpinTopic = (id: number): { success: boolean; message: string } => {
    const topic = topics.find(t => t.id === id);
    if (!topic) {
      return { success: false, message: "Topic not found." };
    }
    if (!topic.isPinned) {
      return { success: true, message: "Topic is not pinned." };
    }

    setTopics(prev => {
      // Unpin the target topic
      const updated = prev.map(t =>
        t.id === id
          ? { ...t, isPinned: false, pinnedPosition: null, pinnedId: null }
          : t
      );

      // Compact remaining active pinned topics positions
      const activePinned = updated
        .filter(t => !t.isDeleted && t.isPinned)
        .sort((a, b) => (a.pinnedPosition || 0) - (b.pinnedPosition || 0));

      const positionMap = new Map<number, number>();
      activePinned.forEach((t, idx) => {
        positionMap.set(t.id, idx + 1);
      });

      return updated.map(t => {
        if (t.isPinned && positionMap.has(t.id)) {
          const nextPos = positionMap.get(t.id)!;
          return {
            ...t,
            pinnedPosition: nextPos,
            pinnedId: nextPos
          };
        }
        return t;
      });
    });

    return { success: true, message: `Unpinned "${topic.title}".` };
  };

  /**
   * RULE 6: Permanent Delete & Re-indexing
   * - Remove the topic entirely from the state array.
   * - Decrement the ID of all remaining topics (active, pinned, soft-deleted)
   *   with ID greater than the deleted topic's ID by 1.
   */
  const permanentDeleteTopic = (id: number): { success: boolean; message: string } => {
    const topicToDelete = topics.find(t => t.id === id);
    if (!topicToDelete) {
      return { success: false, message: "Topic not found." };
    }

    setTopics(prev => {
      // 1. Filter out the deleted topic
      const filtered = prev.filter(t => t.id !== id);

      // 2. Decrement IDs of topics with a greater ID
      return filtered.map(t => {
        if (t.id > id) {
          return {
            ...t,
            id: t.id - 1
          };
        }
        return t;
      });
    });

    return { success: true, message: `Topic "${topicToDelete.title}" permanently deleted. All subsequent IDs updated.` };
  };

  return {
    topics,
    setTopics,
    createTopic,
    activeSortedTopics,
    recycleBinTopics,
    softDeleteTopic,
    reorderMainTopics,
    restoreTopic,
    reorderPinnedTopics,
    pinTopic,
    unpinTopic,
    permanentDeleteTopic
  };
}
