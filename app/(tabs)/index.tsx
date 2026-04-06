import ListHeading from "@/components/LIstHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSusbcriptionCard from "@/components/UpcomingSusbcriptionCard";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/image";
import "@/global.css";
import { formatCurrency } from "@/utils/formatCurrency";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {

  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null)

  const tabBarHeight = useBottomTabBarHeight()
  return (
    <SafeAreaView className="flex-1 bg-background p-5" style={{ paddingBottom: tabBarHeight }}>


      <View className="flex-1">
        <FlatList
          ListHeaderComponent={() => (
            <>
              <View className="home-header">
                <View className="home-user">
                  <Image source={images.avatar} className="home-avatar" />
                  <Text className="home-user-name">{HOME_USER.name}</Text>
                </View>

                <Image source={icons.add} className="home-add-icon" />
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
                <ListHeading title="Upcoming" />
                <FlatList
                  data={UPCOMING_SUBSCRIPTIONS}
                  renderItem={({ item }) => <UpcomingSusbcriptionCard data={item} />}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={<Text className="home-empty-state">No upcoming Renewal</Text>}
                />
              </View>

              <ListHeading title="All subscritpion" />
            </>
          )}
          data={HOME_SUBSCRIPTIONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SubscriptionCard {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id))}
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