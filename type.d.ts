import type { ImageSourcePropType } from "react-native";

declare global {
    interface AppTab {
        name: string;
        title: string;
        icon: ImageSourcePropType;
    }

    interface TabIconProps {
        focused: boolean;
        icon: ImageSourcePropType;
    }

    interface Subscription {
        id: string;
        icon?: ImageSourcePropType;
        iconFallbackText?: string;
        name: string;
        frequency?: string;
        plan?: string;
        category?: string;
        paymentMethod?: string;
        status?: string;
        startDate?: string;
        price: number;
        currency?: string;
        billing: string;
        renewalDate?: string;
        color?: string;
    }

    interface SubscriptionCardProps extends Omit<Subscription, "id"> {
        id: string;
        expanded: boolean;
        onPress: () => void;
        onDetailsPress?: (id: string) => void;
        onCancelPress?: () => void;
        isCancelling?: boolean;
    }

    interface UpcomingSubscription {
        id: string;
        icon?: ImageSourcePropType;
        iconFallbackText?: string;
        name: string;
        price: number;
        currency?: string;
        renewalDate?: string;
        daysLeft: number;
    }

    interface UpcomingSubscriptionCardProps {
        data: UpcomingSubscription;
    }

    interface ListHeadingProps {
        title: string;
        actionLabel?: string;
        onActionPress?: () => void;
    }

    interface HomeUser {
        name: string;
        avatar: ImageSourcePropType;
    }
}

export { };

