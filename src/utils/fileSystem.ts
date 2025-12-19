// src/utils/fileSystem.ts
import { ViewType } from "../types/ViewType";

/**
 * Bestimmt den ViewMode basierend auf dem Dateinamen und dem Typ
 */
export const getFileViewMode = (
  fileName: string,
  isDirectory: boolean
): ViewType => {
  if (isDirectory) return ViewType.Folder;

  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  const editorExts = ["html", "php", "css", "js", "txt", "json", "sql", "rs"];
  const mediaExts = ["jpg", "jpeg", "png", "gif", "svg", "webp", "avif"];

  if (editorExts.includes(ext)) return ViewType.Editor;
  if (mediaExts.includes(ext)) return ViewType.Media;

  return ViewType.Unknown;
};

/**
 * Formatiert Bytes in eine lesbare Größe (KB, MB, GB)
 */
export const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
