export interface StudioLink {
  id: string;
  url: string;
  title: string;
}

export interface StudioNote {
  id: string;
  text: string;
}

export interface StudioTaskSpec {
  id: string;
  title: string;
  description: string;
  links: StudioLink[];
  notes: StudioNote[];
  priority: 'none' | 'low' | 'medium' | 'high';
}

export interface StudioTopicSpec {
  id: string;
  title: string;
  section?: string;
  color: string; // color ID like 'blue', 'purple', 'green', 'orange', 'pink', 'cyan', 'amber'
  icon: string;  // icon ID like 'bookopen', 'atom', 'calculator', 'code2', 'dna', etc.
  links: StudioLink[];
  notes: StudioNote[];
  tasks: StudioTaskSpec[];
}

export function ensureExternalUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export type LinkType = 'drive' | 'facebook' | 'youtube' | 'chrome' | 'pdf';

export function detectLinkType(url: string, title?: string): LinkType {
  const text = `${url} ${title || ''}`.toLowerCase();
  if (/drive\.google\.com|docs\.google\.com|sheets\.google\.com|slides\.google\.com|drive/i.test(text)) {
    return 'drive';
  }
  if (/facebook\.com|fb\.com|fb\.watch|fb\.gg|facebook/i.test(text)) {
    return 'facebook';
  }
  if (/youtube\.com|youtu\.be|youtube/i.test(text)) {
    return 'youtube';
  }
  if (/\.pdf($|\?)/i.test(text) || text.includes('/pdf/')) {
    return 'pdf';
  }
  return 'chrome';
}

export function getAutoLinkTitle(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  const lower = trimmed.toLowerCase();

  // YouTube
  if (/youtu\.be|youtube\.com/i.test(lower)) {
    if (lower.includes('playlist')) return 'YouTube Playlist';
    if (lower.includes('/shorts/')) return 'YouTube Shorts';
    if (lower.includes('/channel/') || lower.includes('/c/') || lower.includes('/@')) return 'YouTube Channel';
    return 'YouTube Video';
  }

  // Google Drive & Docs
  if (/docs\.google\.com\/document/i.test(lower)) return 'Google Docs Document';
  if (/docs\.google\.com\/spreadsheets/i.test(lower)) return 'Google Sheets Spreadsheet';
  if (/docs\.google\.com\/presentation/i.test(lower)) return 'Google Slides Presentation';
  if (/docs\.google\.com\/forms|forms\.gle/i.test(lower)) return 'Google Form';
  if (/drive\.google\.com/i.test(lower)) return 'Google Drive File';

  // Social
  if (/facebook\.com|fb\.watch|fb\.com/i.test(lower)) {
    if (lower.includes('/groups/')) return 'Facebook Group';
    if (lower.includes('/videos/') || lower.includes('fb.watch')) return 'Facebook Video';
    return 'Facebook Resource';
  }

  // Files
  if (/\.pdf($|\?)/i.test(lower) || lower.includes('/pdf/')) return 'PDF Document';
  if (/\.docx?($|\?)/i.test(lower)) return 'Word Document';
  if (/\.xlsx?($|\?)/i.test(lower)) return 'Excel Spreadsheet';
  if (/\.pptx?($|\?)/i.test(lower)) return 'PowerPoint Presentation';

  // Coding & Tech
  if (/github\.com/i.test(lower)) return 'GitHub Repository';
  if (/wikipedia\.org/i.test(lower)) return 'Wikipedia Article';
  if (/medium\.com/i.test(lower)) return 'Medium Article';
  if (/notion\.so|notion\.site/i.test(lower)) return 'Notion Page';
  if (/10minuteschool\.com/i.test(lower)) return '10 Minute School';
  if (/khanacademy\.org/i.test(lower)) return 'Khan Academy';
  if (/geeksforgeeks\.org/i.test(lower)) return 'GeeksforGeeks';
  if (/w3schools\.com/i.test(lower)) return 'W3Schools';

  try {
    const fullUrl = ensureExternalUrl(trimmed);
    const parsed = new URL(fullUrl);
    const host = parsed.hostname.replace(/^www\./i, '');
    if (host && host.includes('.')) {
      const parts = host.split('.');
      const domainName = parts[0];
      if (domainName && domainName.length > 1) {
        const capitalized = domainName.charAt(0).toUpperCase() + domainName.slice(1);
        return `${capitalized} Resource`;
      }
    }
  } catch {
    // Fallback on invalid URL parse
  }

  return 'Web Resource';
}

export const generateStudioId = () => `studio_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Helper to safely parse link with optional title: "https://url (Title)" or "https://url | Title"
function parseUrlAndTitle(rawString: string): { url: string; title: string } {
  let text = rawString.trim();
  let title = '';

  // Match pipe format: "https://... | My Title"
  const pipeMatch = text.match(/^(.+?)\s*\|\s*(.+)$/);
  if (pipeMatch) {
    text = pipeMatch[1].trim();
    title = pipeMatch[2].trim();
  } else {
    // Match parenthesis ONLY if preceded by whitespace (so wikipedia url https://.../Vector_(math) is safe)
    const parenMatch = text.match(/^(.+?)\s+\(([^)]+)\)$/);
    if (parenMatch) {
      text = parenMatch[1].trim();
      title = parenMatch[2].trim();
    }
  }

  if (!title && text) {
    title = getAutoLinkTitle(text);
  }

  return { url: text, title };
}

export function parseStudioMarkdown(markdown: string): StudioTopicSpec[] {
  const topics: StudioTopicSpec[] = [];
  let currentTopic: StudioTopicSpec | null = null;
  let currentTask: StudioTaskSpec | null = null;

  const lines = markdown.split('\n');

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect Topic
    if (trimmed.startsWith('# Topic:') || trimmed.startsWith('#Topic:') || trimmed.startsWith('# ')) {
      const title = trimmed.replace(/^#\s*(Topic:)?/i, '').trim();
      currentTopic = {
        id: generateStudioId(),
        title,
        color: 'blue', // default blue
        icon: 'bookopen', // default Lucide icon ID
        links: [],
        notes: [],
        tasks: []
      };
      topics.push(currentTopic);
      currentTask = null; // reset task scope
      continue;
    }

    if (!currentTopic) {
      currentTopic = {
        id: generateStudioId(),
        title: 'Untitled Topic',
        color: 'blue',
        icon: 'bookopen',
        links: [],
        notes: [],
        tasks: []
      };
      topics.push(currentTopic);
    }

    // Detect Topic-level properties
    if (trimmed.startsWith('@link:')) {
      const rawLink = trimmed.replace(/^@link:/i, '').trim();
      const { url, title } = parseUrlAndTitle(rawLink);
      currentTopic.links.push({
        id: generateStudioId(),
        url,
        title: title || 'Resource Link'
      });
      continue;
    }
    
    if (trimmed.startsWith('@note:')) {
      const text = trimmed.replace(/^@note:/i, '').trim();
      currentTopic.notes.push({ id: generateStudioId(), text });
      continue;
    }

    if (trimmed.startsWith('@section:')) {
      currentTopic.section = trimmed.replace(/^@section:/i, '').trim();
      continue;
    }

    if (trimmed.startsWith('@color:')) {
      currentTopic.color = trimmed.replace(/^@color:/i, '').trim().toLowerCase();
      continue;
    }

    if (trimmed.startsWith('@icon:')) {
      currentTopic.icon = trimmed.replace(/^@icon:/i, '').trim().toLowerCase();
      continue;
    }

    // Detect Task
    if (trimmed.startsWith('- Task:') || trimmed.startsWith('-Task:') || trimmed.startsWith('- ')) {
      const taskTitle = trimmed.replace(/^-\s*(Task:)?/i, '').trim();
      currentTask = {
        id: generateStudioId(),
        title: taskTitle,
        description: '',
        links: [],
        notes: [],
        priority: 'none'
      };
      currentTopic.tasks.push(currentTask);
      continue;
    }

    if (!currentTask) {
      continue;
    }

    // Task-level properties
    if (trimmed.startsWith('desc:') || trimmed.startsWith('* desc:') || trimmed.startsWith('* Description:')) {
      currentTask.description = trimmed.replace(/^(\*\s*)?(desc:|Description:)/i, '').trim();
    } else if (trimmed.startsWith('link:') || trimmed.startsWith('* link:') || trimmed.startsWith('>>')) {
      let rawUrl = trimmed.replace(/^(\*\s*)?link:/i, '').trim();
      rawUrl = rawUrl.replace(/^>>\s*/, '').trim();
      const { url, title } = parseUrlAndTitle(rawUrl);
      currentTask.links.push({
        id: generateStudioId(),
        url,
        title: title || getAutoLinkTitle(url)
      });
    } else if (trimmed.startsWith('note:') || trimmed.startsWith('* note:') || trimmed.startsWith('//')) {
      let noteText = trimmed.replace(/^(\*\s*)?note:/i, '').trim();
      noteText = noteText.replace(/^\/\/\s*/, '').trim();
      currentTask.notes.push({
        id: generateStudioId(),
        text: noteText
      });
    } else if (trimmed.startsWith('priority:') || trimmed.startsWith('* priority:')) {
      const prioStr = trimmed.replace(/^(\*\s*)?priority:/i, '').trim().toLowerCase();
      if (prioStr.includes('high')) currentTask.priority = 'high';
      else if (prioStr.includes('med')) currentTask.priority = 'medium';
      else if (prioStr.includes('low')) currentTask.priority = 'low';
    } else if (trimmed.startsWith('!high')) {
      currentTask.priority = 'high';
    } else if (trimmed.startsWith('!med')) {
      currentTask.priority = 'medium';
    } else if (trimmed.startsWith('!low')) {
      currentTask.priority = 'low';
    }
  }

  return topics;
}

export function generateStudioMarkdown(topics: StudioTopicSpec[]): string {
  const lines: string[] = [];

  for (const topic of topics) {
    lines.push(`# Topic: ${topic.title || 'Untitled Topic'}`);
    if (topic.section) {
      lines.push(`@section: ${topic.section}`);
    }
    if (topic.color) {
      lines.push(`@color: ${topic.color}`);
    }
    if (topic.icon) {
      lines.push(`@icon: ${topic.icon}`);
    }
    for (const link of topic.links) {
      if (link.url.trim()) {
        lines.push(`@link: ${link.url} ${link.title ? `(${link.title})` : ''}`);
      }
    }
    for (const note of topic.notes) {
      if (note.text.trim()) {
        lines.push(`@note: ${note.text}`);
      }
    }
    lines.push('');

    for (const task of topic.tasks) {
      lines.push(`- Task: ${task.title || 'Task'}`);
      if (task.description?.trim()) {
        lines.push(`  * desc: ${task.description.trim()}`);
      }
      for (const link of task.links || []) {
        if (link.url?.trim()) {
          lines.push(`  * link: ${link.url.trim()} ${link.title ? `(${link.title})` : ''}`);
        }
      }
      for (const note of task.notes || []) {
        if (note.text?.trim()) {
          lines.push(`  * note: ${note.text.trim()}`);
        }
      }
      if (task.priority && task.priority !== 'none') {
        lines.push(`  * priority: ${task.priority}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n').trim();
}
