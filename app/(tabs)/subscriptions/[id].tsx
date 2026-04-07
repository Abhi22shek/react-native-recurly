import { useSubscriptions } from '@/components/SubscriptionsProvider'
import '@/global.css'
import { formatCurrency, formatStatusLabel, formatSubscriptionDateTime } from '@/utils/formatCurrency'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { router, useLocalSearchParams } from 'expo-router'
import { styled } from 'nativewind'
import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

const SubscriptionDetail = () => {
    const { id } = useLocalSearchParams();
    const { getSubscriptionById } = useSubscriptions()
    const tabBarHeight = useBottomTabBarHeight()
    const subscriptionId = Array.isArray(id) ? id[0] : id
    const subscription = subscriptionId ? getSubscriptionById(subscriptionId) : undefined

    return (
        <SafeAreaView className="flex-1 bg-background p-5" style={{ paddingBottom: tabBarHeight }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
                <Pressable className="list-action self-start" onPress={() => router.back()}>
                    <Text className="list-action-text">Back</Text>
                </Pressable>

                {subscription ? (
                    <View className="insight-section mt-5">
                        <Text className="list-title">{subscription.name}</Text>
                        <Text className="insight-detail-price">
                            {formatCurrency(subscription.price, subscription.currency ?? "USD")}
                        </Text>

                        <View className="insight-row">
                            <Text className="insight-row-title">Plan</Text>
                            <Text className="insight-row-value">{subscription.plan || subscription.billing}</Text>
                        </View>
                        <View className="insight-row">
                            <Text className="insight-row-title">Category</Text>
                            <Text className="insight-row-value">{subscription.category || "Other"}</Text>
                        </View>
                        <View className="insight-row">
                            <Text className="insight-row-title">Status</Text>
                            <Text className="insight-row-value">{formatStatusLabel(subscription.status)}</Text>
                        </View>
                        <View className="insight-row">
                            <Text className="insight-row-title">Payment</Text>
                            <Text className="insight-row-value">{subscription.paymentMethod || "Not added"}</Text>
                        </View>
                        <View className="insight-row">
                            <Text className="insight-row-title">Started</Text>
                            <Text className="insight-row-value">{formatSubscriptionDateTime(subscription.startDate)}</Text>
                        </View>
                        <View className="insight-row">
                            <Text className="insight-row-title">Renews</Text>
                            <Text className="insight-row-value">{formatSubscriptionDateTime(subscription.renewalDate)}</Text>
                        </View>
                    </View>
                ) : (
                    <View className="insight-section mt-5">
                        <Text className="list-title">Subscription not found</Text>
                        <Text className="home-empty-state">
                            This subscription may have been removed or the link is invalid.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default SubscriptionDetail
