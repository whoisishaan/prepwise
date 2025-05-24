import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated, signOut } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ContactDropdown } from "@/components/ContactDropdown";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
            <h2 className="text-primary-100">PrepWise</h2>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ContactDropdown />
          <Link href="/about">
            <Button variant="ghost">About Us</Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost">My Profile</Button>
          </Link>
          <form action={signOut}>
            <Button type="submit" variant="ghost" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </nav>

      {children}
    </div>
  );
};

export default Layout;