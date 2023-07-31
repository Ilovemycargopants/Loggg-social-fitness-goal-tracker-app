import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SHADOWS, SIZES, FONT } from '../constants';
import { Link, useRouter } from 'expo-router';

const Index = () => {
    const router = useRouter()

    const handleContinueToSignIn = () => {
        router.replace("login")
        console.log('Continue to sign in pressed');
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>Tutorial</Text>

                <Link href="/(tutorial)/one" asChild>
                    <TouchableOpacity style={{
                        width: '100%',
                        height: 50,
                        backgroundColor: COLORS.primary,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}>
                        <Text style={{ ...FONT.h2, ...SHADOWS.large, color: 'white' }}>How does it work?</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/(tutorial)/two" asChild>
                    <TouchableOpacity style={{
                        width: '100%',
                        height: 50,
                        backgroundColor: COLORS.secondary,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}>
                        <Text style={{ ...FONT.h2, ...SHADOWS.large, color: 'white' }}>What is a Group?</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/(tutorial)/three" asChild>
                    <TouchableOpacity style={{
                        width: '100%',
                        height: 50,
                        backgroundColor: COLORS.tertiary,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}>
                        <Text style={{ ...FONT.h2, ...SHADOWS.large, color: 'white' }}>What are Goals?</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/(tutorial)/four" asChild>
                    <TouchableOpacity style={{
                        width: '100%',
                        height: 50,
                        backgroundColor: COLORS.primary,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}>
                        <Text style={{ ...FONT.h2, ...SHADOWS.large, color: 'white' }}>What are Logs?</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/(tutorial)/five" asChild>
                    <TouchableOpacity style={{
                        width: '100%',
                        height: 50,
                        backgroundColor: COLORS.secondary,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}>
                        <Text style={{ ...FONT.h2, ...SHADOWS.large, color: 'white' }}>How do points work</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/(tutorial)/six" asChild>
                    <TouchableOpacity style={{
                        width: '100%',
                        height: 50,
                        backgroundColor: COLORS.tertiary,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}>
                        <Text style={{ ...FONT.h2, ...SHADOWS.large, color: 'white' }}>About</Text>
                    </TouchableOpacity>
                </Link>

                <TouchableOpacity onPress={handleContinueToSignIn} style={{ marginTop: 20, marginBottom: 20 }}>
                    <Text style={{ color: COLORS.blue, fontSize: 16 }}>Continue to Sign In</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

export default Index;
