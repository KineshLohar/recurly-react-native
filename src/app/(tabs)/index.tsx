
import { Link } from "expo-router";
import { styled } from 'nativewind';
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Link
        href='/onboarding'
        className="mt-4 bg-primary p-4 rounded text-white"
      >
        Go to Onboarding
      </Link>
      <Link
        href='/(auth)/sign-in'
        className="mt-4 bg-primary p-4 rounded text-white"
      >
        Go to Sign In
      </Link>
      <Link
        href='/(auth)/sign-up'
        className="mt-4 bg-primary p-4 rounded text-white"
      >
        Go to Sign Up
      </Link>
    </SafeAreaView>
  );
}