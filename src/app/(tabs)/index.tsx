import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  UPCOMING_SUBSCRIPTIONS
} from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { posthog } from "@/lib/posthog";
import { posthogLogger } from "@/lib/posthog-logger";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import {
  FlatList,
  Image,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();
  const [expandedSubscriptionId, setExpandedSubscriptionId] =
    useState<string | null>(null);

  const displayName = user?.firstName || user?.fullName || user?.emailAddresses[0]?.emailAddress || 'User';

  const handleSubscriptionPress = (item: (typeof HOME_SUBSCRIPTIONS)[number]) => {
    const isClosing = expandedSubscriptionId === item.id;
    const subscriptionCategory = item.category ?? item.plan;

    setExpandedSubscriptionId(isClosing ? null : item.id);
    posthog?.capture(isClosing ? 'subscription_details_closed' : 'subscription_details_opened', {
      billing_interval: item.billing,
      subscription_category: subscriptionCategory,
    });
    posthogLogger.info('subscription details visibility changed', {
      action: isClosing ? 'closed' : 'opened',
      billing_interval: item.billing,
      subscription_category: subscriptionCategory,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        className="flex-1"
        style={{ flex: 1 }}
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        extraData={expandedSubscriptionId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListHeaderComponent={
          <View>

            <View className="home-header">
              <View className="home-user">
                <Image source={user?.imageUrl ? { url: user.imageUrl } : images.avatar} className="home-avatar" />
                <Text className="home-user-name">
                  {displayName}
                </Text>
              </View>

              <Image source={icons.add} className="home-add-icon" />
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>

                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />

              <FlatList
                horizontal
                data={UPCOMING_SUBSCRIPTIONS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming renewals yet.
                  </Text>
                }
              />
            </View>
            <ListHeading title="All Subscriptions" />
          </View>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            onPress={() => handleSubscriptionPress(item)}
            expanded={expandedSubscriptionId === item.id}
          />
        )}
        ListEmptyComponent={
          <Text className="home-empty-state">
            No subscriptions yet.
          </Text>
        }
        contentContainerClassName="pb-28"
      />
    </SafeAreaView>
  );
}