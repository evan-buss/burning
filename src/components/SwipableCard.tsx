import { motion, useAnimation, useMotionValue } from "framer-motion";
import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

type Direction = "left" | "right" | undefined;

interface SwipableCardProps {
  drag: boolean;
  children: ReactNode;
  onVote: (vote: boolean) => void;
  id?: string;
  style?: CSSProperties;
}

export const SwipableCard = ({
  children,
  style,
  onVote,
  id,
  ...props
}: SwipableCardProps) => {
  // motion stuff
  const cardElem = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const controls = useAnimation();

  const [constrained, setConstrained] = useState(false);
  const [direction, setDirection] = useState<Direction>(undefined);
  const [velocity, setVelocity] = useState(0);

  const getVote = (
    childNode: HTMLDivElement,
    parentNode: HTMLDivElement | null
  ) => {
    if (parentNode === null) throw new Error("no parent element");

    const childRect = childNode.getBoundingClientRect();
    const parentRect = parentNode.getBoundingClientRect();
    const result =
      parentRect.left >= childRect.right
        ? false
        : parentRect.right <= childRect.left
        ? true
        : undefined;
    return result;
  };

  // determine direction of swipe based on velocity
  const getDirection = (): "left" | "right" | undefined => {
    return velocity >= 1 ? "right" : velocity <= -1 ? "left" : undefined;
  };

  const getTrajectory = () => {
    setVelocity(x.getVelocity());
    setDirection(getDirection());
  };

  const flyAway = (min: number) => {
    const flyAwayDistance = (direction: Direction) => {
      const parentWidth = (
        cardElem.current?.parentNode as HTMLDivElement
      ).getBoundingClientRect().width;
      const childWidth = cardElem.current?.getBoundingClientRect().width;

      return direction === "left"
        ? -parentWidth / 2 - (childWidth ?? 0) / 2
        : parentWidth / 2 + (childWidth ?? 0) / 2;
    };

    if (direction && Math.abs(velocity) > min) {
      setConstrained(false);
      controls.start({
        x: flyAwayDistance(direction),
      });
    }
  };

  useEffect(() => {
    const unsubscribeX = x.onChange(() => {
      if (cardElem.current) {
        const childNode = cardElem.current;
        const parentNode = cardElem.current.parentNode;
        const result = getVote(childNode, parentNode as HTMLDivElement);
        result !== undefined && onVote(result);
      }
    });

    return () => unsubscribeX();
  });

  return (
    <motion.div
      // className="absolute"
      animate={controls}
      dragConstraints={constrained && { left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      ref={cardElem}
      style={{ x }}
      onDrag={getTrajectory}
      onDragEnd={() => flyAway(500)}
      whileTap={{ scale: 1.1 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
