import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import LoginButton from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-gradient-to-r from-sky-400 to-blue-700">
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className
          )}
        >
          🔐Auth
        </h1>
        <p className="text-white text-lg text-center">
          A simple authentication service
        </p>
        <div>
          {/* We send the data to provide LoginButton as children
          -- everything inside LoginButton is considered "children"
          -- similarly, we could move the Button inside LoginButton */}
          <LoginButton>
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
