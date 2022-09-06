import { createStyles } from "@mantine/core";

export const useCardStyles = createStyles((theme) => ({
  card: {
    overflow: "visible",
    margin: theme.spacing.xl * 2,
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      marginBlock: theme.spacing.xl,
      marginInline: 0,
    },
  },
}));
