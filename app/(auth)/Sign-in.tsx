import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const SignIn = () => {
  return (
    <View>
      <Text>Sign-in</Text>
      <Link href="/(auth)/Sign-up" className="text-xl font-bold text-success bg-primary p-4 rounded-lg">Go and create your accorund</Link>
      <Link href="/Subscriptions" className="text-xl font-bold text-success bg-primary p-4 rounded-lg">Go to Subscriptions</Link>
    </View>
  )
}

export default SignIn