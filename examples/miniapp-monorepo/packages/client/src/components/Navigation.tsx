import { useState } from "react";
import { IconHome2, IconCompass, IconMenu, IconX } from "@tabler/icons-react";
import { Button, cn } from "@embed-ai/react";

interface NavigationProps {
  page: string;
  setPage: (page: string) => void;
  children: React.ReactNode;
}

export function Navigation({ page, setPage, children }: NavigationProps) {
  const [opened, setOpened] = useState(false);

  const mainLinks = [
    { icon: <IconHome2 size="1rem" />, label: "Home", page: "home" },
    { icon: <IconCompass size="1rem" />, label: "View Someone's Feed", page: "explore" },
  ];

  const close = () => setOpened(false);
  const toggle = () => setOpened(!opened);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-15 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={toggle}
          >
            {opened ? <IconX size={20} /> : <IconMenu size={20} />}
          </Button>
          <h1 className="font-semibold">Embed Farcaster Feed</h1>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "w-72 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ease-in-out",
          "sm:translate-x-0 sm:static sm:h-[calc(100vh-3.5rem)]",
          opened ? "translate-x-0 absolute inset-y-0 z-50 h-full" : "-translate-x-full absolute"
        )}>
          <nav className="space-y-2 p-4">
            {mainLinks.map((link) => (
              <Button
                key={link.label}
                variant={page === link.page ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => {
                  setPage(link.page);
                  close();
                }}
              >
                {link.icon}
                {link.label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {opened && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 sm:hidden" 
            onClick={close}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 
