import { auth, signOut } from "@/auth";

async function SettingsPage() {
  const session = await auth();
  return (
    <>
      <div>Settings Page</div>
      <div>Session : {JSON.stringify(session)}</div>

      <form
        action={async () => {
          "use server";

          await signOut();
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </>
  );
}

export default SettingsPage;
