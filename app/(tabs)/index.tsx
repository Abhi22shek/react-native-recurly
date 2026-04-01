import "@/global.css";
import { Link } from "expo-router";
import { Text } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/Onboarding" className="text-xl font-bold text-success bg-primary p-4 rounded-lg">Go to  Onboarding</Link>

      <Link href="/subscriptions/spotify" className="text-xl font-bold text-success bg-primary p-4 rounded-lg">spotify subscription</Link>
      <Link href={{
        pathname: "/subscriptions/[id]",
        params: {
          id: "claude"
        }
      }} className="text-xl font-bold text-success bg-primary p-4 rounded-lg">claude subscription</Link>
    </SafeAreaView>
  );
}