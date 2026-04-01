import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const SignUp = () => {
    return (
        <View>
            <Text>Sign-up</Text>
            <Link href="/(auth)/Sign-in" className="text-xl font-bold text-success bg-primary p-4 rounded-lg">Go to Sign in</Link>
        </View>
    )
}

export default SignUp