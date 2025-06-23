import { AppShell, Burger, Group, NavLink, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHome2, IconCompass } from "@tabler/icons-react";

interface NavigationProps {
  page: string;
  setPage: (page: string) => void;
  children: React.ReactNode;
}

export function Navigation({ page, setPage, children }: NavigationProps) {
  const [opened, { toggle }] = useDisclosure();

  const mainLinks = [
    { icon: <IconHome2 size="1rem" />, label: "Home", page: "home" },
    { icon: <IconCompass size="1rem" />, label: "Explore", page: "explore" },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text>Farcaster Feed</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {mainLinks.map((link) => (
          <NavLink
            key={link.label}
            active={page === link.page}
            label={link.label}
            leftSection={link.icon}
            onClick={() => {
              setPage(link.page);
              toggle();
            }}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
} 
