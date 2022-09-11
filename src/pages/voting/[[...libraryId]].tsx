import { useRouter } from "next/router";

export default function VotePage() {
  const router = useRouter();
  const { libraryId } = router.query;

  return <h1>{libraryId}</h1>;
}
