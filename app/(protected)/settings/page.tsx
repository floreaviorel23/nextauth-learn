"use client";

import { logout } from "@/actions/logout";
import { settings } from "@/actions/settings";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function SettingsPage() {
  const session = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const user = useCurrentUser();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: { name: user?.name || undefined },
  });

  function onSubmit(values: z.infer<typeof SettingsSchema>) {
    form.reset({
      name: "",
    });

    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            session.update();
            setSuccess(data.success);
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  }

  const onClickSignOut = () => {
    logout();
    //signOut(); (need import)
  };
  return (
    <>
      <Card className="w-[600px]">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">Settings ⚙</p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>

              <FormError message={error} />
              <FormSuccess message={success} />
              <Button disabled={isPending} type="submit">
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

export default SettingsPage;
