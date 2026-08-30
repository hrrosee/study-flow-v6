export interface ParsedTopicSpec {
  topicName: string;
  tasks: string[];
}

/**
 * Parses smart topic expressions.
 * Rules:
 * - "Physics" => Topic: "Physics", Tasks: []
 * - "Physics[3]" => Topic: "Physics", Tasks: ["Task 1", "Task 2", "Task 3"]
 * - "Physics[Prefix, 3]" => Topic: "Physics", Tasks: ["Prefix 1", "Prefix 2", "Prefix 3"]
 * - Supports comma or newline separated expressions
 */
export function parseSmartTopicInput(input: string): ParsedTopicSpec[] {
  if (!input || !input.trim()) return [];

  // Split by top-level commas or newlines (taking care not to split inside brackets)
  const tokens: string[] = [];
  let currentToken = '';
  let insideBrackets = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '[') insideBrackets = true;
    if (char === ']') insideBrackets = false;

    if ((char === ',' || char === '\n') && !insideBrackets) {
      if (currentToken.trim()) tokens.push(currentToken.trim());
      currentToken = '';
    } else {
      currentToken += char;
    }
  }
  if (currentToken.trim()) tokens.push(currentToken.trim());

  const results: ParsedTopicSpec[] = [];

  for (const token of tokens) {
    // Regex matches: TopicName [ Prefix , Count ] OR TopicName [ Count ] OR TopicName
    const match = token.match(/^([^\[]+)(?:\[\s*(?:([^,\]]+)\s*,\s*)?(\d+)\s*\])?$/);

    if (match) {
      const topicName = match[1].trim();
      const prefixOrCountStr = match[2] ? match[2].trim() : null;
      const countStr = match[3] ? match[3].trim() : null;

      if (!topicName) continue;

      let tasks: string[] = [];

      if (countStr) {
        // Case with bracket count
        const count = parseInt(countStr, 10);
        const prefix = prefixOrCountStr || 'Task';

        if (!isNaN(count) && count > 0) {
          const capCount = Math.min(count, 50); // Cap at 50 for performance
          for (let i = 1; i <= capCount; i++) {
            tasks.push(`${prefix} ${i}`);
          }
        }
      } else if (prefixOrCountStr && !countStr) {
        // Case like Physics[3] where prefixOrCountStr matched the first group if no comma
        // Check if prefixOrCountStr is actually a number!
        const possibleCount = parseInt(prefixOrCountStr, 10);
        if (!isNaN(possibleCount) && possibleCount > 0) {
          const capCount = Math.min(possibleCount, 50);
          for (let i = 1; i <= capCount; i++) {
            tasks.push(`Task ${i}`);
          }
        }
      }

      results.push({ topicName, tasks });
    } else {
      // Fallback: simple topic name
      const cleanName = token.replace(/[\[\]]/g, '').trim();
      if (cleanName) {
        results.push({ topicName: cleanName, tasks: [] });
      }
    }
  }

  return results;
}
