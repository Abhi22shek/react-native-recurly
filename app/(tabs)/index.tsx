import "@/global.css";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
  const tabBarHeight = useBottomTabBarHeight()
  return (
    <SafeAreaView className="flex-1 bg-background p-5" style={{ paddingBottom: tabBarHeight }}>
      <Text className="text-7xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Text className="text-7xl font-sans-extrabold text-success">
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