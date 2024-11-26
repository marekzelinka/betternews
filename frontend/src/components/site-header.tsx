import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { MenuIcon } from "lucide-react";

import { userQueryOptions } from "@/lib/api";

import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export function SiteHeader() {
  const { data: user } = useQuery(userQueryOptions());

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/90">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold">
            BetterNews
          </Link>
          <nav className="flex items-center gap-4 max-md:hidden">
            <Link className="hover:underline">New</Link>
            <Link className="hover:underline">Top</Link>
            <Link to="/submit" className="hover:underline">
              Submit
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 max-md:hidden">
          {user ? (
            <>
              <p>
                <span className="font-medium">{user}</span>
              </p>
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70"
              >
                <a href="api/auth/logout">Log out</a>
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70"
            >
              <Link to="/login">Log in</Link>
            </Button>
          )}
        </div>
        <MobileNav />
      </div>
    </header>
  );
}

function MobileNav() {
  const { data: user } = useQuery(userQueryOptions());

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="md:hidden [&_svg]:size-6"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>BetterNews</SheetTitle>
          <SheetDescription className="sr-only">Navigation</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-4">
          <Link onClick={() => setIsOpen(false)} className="hover:underline">
            New
          </Link>
          <Link onClick={() => setIsOpen(false)} className="hover:underline">
            Top
          </Link>
          <Link onClick={() => setIsOpen(false)} className="hover:underline">
            Submit
          </Link>
        </nav>
        <div className="mt-4 flex flex-col gap-3">
          {user ? (
            <>
              <p>
                <span className="text-muted-foreground">Signed in as</span>{" "}
                <span className="font-medium">{user}</span>
              </p>
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="w-full bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70"
              >
                <a href="api/auth/logout">Log out</a>
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="w-full bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70"
            >
              <Link to="/login" onClick={() => setIsOpen(false)}>
                Log in
              </Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
