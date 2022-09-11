import { Button } from "@mantine/core";
import { NextLink } from "@mantine/next";
import React from "react";
import Topbar from "../Topbar";

export default function AnonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Topbar>
        <Button component={NextLink} href="/signin" variant="outline">
          Sign In
        </Button>
      </Topbar>

      {children}
    </>
  );
}
