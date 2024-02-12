"use client";

import CardWrapper from "./card-wrapper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";
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
import { newPassword } from "@/actions/new-password";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // React hook for transition after login button is clicked (will disable the inputs)
  const [isPending, startTransition] = useTransition();

  // Messages returned from the login function
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // React hook for dealing with the form in a friendlier way
  // It is a type infered by the LoginSchema you defined for the login form
  // zod will do the validations for the provided data (for now only on the front-end)
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  // Function that calls the server action when login button is clicked
  function onSubmitLoginForm(values: z.infer<typeof NewPasswordSchema>) {
    // Clear previous error or success messages (if any)
    setError("");
    setSuccess("");

    // Call the ASYNC login function that validates the data and return success or error
    startTransition(() => {
      newPassword(values, token)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        })
        // Remove the pop-up afte 3 seconds
        .then((data) => {
          setTimeout(() => {
            setError("");
            setSuccess("");
          }, 3000);
        });
    });
  }

  return (
    <>
      <CardWrapper
        headerLabel="Enter a new password"
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
      >
        {/* Form used from the shadcn ui
        -- it uses the form react hook we defined earlier */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitLoginForm)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {/* We control the fields using the control function provided by the hook,
              rather than manually dealing with them with useState
              -- see shadcn documentation for Form */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormError message={error} />
              <FormSuccess message={success} />

              <Button disabled={isPending} type="submit" className="w-full">
                Reset password
              </Button>
            </div>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
}

export default NewPasswordForm;
