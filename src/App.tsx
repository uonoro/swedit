import { invoke } from "@tauri-apps/api/core";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { FtpCredentials } from "./components/FtpCredentials";
import { FtpTree } from "./components/FtpTree";
import { FolderView } from "./views/FolderView";
import { EditorView } from "./views/EditorView";
import { MediaView } from "./views/MediaView";
import { useFileStore } from "./useFileStore";

export interface FtpFile {
  name: string;
  size: number;
  is_directory: boolean;
  isLoading?: boolean;
  children?: FtpFile[];
}

export const App = () => {
  const { treeData, selectedNodeKey, setFolderContent, getNodeForKey } =
    useFileStore();

  console.log("SUMSUM TREEDATA ", treeData);

  const handleConnect = async (creds: any) => {
    console.log("Starte Verbindung mit:", creds);

    try {
      const response = await invoke("ftp_connect", {
        host: creds.host,
        user: creds.user,
        pass: creds.pass,
        port: 21,
      });

      const list_response: FtpFile[] = await invoke("ftp_list", {
        path: "/",
      });
      setFolderContent("/", list_response);
    } catch (error) {
      console.error("Fehler beim FTP-Aufruf:", error);
    }
  };

  return (
    <div className="flex flex-column h-screen p-2 gap-2 bg-gray-200">
      <FtpCredentials onConnect={handleConnect} />

      <div className="flex-grow-1 overflow-hidden border-round shadow-2">
        <Splitter style={{ height: "100%" }}>
          <SplitterPanel
            size={25}
            minSize={15}
            className="bg-white overflow-auto"
          >
            <FtpTree nodes={treeData} />
          </SplitterPanel>

          <SplitterPanel size={75} className="bg-white p-2">
            <ContentPane node={getNodeForKey(selectedNodeKey)} />
          </SplitterPanel>
        </Splitter>
      </div>
    </div>
  );
};

interface ContentPaneProps {
  node: FtpFile | null;
}
const ContentPane = (props: ContentPaneProps) => {
  const { node } = props;
  if (!node) return <div>Select a file or folder to view its content</div>;
  if (node.is_directory) return <FolderView parent={node} />;
  if (node.name.endsWith(".html") || node.name.endsWith(".php"))
    return <EditorView content={""} />;
  if (node.name.match(/\.(jpg|jpeg|png|gif)$/i) !== null)
    return <MediaView url={""} />;

  return <div>Unsupported file type</div>;
};
