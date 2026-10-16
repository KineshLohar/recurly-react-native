import { posthog } from '@/lib/posthog';
import '@/styles/global.css';
import { ClerkProvider, useAuth, useUser } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useGlobalSearchParams, usePathname } from "expo-router";
import { PostHogProvider } from 'posthog-react-native';
import { useEffect, useRef } from "react";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

function RootLayoutContent() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      identifiedUserId.current = null;
      return;
    }

    if (!posthog || !userLoaded || !user?.id || identifiedUserId.current === user.id) {
      return;
    }

    posthog.identify(user.id, {
      ...(user.primaryEmailAddress?.emailAddress && { email: user.primaryEmailAddress.emailAddress }),
      ...(user.fullName && { name: user.fullName }),
    });
    identifiedUserId.current = user.id;
  }, [isSignedIn, user, userLoaded]);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      const sanitizedParams = Object.keys(params).reduce((acc, key) => {
        if (['id', 'tab', 'view'].includes(key)) {
          acc[key] = params[key];
        }
        return acc;
      }, {} as Record<string, string | string[]>);

      posthog?.screen(pathname, sanitizedParams);
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  const [fontsLoaded] = useFonts({
    'sans-regular': require('@/assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('@/assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('@/assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('@/assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('@/assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('@/assets/fonts/PlusJakartaSans-Light.ttf')
  })

  useEffect(() => {
    // Hide splash only when both fonts and auth are loaded
    if (fontsLoaded && authLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, authLoaded])

  // Don't render app until both are ready
  if (!fontsLoaded || !authLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const app = (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootLayoutContent />
    </ClerkProvider>
  );

  return posthog ? <PostHogProvider client={posthog}>{app}</PostHogProvider> : app;
}