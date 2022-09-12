import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { Stack } from "../../components/Stack";

export default function VotePage() {
  const router = useRouter();

  const Wrapper = styled(Stack)`
    background: #1f2937;
  `;

  const Item = styled.div`
    background: #f9fafb;
    width: 200px;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 80px;
    text-shadow: 0 10px 10px #d1d5db;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    transform: ${() => {
      const rotation = Math.random() * (5 - -5) + -5;
      return `rotate(${rotation}deg)`;
    }};
  `;

  return (
    <>
      <Stack onVote={(item, vote) => console.log((item as any).props, vote)}>
        <div
          className="width-[200px] height-[250px] flex items-center justify-center rounded-md bg-[#f9fafb] text-[80px] shadow"
          data-value="waffles"
        >
          🧇
        </div>
        <div
          className="width-[200px] height-[250px] flex items-center justify-center rounded-md bg-[#f9fafb] text-[80px] shadow"
          data-value="pancakes"
        >
          🥞
        </div>
        <div
          className="width-[200px] height-[250px] flex items-center justify-center rounded-md bg-[#f9fafb] text-[80px] shadow"
          data-value="donuts"
        >
          🍩
        </div>
      </Stack>
    </>
  );
}
