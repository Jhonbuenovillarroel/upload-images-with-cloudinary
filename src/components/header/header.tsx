import React from "react";
import { ToggleThemeButton } from "./_components/ToggleTheme/toggle-theme";

const Header = () => {
  return (
    <div className="bg-zinc-900 py-4 flex items-center justify-center text-white">
      <ToggleThemeButton />
    </div>
  );
};

export default Header;
