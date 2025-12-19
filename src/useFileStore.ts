import { create } from "zustand";
import { FtpFile } from "./App";

const updateRecursive = (
  nodes: FtpFile[],
  key: string,
  children?: FtpFile[]
): FtpFile[] => {
  return nodes.map((node) => {
    if (node.name === key) {
      return {
        ...node,
        children: children,
        loading: false,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateRecursive(node.children, key, children),
      };
    }
    return node;
  });
};

interface FileStore {
  treeData: FtpFile[];
  selectedNodeKey: string | null;
  expandedKeys: { [key: string]: boolean };
  setFolderContent: (parentKey: string, children?: FtpFile[]) => void;
  setTreeData: (data: FtpFile[]) => void;
  setNodeLoading: (key: string, isLoading: boolean) => void;
  setSelectedNodeKey: (key: string | null) => void;
  setExpandedKeys: (keys: { [key: string]: boolean }) => void;
  getNodeForKey: (key: string | null) => FtpFile | null;
}
// Aktionen
export const useFileStore = create<FileStore>((set) => ({
  treeData: [],
  selectedNodeKey: null,
  expandedKeys: {}, // Speichert, welche Ordner offen sind

  // 1. Gesamten Baum initialisieren (Root-Ebene)
  setTreeData: (data: FtpFile[]) => set({ treeData: data }),

  // 2. Unterordner nachladen (Lazy Loading)
  setFolderContent: (parentKey: string, children?: FtpFile[]) => {
    const data = useFileStore.getState().treeData;
    if (parentKey === "/" && children) {
      set({ treeData: children });
      return;
    }
    set((state: FileStore) => ({
      treeData: updateRecursive(state.treeData, parentKey, children),
    }));
  },

  // 3. Lade-Status für einen spezifischen Knoten setzen
  setNodeLoading: (key: string, isLoading: boolean) =>
    set((state: FileStore) => ({
      treeData: state.treeData.map((node) => {
        // Hinweis: Für tiefe Ebenen müsste man hier auch rekursiv suchen,
        // oder man setzt das 'loading' Flag direkt beim Klick in der Komponente
        return node.name === key ? { ...node, loading: isLoading } : node;
      }),
    })),

  // 4. Selektion und Expanded-Status (Wichtig für PrimeReact Tree)
  setSelectedNodeKey: (key: string | null) => set({ selectedNodeKey: key }),
  setExpandedKeys: (keys: { [key: string]: boolean }) =>
    set({ expandedKeys: keys }),
  getNodeForKey: (key: string | null) => {
    if (!key) return null;
    let foundNode: FtpFile | null = null;

    const searchRecursive = (nodes: FtpFile[]) => {
      for (const node of nodes) {
        if (node.name === key) {
          foundNode = node;
          return;
        }
        if (node.children) {
          searchRecursive(node.children);
        }
      }
    };

    searchRecursive(useFileStore.getState().treeData);
    return foundNode;
  },
}));
