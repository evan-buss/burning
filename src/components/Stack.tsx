import { Children, ReactNode, useState } from "react";
import { SwipableCard as Card } from "./SwipableCard";

// basic default styles for container

interface StackProps {
  children: ReactNode;
  onVote: (item: ReactNode, vote: boolean) => void;
}

export const Stack = ({ onVote, children, ...props }: StackProps) => {
  const [stack, setStack] = useState<ReactNode[]>(Children.toArray(children));

  // return new array with last item removed
  const pop = (array: ReactNode[]) =>
    array.filter((_, index) => index < array.length - 1);

  const handleVote = (item: ReactNode, vote: boolean) => {
    // update the stack
    const newStack = pop(stack);
    setStack(newStack);

    // run function from onVote prop, passing the current item and value of vote
    onVote(item, vote);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {stack.map((item: ReactNode, index) => {
        const isTop = index === stack.length - 1;
        return (
          <Card
            drag={isTop} // Only top card is draggable
            key={index}
            onVote={(result) => handleVote(item, result)}
          >
            {item}
          </Card>
        );
      })}
    </div>
  );
};
