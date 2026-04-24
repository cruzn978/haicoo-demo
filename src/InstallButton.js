import React, { useEffect, useState } from "react";

const InstallButton = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);

  useEffect(() => {
    const eventHandler = (event) => {
      event.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(event);
    };
    window.addEventListener("beforeinstallprompt", eventHandler);

    return () => window.removeEventListener("transitionend", eventHandler);
  }, []);

  const handleClick = (event) => {
    event.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };
  if (!supportsPWA) {
    return null;
  }
  return (
    <button
      id="install-btn"
      className="btn btn-outline-info btn-pill"
      onClick={handleClick}
    >
      Install Haicoo~
    </button>
  );
};

export default InstallButton;
