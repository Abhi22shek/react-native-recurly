import ListHeading from "@/components/LIstHeading";
import { useSubscriptions } from "@/components/SubscriptionsProvider";
import SubscriptionCard from "@/components/SubscriptionCard";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import UpcomingSusbcriptionCard from "@/components/UpcomingSusbcriptionCard";
import { HOME_BALANCE, HOME_USER } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/image";
import "@/global.css";
import { getUpcomingSubscriptions } from "@/utils/subscriptionInsights";
import { formatCurrency } from "@/utils/formatCurrency";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import dayjs from "dayjs";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {

  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const { subscriptions, addSubscription } = useSubscriptions()

  const tabBarHeight = useBottomTabBarHeight()
  const upcomingSubscriptions = useMemo(() => getUpcomingSubscriptions(subscriptions), [subscriptions])

  const handleCreateSubscription = (subscription: Subscription) => {
    addSubscription(subscription)
    setExpandedSubscriptionId(subscription.id)
    setIsCreateModalVisible(false)
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-5" style={{ paddingBottom: tabBarHeight }}>
      <CreateSubscriptionModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={handleCreateSubscription}
      />

      <View className="flex-1">
        <FlatList
          ListHeaderComponent={() => (
            <>
              <View className="home-header">
                <View className="home-user">
                  <Image source={images.avatar} className="home-avatar" />
                  <Text className="home-user-name">{HOME_USER.name}</Text>
                </View>

                <Pressable onPress={() => setIsCreateModalVisible(true)}>
                  <Image source={icons.add} className="home-add-icon" />
                </Pressable>
              </View>

              <View className="home-balance-card">
                <Text className="home-balance-label">Balance</Text>
                <View className="home-balance-row">
                  <Text className="home-balance-amount">
                    {formatCurrency(HOME_BALANCE.amount, HOME_BALANCE.currency)}
                  </Text>
                  <Text className="home-balance-date">
                    {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
                  </Text>
                </View>
              </View>


              <View className="mb-5">
                <ListHeading title="Upcoming" actionLabel="See all" onActionPress={() => router.push("/(tabs)/insights")} />
                <FlatList
                  data={upcomingSubscriptions}
                  renderItem={({ item }) => <UpcomingSusbcriptionCard data={item} />}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={<Text className="home-empty-state">No upcoming Renewal</Text>}
                />
              </View>

              <ListHeading title="All subscriptions" onActionPress={() => router.push("/(tabs)/subscriptions")} />
            </>
          )}
          data={subscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SubscriptionCard {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id))}
            onDetailsPress={(id) => router.push(`/(tabs)/subscriptions/${id}`)}
          />}
          extraData={expandedSubscriptionId}
          ItemSeparatorComponent={() => <View className="h-3" />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text className="home-empty-state">No subscriptions</Text>}
          contentContainerClassName="pb-30"
        />
      </View>


    </SafeAreaView>
  );
}
