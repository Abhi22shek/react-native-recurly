import { useSubscriptions } from "@/components/SubscriptionsProvider";
import ListHeading from "@/components/LIstHeading";
import "@/global.css";
import { colors } from "@/constants/theme";
import {
    getActiveSubscriptions,
    getCategoryBreakdown,
    getMonthlySpend,
    getStatusBreakdown,
    getUpcomingSubscriptions,
    getYearlySpend,
} from "@/utils/subscriptionInsights";
import { formatCurrency, formatStatusLabel } from "@/utils/formatCurrency";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import dayjs from "dayjs";
import React, { useMemo } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

const Insight = () => {
    const { subscriptions } = useSubscriptions()
    const tabBarHeight = useBottomTabBarHeight()
    const activeSubscriptions = useMemo(() => getActiveSubscriptions(subscriptions), [subscriptions])
    const upcomingSubscriptions = useMemo(() => getUpcomingSubscriptions(subscriptions), [subscriptions])
    const monthlySpend = useMemo(() => getMonthlySpend(subscriptions), [subscriptions])
    const yearlySpend = useMemo(() => getYearlySpend(subscriptions), [subscriptions])
    const categoryBreakdown = useMemo(() => getCategoryBreakdown(subscriptions), [subscriptions])
    const statusBreakdown = useMemo(() => getStatusBreakdown(subscriptions), [subscriptions])
    const nextRenewal = upcomingSubscriptions[0]

    return (
        <SafeAreaView className="flex-1 bg-background p-5" style={{ paddingBottom: tabBarHeight }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-30">
                <Text className="list-title mb-5">Insights</Text>

                <View className="insights-hero">
                    <Text className="insights-hero-label">Recurring spend</Text>
                    <Text className="insights-hero-value">{formatCurrency(monthlySpend, "USD")}</Text>
                    <Text className="insights-hero-copy">
                        {activeSubscriptions.length} active subscriptions across your workspace.
                    </Text>
                </View>

                <View className="insights-grid">
                    <View className="insight-stat-card">
                        <Text className="insight-stat-label">Projected yearly</Text>
                        <Text className="insight-stat-value">{formatCurrency(yearlySpend, "USD")}</Text>
                    </View>
                    <View className="insight-stat-card">
                        <Text className="insight-stat-label">Next renewal</Text>
                        <Text className="insight-stat-value">
                            {nextRenewal?.renewalDate ? dayjs(nextRenewal.renewalDate).format("MMM D") : "None"}
                        </Text>
                        <Text className="insight-stat-meta">
                            {nextRenewal ? nextRenewal.name : "No upcoming renewals"}
                        </Text>
                    </View>
                </View>

                <View className="insight-section">
                    <ListHeading title="Top categories" actionLabel="" />
                    {categoryBreakdown.length ? categoryBreakdown.map((item) => (
                        <View key={item.category} className="insight-row">
                            <View className="insight-row-copy">
                                <Text className="insight-row-title">{item.category}</Text>
                                <Text className="insight-row-meta">{item.percentage.toFixed(0)}% of monthly spend</Text>
                            </View>
                            <Text className="insight-row-value">{formatCurrency(item.amount, "USD")}</Text>
                        </View>
                    )) : (
                        <Text className="home-empty-state">No spending insights yet.</Text>
                    )}
                </View>

                <View className="insight-section">
                    <ListHeading title="Status overview" actionLabel="" />
                    {statusBreakdown.length ? statusBreakdown.map((item) => (
                        <View key={item.status} className="insight-row">
                            <Text className="insight-row-title">{formatStatusLabel(item.status)}</Text>
                            <Text className="insight-row-value">{item.count}</Text>
                        </View>
                    )) : (
                        <Text className="home-empty-state">No subscription statuses yet.</Text>
                    )}
                </View>

                <View className="insight-section">
                    <ListHeading title="Renewal timeline" actionLabel="" />
                    {upcomingSubscriptions.length ? upcomingSubscriptions.map((item) => (
                        <View key={item.id} className="insight-row">
                            <View className="insight-row-copy">
                                <Text className="insight-row-title">{item.name}</Text>
                                <Text className="insight-row-meta">
                                    {item.renewalDate ? dayjs(item.renewalDate).format("MMM D, YYYY") : "Renewal pending"}
                                </Text>
                            </View>
                            <Text className="insight-row-value" style={{ color: item.daysLeft <= 3 ? colors.accent : colors.primary }}>
                                {item.daysLeft === 0 ? "Today" : `${item.daysLeft}d`}
                            </Text>
                        </View>
                    )) : (
                        <Text className="home-empty-state">No upcoming renewals.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Insight
