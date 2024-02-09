import BackButton from "./back-button";
import { Header } from "./header";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";

function ErrorCard() {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label="Oops! Something went wrong!" />
      </CardHeader>

      <CardFooter>
        <BackButton label="Back to login" href="/auth/login"></BackButton>
      </CardFooter>
    </Card>
  );
}

export default ErrorCard;
