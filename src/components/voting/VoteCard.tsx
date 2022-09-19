import { motion, useMotionValue, useTransform } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

interface CardProps {
  onVote: (vote: boolean) => void;
  draggable?: boolean;
  children: ReactNode;
  buffer?: number;
}

export default function VoteCard({
  onVote,
  children,
  draggable = true,
  buffer = 0,
}: CardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-1000, 0, 1000], [-90, 0, 90], {
    clamp: false,
  });
  const card = useRef<HTMLDivElement>(null);

  const [constrained, setConstrained] = useState(true);

  useEffect(() => {
    const unsubscribeX = x.onChange(() => {
      if (!card.current) return;
      const cardRect = card.current?.getBoundingClientRect();
      const parentRect = (
        card.current?.parentNode as HTMLDivElement
      ).getBoundingClientRect();

      const vote =
        parentRect.left + buffer >= cardRect.right - cardRect.width / 2
          ? false
          : parentRect.right - buffer <= cardRect.left + cardRect.width / 2
          ? true
          : undefined;
      if (vote !== undefined) {
        onVote(vote);
        unsubscribeX();
        setConstrained(false);
      }
    });

    return () => {
      unsubscribeX();
    };
  }, []);

  return (
    <motion.div
      drag={draggable && "x"}
      ref={card}
      className="absolute"
      style={{ x, rotate }}
      exit={{ opacity: 0, scale: 0.8 }}
      dragSnapToOrigin={constrained}
      dragTransition={{ power: 0.2, bounceStiffness: 600, bounceDamping: 25 }}
      //   initial="initial"
      //   whileHover="active"
      //   whileTap="active"
    >
      {children}
    </motion.div>
  );
}
