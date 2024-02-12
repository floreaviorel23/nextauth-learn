"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

function SettingsPage() {
  const user = useCurrentUser();

  const onClickSignOut = () => {
    logout();

    //signOut(); (need import)
  };
  return (
    <>
      <div className="bg-white p-10 rounded-xl">
        <button onClick={onClickSignOut} type="submit">
          Sign out
        </button>
      </div>
    </>
  );
}

export default SettingsPage;
