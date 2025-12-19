import { Tree, TreeEventNodeEvent } from "primereact/tree";
import { FtpFile } from "../App";
import { TreeNode } from "primereact/treenode";
import { useFileStore } from "../useFileStore";
import { invoke } from "@tauri-apps/api/core";

export const FtpTree = ({ nodes }: { nodes: any[] }) => {
  const {
    treeData,
    setFolderContent,
    expandedKeys,
    setExpandedKeys,
    setSelectedNodeKey,
    setNodeLoading,
  } = useFileStore();

  const onExpand = async (event: TreeEventNodeEvent) => {
    const node = event.node;

    // Nur laden, wenn noch keine Kinder vorhanden sind
    if (!node.children || node.children.length === 0) {
      try {
        setNodeLoading(node.key as string, true);
        console.log("SUMSUM LOADING ", node.data.name);

        const files: FtpFile[] = await invoke("ftp_list", {
          path: "/" + node.data.name,
        });

        setFolderContent(node.key as string, files);
      } catch (err) {
        console.error("Fehler beim Laden der Unterordner:", err);
      }
    }
  };
  const asTreeNode = (nodes: FtpFile[]): TreeNode[] => {
    return nodes.map((node) => ({
      key: node.name,
      label: node.name,
      data: node,
      leaf: !node.is_directory,
      loading: node.isLoading || false,
      children: node.is_directory ? asTreeNode(node.children || []) : undefined,
    }));
  };
  return (
    <Tree
      value={asTreeNode(treeData)}
      selectionMode="single"
      onSelectionChange={(e) => {
        const selectedKey = e.value;
        setSelectedNodeKey(selectedKey as string | null);
      }}
      expandedKeys={expandedKeys}
      onExpand={onExpand}
      onToggle={(e) => setExpandedKeys(e.value)}
      className="w-full border-none h-full"
    />
  );
};
