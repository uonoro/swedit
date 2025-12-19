import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export const FtpCredentials = ({
  onConnect,
}: {
  onConnect: (creds: any) => void;
}) => {
  const [creds, setCreds] = useState({
    host: "",
    user: "",
    pass: "",
    port: 21,
  });

  const connect = () => {
    localStorage.setItem("ftpCreds", JSON.stringify(creds));
    onConnect(creds);
  };
  useEffect(() => {
    const savedCreds = localStorage.getItem("ftpCreds");
    if (savedCreds) {
      setCreds(JSON.parse(savedCreds));
    }
  }, []);

  return (
    <div className="surface-card p-3 shadow-1 flex align-items-center gap-3 border-round">
      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="pi pi-globe"></i>
        </span>
        <InputText
          value={creds.host}
          onChange={(e) => setCreds({ ...creds, host: e.target.value })}
          placeholder="Host"
        />
      </div>
      <InputText
        value={creds.user}
        onChange={(e) => setCreds({ ...creds, user: e.target.value })}
        placeholder="User"
      />
      <InputText
        value={creds.pass}
        type="password"
        onChange={(e) => setCreds({ ...creds, pass: e.target.value })}
        placeholder="Passwort"
      />
      <Button
        label="Verbinden"
        icon="pi pi-sign-in"
        onClick={() => connect()}
      />
    </div>
  );
};
