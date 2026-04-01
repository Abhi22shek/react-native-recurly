import { Link, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const SubscriptionDetail = () => {
    const { id } = useLocalSearchParams();

    return (
        <View>
            <Text>SubscriptionDetail : {id}</Text>
            <Link href="/Subscriptions" className='text-primary'>Back</Link>
        </View>
    )
}

export default SubscriptionDetail