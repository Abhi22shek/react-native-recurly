import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React from 'react'
import { Text, View } from 'react-native'
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

const Insight = () => {
    const tabBarHeight = useBottomTabBarHeight()
    return (
        <SafeAreaView className="flex-1 bg-background p-5" style={{ paddingBottom: tabBarHeight }}>
            <Text>Insight</Text>
        </SafeAreaView>
    )
}

export default Insight