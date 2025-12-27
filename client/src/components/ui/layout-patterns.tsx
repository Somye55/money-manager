/**
 * Common layout patterns and page templates for consistent design
 */

import React from "react";
import { cn } from "@/lib/utils";
import {
  PageLayout,
  Container,
  Grid,
  GridItem,
  Stack,
  Flex,
  CardLayout,
  SafeAreaLayout,
  MobileLayout,
} from "./layout-system";
import { useMobileLayout, useBreakpoint } from "@/hooks/use-layout";

// ============================================================================
// PAGE TEMPLATES
// ============================================================================

interface AppPageProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  navigation?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AppPage({
  title,
  subtitle,
  actions,
  navigation,
  children,
  className,
}: AppPageProps) {
  const { isMobile } = useMobileLayout();

  const header =
    title || subtitle || actions ? (
      <Container padding="md" className="py-4">
        <Flex justify="between" align="center" gap="md">
          <div className="min-w-0 flex-1">
            {title && (
              <h1 className="text-2xl font-bold text-foreground truncate">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </Flex>
      </Container>
    ) : undefined;

  if (isMobile) {
    return (
      <MobileLayout
        header={header}
        navigation={navigation}
        className={className}
      >
        <Container padding="md" className="py-6">
          {children}
        </Container>
      </MobileLayout>
    );
  }

  return (
    <PageLayout className={className}>
      {header}
      <Container padding="md" className="py-6">
        {children}
      </Container>
      {navigation}
    </PageLayout>
  );
}

// ============================================================================
// DASHBOARD LAYOUTS
// ============================================================================

interface DashboardLayoutProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  stats?: React.ReactNode;
  charts?: React.ReactNode;
  content?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function DashboardLayout({
  title,
  subtitle,
  actions,
  stats,
  charts,
  content,
  sidebar,
  className,
}: DashboardLayoutProps) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  return (
    <AppPage
      title={title}
      subtitle={subtitle}
      actions={actions}
      className={className}
    >
      <Stack spacing="lg">
        {/* Stats Section */}
        {stats && (
          <section>
            <Grid
              cols={isMobile ? 2 : 4}
              gap="md"
              responsive={{
                sm: 2,
                md: 3,
                lg: 4,
              }}
            >
              {stats}
            </Grid>
          </section>
        )}

        {/* Main Content Area */}
        <Grid
          cols={1}
          gap="lg"
          responsive={{
            lg: sidebar ? 3 : 1,
          }}
        >
          {/* Primary Content */}
          <GridItem
            span={1}
            responsive={{
              lg: sidebar ? 2 : 1,
            }}
          >
            <Stack spacing="lg">
              {charts}
              {content}
            </Stack>
          </GridItem>

          {/* Sidebar */}
          {sidebar && !isMobile && (
            <GridItem span={1}>
              <div className="sticky top-6">{sidebar}</div>
            </GridItem>
          )}
        </Grid>

        {/* Mobile Sidebar */}
        {sidebar && isMobile && <section>{sidebar}</section>}
      </Stack>
    </AppPage>
  );
}

// ============================================================================
// FORM LAYOUTS
// ============================================================================

interface FormLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
  className?: string;
}

export function FormLayout({
  title,
  subtitle,
  children,
  actions,
  maxWidth = "md",
  className,
}: FormLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <AppPage title={title} subtitle={subtitle} className={className}>
      <div className={cn("mx-auto w-full", maxWidthClasses[maxWidth])}>
        <Stack spacing="lg">
          {children}
          {actions && (
            <div className="pt-4 border-t border-border">{actions}</div>
          )}
        </Stack>
      </div>
    </AppPage>
  );
}

// ============================================================================
// LIST LAYOUTS
// ============================================================================

interface ListLayoutProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}

export function ListLayout({
  title,
  subtitle,
  actions,
  filters,
  children,
  emptyState,
  className,
}: ListLayoutProps) {
  return (
    <AppPage
      title={title}
      subtitle={subtitle}
      actions={actions}
      className={className}
    >
      <Stack spacing="lg">
        {filters && (
          <CardLayout variant="outlined" padding="md">
            {filters}
          </CardLayout>
        )}

        <div className="min-h-0 flex-1">
          {React.Children.count(children) > 0 ? children : emptyState}
        </div>
      </Stack>
    </AppPage>
  );
}

// ============================================================================
// DETAIL LAYOUTS
// ============================================================================

interface DetailLayoutProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  tabs?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DetailLayout({
  title,
  subtitle,
  actions,
  breadcrumbs,
  tabs,
  sidebar,
  children,
  className,
}: DetailLayoutProps) {
  const { isMobile } = useMobileLayout();

  return (
    <AppPage className={className}>
      <Stack spacing="lg">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <div className="text-sm text-muted-foreground">{breadcrumbs}</div>
        )}

        {/* Header */}
        <Flex justify="between" align="start" gap="md">
          <div className="min-w-0 flex-1">
            {title && (
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            )}
            {subtitle && (
              <p className="text-muted-foreground mt-2">{subtitle}</p>
            )}
          </div>
          {actions && !isMobile && (
            <div className="flex-shrink-0">{actions}</div>
          )}
        </Flex>

        {/* Mobile Actions */}
        {actions && isMobile && <div className="w-full">{actions}</div>}

        {/* Tabs */}
        {tabs && <div className="border-b border-border">{tabs}</div>}

        {/* Content */}
        <Grid
          cols={1}
          gap="lg"
          responsive={{
            lg: sidebar ? 3 : 1,
          }}
        >
          <GridItem
            span={1}
            responsive={{
              lg: sidebar ? 2 : 1,
            }}
          >
            {children}
          </GridItem>

          {sidebar && !isMobile && (
            <GridItem span={1}>
              <div className="sticky top-6">{sidebar}</div>
            </GridItem>
          )}
        </Grid>

        {/* Mobile Sidebar */}
        {sidebar && isMobile && <section>{sidebar}</section>}
      </Stack>
    </AppPage>
  );
}

// ============================================================================
// CARD GRID LAYOUTS
// ============================================================================

interface CardGridProps {
  children: React.ReactNode;
  minCardWidth?: number;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function CardGrid({
  children,
  minCardWidth = 280,
  gap = "md",
  className,
}: CardGridProps) {
  const breakpoint = useBreakpoint();

  // Calculate responsive columns based on breakpoint and min card width
  const getColumns = () => {
    switch (breakpoint) {
      case "xs":
        return 1;
      case "sm":
        return minCardWidth <= 200 ? 2 : 1;
      case "md":
        return minCardWidth <= 180 ? 3 : 2;
      case "lg":
        return minCardWidth <= 200 ? 4 : 3;
      case "xl":
      case "2xl":
        return minCardWidth <= 180 ? 5 : 4;
      default:
        return 1;
    }
  };

  return (
    <Grid cols={getColumns()} gap={gap} className={className}>
      {children}
    </Grid>
  );
}

// ============================================================================
// SPLIT LAYOUTS
// ============================================================================

interface SplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: "1/3" | "1/2" | "2/3";
  gap?: "sm" | "md" | "lg";
  stackOnMobile?: boolean;
  className?: string;
}

export function SplitLayout({
  left,
  right,
  leftWidth = "1/2",
  gap = "lg",
  stackOnMobile = true,
  className,
}: SplitLayoutProps) {
  const { isMobile } = useMobileLayout();

  const leftSpan = {
    "1/3": 4,
    "1/2": 6,
    "2/3": 8,
  }[leftWidth] as 4 | 6 | 8;

  const rightSpan = (12 - leftSpan) as 4 | 6 | 8;

  if (isMobile && stackOnMobile) {
    return (
      <Stack spacing={gap} className={className}>
        {left}
        {right}
      </Stack>
    );
  }

  return (
    <Grid cols={12} gap={gap} className={className}>
      <GridItem span={leftSpan}>{left}</GridItem>
      <GridItem span={rightSpan}>{right}</GridItem>
    </Grid>
  );
}

// ============================================================================
// CENTERED LAYOUTS
// ============================================================================

interface CenteredLayoutProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  verticalCenter?: boolean;
  className?: string;
}

export function CenteredLayout({
  children,
  maxWidth = "md",
  verticalCenter = false,
  className,
}: CenteredLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <SafeAreaLayout>
      <div
        className={cn(
          "mx-auto w-full px-4",
          maxWidthClasses[maxWidth],
          verticalCenter && "min-h-screen flex items-center justify-center",
          className
        )}
      >
        {children}
      </div>
    </SafeAreaLayout>
  );
}

// ============================================================================
// MASONRY LAYOUT
// ============================================================================

interface MasonryLayoutProps {
  children: React.ReactNode;
  columns?: number;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function MasonryLayout({
  children,
  columns = 2,
  gap = "md",
  className,
}: MasonryLayoutProps) {
  const breakpoint = useBreakpoint();

  // Adjust columns based on breakpoint
  const responsiveColumns = React.useMemo(() => {
    switch (breakpoint) {
      case "xs":
        return 1;
      case "sm":
        return Math.min(2, columns);
      case "md":
        return Math.min(3, columns);
      default:
        return columns;
    }
  }, [breakpoint, columns]);

  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div
      className={cn(
        "columns-1",
        responsiveColumns === 2 && "sm:columns-2",
        responsiveColumns === 3 && "md:columns-3",
        responsiveColumns === 4 && "lg:columns-4",
        responsiveColumns === 5 && "xl:columns-5",
        gapClasses[gap],
        className
      )}
    >
      {React.Children.map(children, (child, index) => (
        <div key={index} className="break-inside-avoid mb-4">
          {child}
        </div>
      ))}
    </div>
  );
}
