import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { FtpCredentials } from "./components/FtpCredentials";
import { FtpTree } from "./components/FtpTree";
import { FolderView } from "./views/FolderView";
import { EditorView } from "./views/EditorView";
import { MediaView } from "./views/MediaView";

interface FtpFile {
  name: string;
  size: number;
  is_directory: boolean;
}

export const App = () => {
  const [nodes, setNodes] = useState<FtpFile[]>([]);
  //const [currentFiles, setCurrentFiles] = useState([]);
  const [viewMode, setViewMode] = useState<"FOLDER" | "EDITOR" | "MEDIA">(
    "FOLDER"
  );
  //const [selectedContent, setSelectedContent] = useState<any>(null);

  const handleConnect = async (creds: any) => {
    console.log("Starte Verbindung mit:", creds);

    try {
      // Die Namen links (host, user, pass) müssen exakt
      // mit den Variablennamen in der Rust-Funktion übereinstimmen!
      const response = await invoke("ftp_connect", {
        host: creds.host,
        user: creds.user,
        pass: creds.pass, // Falls dein Formular-Feld 'password' heißt
        port: 21,
      });

      console.log("Antwort von Rust:", response);

      const list_response: FtpFile[] = await invoke("ftp_list_directory", {
        path: "/",
      });

      setNodes(list_response);
    } catch (error) {
      console.error("Fehler beim FTP-Aufruf:", error);
    }
  };

  const handleNodeSelect = (node: any) => {
    // Logik zur Bestimmung des ViewMode basierend auf Dateiendung
    if (node.is_directory) setViewMode("FOLDER");
    else if (node.name.endsWith(".html") || node.name.endsWith(".php"))
      setViewMode("EDITOR");
    else if (node.name.match(/\.(jpg|jpeg|png|gif)$/i)) setViewMode("MEDIA");
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
            <FtpTree nodes={nodes} onSelectionChange={handleNodeSelect} />
          </SplitterPanel>

          <SplitterPanel size={75} className="bg-white p-2">
            {viewMode === "FOLDER" && <FolderView files={[]} />}
            {viewMode === "EDITOR" && <EditorView content={""} />}
            {viewMode === "MEDIA" && <MediaView url={""} />}
          </SplitterPanel>
        </Splitter>
      </div>
    </div>
  );
};
