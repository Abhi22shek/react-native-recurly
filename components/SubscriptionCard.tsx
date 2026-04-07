import { formatCurrency, formatStatusLabel, formatSubscriptionDateTime } from '@/utils/formatCurrency'
import { clsx } from 'clsx'
import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'


const SubscriptionCard = ({ id, name, price, currency, icon, iconFallbackText, startDate, paymentMethod, billing, color, category, plan, renewalDate, expanded, onPress, onDetailsPress, status }: SubscriptionCardProps) => {
    return (
        <Pressable onPress={onPress} className={clsx('sub-card', expanded ? 'sub-card-expanded' : 'sub-card')} style={!expanded && color ? { backgroundColor: color } : undefined}>
            <View className='sub-head'>
                <View className='sub-main'>
                    {icon ? (
                        <Image source={icon} className='sub-icon' />
                    ) : (
                        <View className='sub-icon items-center justify-center bg-primary/10'>
                            <Text className='text-lg font-sans-bold text-primary'>
                                {(iconFallbackText || name.charAt(0) || 'S').toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View className='sub-copy'>
                        <Text numberOfLines={1} className='sub-title'>
                            {name}
                        </Text>
                        <Text className='sub-meta' numberOfLines={1} ellipsizeMode='tail'>
                            {category?.trim() || plan?.trim() || renewalDate ? formatSubscriptionDateTime(renewalDate) : ''}
                        </Text>
                    </View>
                </View>

                <View className='sub-price-box'>
                    <Text className='sub-price'>
                        {formatCurrency(price, currency ?? 'USD')}
                    </Text>
                    <Text className='sub-billing'>{billing}</Text>
                </View>
            </View>

            {expanded && (
                <View className='sub-body'>
                    <View className='sub-details'>
                        <View className='sub-row'>
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>
                                    Category:
                                </Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>
                                    {category?.trim()}
                                </Text>
                            </View>
                        </View>
                        <View className='sub-row'>
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>
                                    Payment:
                                </Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>
                                    {paymentMethod?.trim()}
                                </Text>
                            </View>
                        </View>
                        <View className='sub-row'>
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>
                                    Started:
                                </Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>
                                    {startDate ? formatSubscriptionDateTime(startDate) : ''}
                                </Text>
                            </View>
                        </View>
                        <View className='sub-row'>
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>
                                    Renewal Date:
                                </Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>
                                    {renewalDate ? formatSubscriptionDateTime(renewalDate) : ''}
                                </Text>
                            </View>
                        </View>
                        <View className='sub-row'>
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>
                                    Status:
                                </Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>
                                    {status ? formatStatusLabel(status) : ''}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {onDetailsPress ? (
                        <Pressable className='sub-details-button' onPress={() => onDetailsPress(id)}>
                            <Text className='sub-details-button-text'>Open details</Text>
                        </Pressable>
                    ) : null}
                </View>
            )}

        </Pressable>
    )
}

export default SubscriptionCard
