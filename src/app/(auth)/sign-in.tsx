import { Link } from "expo-router";
import { Text, View } from "react-native";

const SignIn = () => {
    return (
        <View>
            <Text>Sign In</Text>
            <Link href="/(auth)/sign-up">Create Account</Link>
            <Link href="/" className="mt-8">Insights</Link>
        </View>
    )
}

export default SignIn;