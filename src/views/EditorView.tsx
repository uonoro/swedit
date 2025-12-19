import { Editor } from "primereact/editor";
export const EditorView = ({ content }: { content: string }) => (
  <Editor value={content} style={{ height: "calc(100vh - 250px)" }} readOnly />
);
