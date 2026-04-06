import { formatCurrency } from '@/utils/formatCurrency'
import { Image, Text, View } from 'react-native'


const UpcomingSusbcriptionCard = ({ data: { name, price, daysLeft, currency, icon } }: UpcomingSubscriptionCardProps) => {
    return (
        <View className="upcoming-card">
            <View className="upcoming-row">
                <Image source={icon} className="upcoming-icon" />
                <View>
                    <Text className="upcoming-price">{formatCurrency(price, currency ?? 'USD')}</Text>
                    <Text className='upcoming-meta' numberOfLines={1}>{daysLeft > 1 ? `${daysLeft} days left` : 'last day'}</Text>
                </View>
            </View>
            <Text className='upcoming-meta' numberOfLines={1}>{name}</Text>
        </View>
    )
}

export default UpcomingSusbcriptionCard