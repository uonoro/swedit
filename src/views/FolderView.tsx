import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export const FolderView = ({ files }: { files: any[] }) => (
  <DataTable
    value={files}
    size="small"
    stripedRows
    scrollable
    scrollHeight="flex"
  >
    <Column
      field="name"
      header="Name"
      body={(row) => (
        <span>
          <i
            className={
              row.is_directory
                ? "pi pi-folder mr-2 text-blue-500"
                : "pi pi-file mr-2"
            }
          ></i>
          {row.name}
        </span>
      )}
      sortable
    />
    <Column
      field="size"
      header="Größe"
      body={(row) =>
        row.is_directory ? "--" : `${(row.size / 1024).toFixed(1)} KB`
      }
      sortable
    />
    <Column field="modified" header="Geändert" sortable />
  </DataTable>
);
