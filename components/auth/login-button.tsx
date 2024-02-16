"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import LoginForm from "./login-form";

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

  if (mode === "modal")
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <LoginForm />
        </DialogContent>
      </Dialog>
    );

  return (
    <span onClick={buttonClicked} className="cursor-pointer">
      {children}
    </span>
  );
}
