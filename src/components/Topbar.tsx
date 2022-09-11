import { Container, Group, Header, Title } from "@mantine/core";
import Link from "next/link";
import { Fire } from "phosphor-react";

interface TopbarProps {
  children: React.ReactNode;
}

export default function Topbar({ children }: TopbarProps) {
  return (
    <Header height={84}>
      <Container
        className={`flex h-[84px] items-center justify-between`}
        size="lg"
      >
        <Link href="/">
          <Group className="cursor-pointer rounded-md hover:underline">
            <Fire size={34} weight="bold" />
            <Title order={1}>Burning</Title>
          </Group>
        </Link>

        {children}
      </Container>
    </Header>
  );
}
