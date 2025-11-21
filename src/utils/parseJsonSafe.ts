export const parseJsonSafe = <T = unknown>(raw: string): T | null => {
  try {
    const clean = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(clean) as T;
  } catch {
    return null;
  }
};
