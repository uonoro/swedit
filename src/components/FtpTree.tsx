import { Tree } from "primereact/tree";

export const FtpTree = ({
  nodes,
  onSelectionChange,
}: {
  nodes: any[];
  onSelectionChange: (node: any) => void;
}) => {
  return (
    <Tree
      value={nodes}
      selectionMode="single"
      onSelectionChange={(e) => onSelectionChange(e.value)}
      className="w-full border-none h-full"
    />
  );
};
