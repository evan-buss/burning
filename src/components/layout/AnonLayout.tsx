import { Button, Container } from "@mantine/core";
import { NextLink } from "@mantine/next";
import React from "react";
import Topbar from "../Topbar";

export default function AnonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="wrapper" className="bg-white dark:bg-dark-8">
      <Topbar>
        <Button component={NextLink} href="/signin" variant="outline">
          Sign In
        </Button>
      </Topbar>

      <Container size="sm" id="page-content" py="xl">
        {children}
      </Container>
    </div>
  );
}
