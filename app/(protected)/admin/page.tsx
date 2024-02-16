"use client";

import { admin } from "@/actions/admin";
import RoleGate from "@/components/auth/role-gate";
import FormSuccess from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserInfo } from "@/components/user-info";
import { useCurrentRole } from "@/hooks/use-current-role";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

function AdminPage() {
  const role = useCurrentRole();
  const { toast } = useToast();
  const user = useCurrentUser();
  if (!user || role !== UserRole.ADMIN) {
    redirect("/settings");
  }

  const onServerActionClick = () => {
    admin().then((data) => {
      if (data.error) toast({ title: data.error, variant: "destructive" });
      if (data.success) toast({ title: data.success, variant: "default" });
    });
  };

  return (
    user &&
    role === UserRole.ADMIN && (
      <Card className="w-[600px]">
        <Toaster />
        <CardHeader>
          <p className="text-2xl font-semibold text-center">Admin 🔑</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <RoleGate allowedRole={UserRole.ADMIN}>
            <FormSuccess message="Hello admin :p" />
          </RoleGate>

          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">Admin-only Server Action</p>
            <Button onClick={onServerActionClick}>Click to test</Button>
          </div>
        </CardContent>
      </Card>
    )
  );
}

export default AdminPage;
