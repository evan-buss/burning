import { Container, Title } from "@mantine/core";

export default function Dashboard() {
  // const { data: libraries } = trpc.useQuery(["library.get"]);

  return (
    <Container py="xl">
      <Title order={2}>Dashboard</Title>

      {/* {libraries?.map((library) => {
        return <p key={library.key}>{library.address}</p>;
      })} */}
    </Container>
  );
}
