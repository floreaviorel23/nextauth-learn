"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export default function LoginButton({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) {
  //console.log("Mode : ", mode);
  const router = useRouter();

  const buttonClicked = () => {
    //console.log("LOGIN BUTTON CLICKED");
    router.push("/auth/login");
  };

  if (mode === "modal") return <span>TODO: Implement modal</span>;

  return (
    <span onClick={buttonClicked} className="cursor-pointer">
      {children}
    </span>
  );
}
