/**
 * Demo component showcasing the new layout system
 */

import React from "react";
import {
  Grid,
  GridItem,
  Container,
  Stack,
  Flex,
  CardLayout,
  AppPage,
  DashboardLayout,
  FormLayout,
  CardGrid,
  SplitLayout,
  Spacer,
  Divider,
} from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LayoutSystemDemo() {
  return (
    <AppPage
      title="Layout System Demo"
      subtitle="Showcasing the modern layout system components"
      actions={
        <Button variant="outline" size="sm">
          View Code
        </Button>
      }
    >
      <Stack spacing="xl">
        {/* Grid System Demo */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Responsive Grid System</h2>
          <Grid
            cols={1}
            gap="md"
            responsive={{
              sm: 2,
              md: 3,
              lg: 4,
            }}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <GridItem key={i}>
                <CardLayout variant="elevated" padding="md">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-2" />
                    <p className="text-sm font-medium">Grid Item {i + 1}</p>
                  </div>
                </CardLayout>
              </GridItem>
            ))}
          </Grid>
        </section>

        <Divider />

        {/* Stack Layout Demo */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Stack Layouts</h2>
          <Grid cols={1} responsive={{ md: 2 }} gap="lg">
            <div>
              <h3 className="text-lg font-medium mb-3">Vertical Stack</h3>
              <Stack spacing="md">
                <CardLayout variant="outlined" padding="sm">
                  <p className="text-sm">Stack Item 1</p>
                </CardLayout>
                <CardLayout variant="outlined" padding="sm">
                  <p className="text-sm">Stack Item 2</p>
                </CardLayout>
                <CardLayout variant="outlined" padding="sm">
                  <p className="text-sm">Stack Item 3</p>
                </CardLayout>
              </Stack>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Horizontal Stack</h3>
              <Stack direction="horizontal" spacing="md">
                <CardLayout variant="filled" padding="sm">
                  <p className="text-sm">Item A</p>
                </CardLayout>
                <CardLayout variant="filled" padding="sm">
                  <p className="text-sm">Item B</p>
                </CardLayout>
                <CardLayout variant="filled" padding="sm">
                  <p className="text-sm">Item C</p>
                </CardLayout>
              </Stack>
            </div>
          </Grid>
        </section>

        <Divider />

        {/* Flex Layout Demo */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Flex Layouts</h2>
          <Stack spacing="md">
            <div>
              <h3 className="text-sm font-medium mb-2">Space Between</h3>
              <CardLayout variant="outlined" padding="md">
                <Flex justify="between" align="center">
                  <span className="text-sm">Left Content</span>
                  <Button size="sm">Action</Button>
                </Flex>
              </CardLayout>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Center Aligned</h3>
              <CardLayout variant="outlined" padding="md">
                <Flex justify="center" align="center" gap="md">
                  <div className="w-8 h-8 bg-primary rounded-full" />
                  <span className="text-sm">Centered Content</span>
                  <div className="w-8 h-8 bg-secondary rounded-full" />
                </Flex>
              </CardLayout>
            </div>
          </Stack>
        </section>

        <Divider />

        {/* Split Layout Demo */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Split Layouts</h2>
          <SplitLayout
            leftWidth="1/3"
            left={
              <CardLayout variant="elevated" padding="lg">
                <h3 className="font-semibold mb-2">Sidebar Content</h3>
                <p className="text-sm text-muted-foreground">
                  This is the left side of a split layout. It takes up 1/3 of
                  the available width on desktop and stacks on mobile.
                </p>
              </CardLayout>
            }
            right={
              <CardLayout variant="default" padding="lg">
                <h3 className="font-semibold mb-2">Main Content</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This is the main content area. It takes up 2/3 of the
                  available width on desktop.
                </p>
                <Stack spacing="sm">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </Stack>
              </CardLayout>
            }
          />
        </section>

        <Divider />

        {/* Card Grid Demo */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Card Grid</h2>
          <CardGrid minCardWidth={250} gap="md">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-base">Card {i + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This is a responsive card grid that automatically adjusts
                    the number of columns based on the minimum card width.
                  </p>
                  <Spacer size="sm" />
                  <Button size="sm" variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardGrid>
        </section>

        <Divider />

        {/* Form Layout Demo */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Form Layout</h2>
          <Container size="sm">
            <CardLayout variant="elevated" padding="lg">
              <Stack spacing="md">
                <div>
                  <Label htmlFor="demo-name">Name</Label>
                  <Input id="demo-name" placeholder="Enter your name" />
                </div>
                <div>
                  <Label htmlFor="demo-email">Email</Label>
                  <Input
                    id="demo-email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>
                <Flex gap="sm">
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button className="flex-1">Submit</Button>
                </Flex>
              </Stack>
            </CardLayout>
          </Container>
        </section>
      </Stack>
    </AppPage>
  );
}

export default LayoutSystemDemo;
