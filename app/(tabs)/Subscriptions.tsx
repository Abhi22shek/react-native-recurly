import SubscriptionCard from "@/components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import "@/global.css";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { styled } from "nativewind";
import React, { useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

const Subscriptions = () => {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const tabBarHeight = useBottomTabBarHeight()

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredSubscriptions = HOME_SUBSCRIPTIONS.filter((subscription) => {
    if (!normalizedQuery) return true

    const searchableFields = [
      subscription.name,
      subscription.plan,
      subscription.category,
      subscription.billing,
      subscription.status,
      subscription.paymentMethod,
    ]

    return searchableFields.some((field) =>
      field?.toLowerCase().includes(normalizedQuery)
    )
  })

  return (
    <SafeAreaView className="flex-1 bg-background p-5" style={{ paddingBottom: tabBarHeight }}>
      <View className="flex-1">
        <Text className="list-title mb-5">Subscriptions</Text>

        <View className="home-search-wrap">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search subscriptions"
            placeholderTextColor="rgba(0, 0, 0, 0.45)"
            className="home-search-input"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubscriptionCard
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() => setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id))}
            />
          )}
          extraData={expandedSubscriptionId}
          ItemSeparatorComponent={() => <View className="h-3" />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="home-empty-state">
              {normalizedQuery ? "No subscriptions match your search" : "No subscriptions"}
            </Text>
          }
          contentContainerClassName="pb-30"
        />
      </View>
    </SafeAreaView>
  )
}

export default Subscriptions
