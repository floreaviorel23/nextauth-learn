"use client";

import CardWrapper from "./card-wrapper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);

  // React hook for transition after login button is clicked (will disable the inputs)
  const [isPending, startTransition] = useTransition();

  // Messages returned from the login function
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // React hook for dealing with the form in a friendlier way
  // It is a type infered by the LoginSchema you defined for the login form
  // zod will do the validations for the provided data (for now only on the front-end)
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Function that calls the server action when login button is clicked
  function onSubmitLoginForm(values: z.infer<typeof LoginSchema>) {
    // Clear previous error or success messages (if any)
    setError("");
    setSuccess("");

    // Call the ASYNC login function that validates the data and return success or error
    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => {
          setError("Something went wrong");
        });
    });
  }

  return (
    <>
      <CardWrapper
        headerLabel="Welcome back"
        backButtonLabel="Don't have an account?"
        backButtonHref="/auth/register"
        showSocial
      >
        {/* Form used from the shadcn ui
        -- it uses the form react hook we defined earlier */}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitLoginForm)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2FA Code</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="123456"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* We control the fields using the control function provided by the hook,
              rather than manually dealing with them with useState
              -- see shadcn documentation for Form */}
              {!showTwoFactor && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="stefandelabarbulesti@yahoo.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <Button
                size="sm"
                variant="link"
                asChild
                className="px-0 font-normal"
              >
                <Link href={"/auth/reset"}>Forgot password?</Link>
              </Button>

              <FormError message={error || urlError} />
              <FormSuccess message={success} />

              <Button disabled={isPending} type="submit" className="w-full">
                {showTwoFactor ? "Confirm" : "Login"}
              </Button>
            </div>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
}

export default LoginForm;
