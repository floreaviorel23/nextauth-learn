"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

function SettingsPage() {
  const user = useCurrentUser();

  const onClickSignOut = () => {
    logout();

    //signOut(); (need import)
  };
  return <></>;
}

export default SettingsPage;
