import dayjs from "dayjs";

export const getActiveSubscriptions = (subscriptions: Subscription[]) =>
  subscriptions.filter((subscription) => subscription.status !== "cancelled");

export const getUpcomingSubscriptions = (
  subscriptions: Subscription[],
): UpcomingSubscription[] => {
  const today = dayjs();

  return subscriptions
    .filter((subscription) => subscription.renewalDate)
    .map((subscription) => {
      const renewalDate = dayjs(subscription.renewalDate);
      const dayDifference = renewalDate.startOf("day").diff(today.startOf("day"), "day");

      return {
        id: subscription.id,
        icon: subscription.icon,
        iconFallbackText: subscription.iconFallbackText,
        name: subscription.name,
        price: subscription.price,
        currency: subscription.currency,
        renewalDate: subscription.renewalDate,
        daysLeft: dayDifference,
      };
    })
    .filter((subscription) => subscription.daysLeft >= 0)
    .sort((left, right) => left.daysLeft - right.daysLeft)
    .slice(0, 5);
};

export const getMonthlySpend = (subscriptions: Subscription[]) =>
  subscriptions.reduce((total, subscription) => {
    if (subscription.status === "cancelled") return total;
    if (subscription.billing === "Yearly") return total + subscription.price / 12;
    return total + subscription.price;
  }, 0);

export const getYearlySpend = (subscriptions: Subscription[]) =>
  subscriptions.reduce((total, subscription) => {
    if (subscription.status === "cancelled") return total;
    if (subscription.billing === "Yearly") return total + subscription.price;
    return total + subscription.price * 12;
  }, 0);

export const getCategoryBreakdown = (subscriptions: Subscription[]) => {
  const monthlySpend = getMonthlySpend(subscriptions);
  const categoryTotals = subscriptions.reduce<Record<string, number>>((accumulator, subscription) => {
    if (subscription.status === "cancelled") return accumulator;

    const category = subscription.category?.trim() || "Other";
    const normalizedPrice = subscription.billing === "Yearly" ? subscription.price / 12 : subscription.price;

    accumulator[category] = (accumulator[category] ?? 0) + normalizedPrice;
    return accumulator;
  }, {});

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: monthlySpend > 0 ? (amount / monthlySpend) * 100 : 0,
    }))
    .sort((left, right) => right.amount - left.amount);
};

export const getStatusBreakdown = (subscriptions: Subscription[]) => {
  const counts = subscriptions.reduce<Record<string, number>>((accumulator, subscription) => {
    const status = subscription.status?.trim() || "unknown";
    accumulator[status] = (accumulator[status] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .map(([status, count]) => ({ status, count }))
    .sort((left, right) => right.count - left.count);
};
