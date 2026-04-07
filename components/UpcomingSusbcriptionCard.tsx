import dayjs from 'dayjs'
import { formatCurrency } from '@/utils/formatCurrency'
import { Image, Text, View } from 'react-native'


const UpcomingSusbcriptionCard = ({ data: { name, price, daysLeft, currency, icon, iconFallbackText, renewalDate } }: UpcomingSubscriptionCardProps) => {
    return (
        <View className="upcoming-card">
            <View className="upcoming-row">
                {icon ? (
                    <Image source={icon} className="upcoming-icon" />
                ) : (
                    <View className="upcoming-icon items-center justify-center rounded-2xl bg-primary/10">
                        <Text className="text-lg font-sans-bold text-primary">
                            {(iconFallbackText || name.charAt(0) || 'S').toUpperCase()}
                        </Text>
                    </View>
                )}
                <View>
                    <Text className="upcoming-price">{formatCurrency(price, currency ?? 'USD')}</Text>
                    <Text className='upcoming-meta' numberOfLines={1}>{daysLeft > 1 ? `${daysLeft} days left` : 'last day'}</Text>
                </View>
            </View>
            <Text className='upcoming-name' numberOfLines={1}>{name}</Text>
            <Text className='upcoming-meta' numberOfLines={1}>
                {renewalDate ? `Renews ${dayjs(renewalDate).format('MMM D')}` : 'Renewal pending'}
            </Text>
        </View>
    )
}

export default UpcomingSusbcriptionCard
