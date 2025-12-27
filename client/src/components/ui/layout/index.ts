/**
 * Modern Layout System - Export all layout components
 */

// Core layout system
export {
  Grid,
  GridItem,
  Container,
  SafeAreaLayout,
  PageLayout,
  Section,
  Stack,
  CardLayout,
  Flex,
  MobileLayout,
  Spacer,
  Divider,
  useBreakpoint,
  breakpoints,
} from "../layout-system";

// Layout patterns and templates
export {
  AppPage,
  DashboardLayout,
  FormLayout,
  ListLayout,
  DetailLayout,
  CardGrid,
  SplitLayout,
  CenteredLayout,
  MasonryLayout,
} from "../layout-patterns";

// Layout utilities and hooks
export {
  getCurrentBreakpoint,
  matchesBreakpoint,
  isMobileViewport,
  isTabletViewport,
  isDesktopViewport,
  getSafeAreaInsets,
  type Breakpoint,
  type SafeAreaInsets,
  type GridConfig,
  LAYOUT_CONSTANTS,
} from "../../../lib/layout-utils";

export {
  useBreakpoint as useBreakpointHook,
  useMatchBreakpoint,
  useViewportType,
  useSafeAreaInsets,
  useSafeAreaElement,
  useResponsiveGrid,
  useElementSize,
  useViewportSize,
  useScrollPosition,
  useScrollDirection,
  useLayoutState,
  useMobileKeyboard,
  useMobileLayout,
  useLayoutTransition,
} from "../../../hooks/use-layout";

// Legacy components (for backward compatibility)
export {
  SafeAreaContainer,
  TouchTarget,
  MobileButton,
  MobileInput,
  ScreenContainer,
  MobileNavContainer,
  useIsTouchDevice,
  useSafeAreaInsets as useLegacySafeAreaInsets,
} from "../mobile-layout";
