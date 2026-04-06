import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const isLoading = fetchStatus === "fetching";
  const canSubmit = Boolean(emailAddress && password && !isLoading);

  const handleSubmit = async () => {
    const { error } = await signUp.password({ emailAddress, password });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }

          const url = decorateUrl("/(tabs)");
          if (typeof window !== "undefined" && url.startsWith("http")) {
            window.location.href = url;
            return;
          }

          router.replace(url as Href);
        },
      });
      return;
    }

    console.error("Sign-up attempt not complete:", signUp);
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={[styles.content, styles.centeredContent]}>
            <Text style={[styles.title, styles.centerText]}>Verify your account</Text>
            <Text style={[styles.subtitle, styles.centerText]}>
              Check your inbox and enter the code.
            </Text>

            <View style={styles.card}>
              <View style={styles.field}>
                <Text style={styles.label}>Verification code</Text>
                <TextInput
                  style={styles.input}
                  value={code}
                  placeholder="Enter verification code"
                  placeholderTextColor="#667798"
                  keyboardType="numeric"
                  onChangeText={setCode}
                />
                {errors.fields.code && <Text style={styles.error}>{errors.fields.code.message}</Text>}
              </View>

              <Pressable
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleVerify}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Verify</Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={() => signUp.verifications.sendEmailCode()}
              >
                <Text style={styles.secondaryButtonText}>I need a new code</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, styles.centeredContent]}>
            <View style={styles.brandBlock}>
              <View style={styles.logoRow}>
                <Image source={icons.logo} resizeMode="contain" style={styles.logo} />
                <View>
                  <Text style={styles.wordmark}>Recurly</Text>
                  <Text style={styles.wordmarkSub}>SMART BILLING</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.title, styles.centerText]}>Create account</Text>
            <Text style={[styles.subtitle, styles.centerText]}>
              Start tracking all your subscriptions in one place.
            </Text>

            <View style={styles.card}>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, errors.fields.emailAddress && styles.inputError]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="#667798"
                  keyboardType="email-address"
                  onChangeText={setEmailAddress}
                />
                {errors.fields.emailAddress && (
                  <Text style={styles.error}>{errors.fields.emailAddress.message}</Text>
                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[styles.input, errors.fields.password && styles.inputError]}
                  value={password}
                  placeholder="Create a password"
                  placeholderTextColor="#667798"
                  secureTextEntry
                  onChangeText={setPassword}
                />
                {errors.fields.password && (
                  <Text style={styles.error}>{errors.fields.password.message}</Text>
                )}
              </View>

              <Pressable
                style={[styles.button, !canSubmit && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={!canSubmit}
              >
                <Text style={styles.buttonText}>Sign up</Text>
              </Pressable>

              <View style={styles.linkRow}>
                <Text style={styles.linkCopy}>Already have an account?</Text>
                <Link href="/(auth)/Sign-in" asChild>
                  <Pressable>
                    <Text style={styles.linkText}>Sign in</Text>
                  </Pressable>
                </Link>
              </View>

              <View nativeID="clerk-captcha" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 40,
  },
  centeredContent: {
    justifyContent: "center",
  },
  title: {
    fontFamily: "sans-extrabold",
    fontSize: 28,
    color: colors.primary,
  },
  subtitle: {
    marginTop: 14,
    maxWidth: 320,
    fontFamily: "sans-medium",
    fontSize: 16,
    lineHeight: 24,
    color: "#4e5f7a",
  },
  centerText: {
    textAlign: "center",
    alignSelf: "center",
  },
  card: {
    marginTop: 42,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(8, 17, 38, 0.14)",
    backgroundColor: "#fff7e7",
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: "#081126",
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 10,
    fontFamily: "sans-semibold",
    fontSize: 16,
    color: colors.primary,
  },
  input: {
    minHeight: 64,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(8, 17, 38, 0.2)",
    backgroundColor: "#fff9e9",
    paddingHorizontal: 20,
    fontFamily: "sans-medium",
    fontSize: 16,
    color: colors.primary,
  },
  inputError: {
    borderColor: colors.destructive,
  },
  error: {
    marginTop: 8,
    fontFamily: "sans-medium",
    fontSize: 12,
    color: colors.destructive,
  },
  button: {
    marginTop: 6,
    minHeight: 60,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: "sans-bold",
    fontSize: 18,
    color: "#fff8ea",
  },
  secondaryButton: {
    marginTop: 14,
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(234, 122, 83, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(234, 122, 83, 0.08)",
  },
  secondaryButtonText: {
    fontFamily: "sans-semibold",
    fontSize: 14,
    color: colors.accent,
  },
  linkRow: {
    marginTop: 26,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  linkCopy: {
    fontFamily: "sans-medium",
    fontSize: 15,
    color: "#4e5f7a",
  },
  linkText: {
    fontFamily: "sans-bold",
    fontSize: 15,
    color: colors.accent,
  },
   logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 88,
  },
  logo: {
    width: 100,
    height: 72,
  },
  wordmark: {
    fontFamily: "sans-extrabold",
    fontSize: 26,
    color: colors.primary,
  },
  wordmarkSub: {
    marginTop: 2,
    fontFamily: "sans-medium",
    fontSize: 12,
    letterSpacing: 1.2,
    color: "#55657f",
  },
  brandBlock: {
    alignItems: "center",
    marginTop: 28,
  },
});

export default SignUp;
