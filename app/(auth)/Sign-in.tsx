import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { useClerk, useSignIn } from "@clerk/expo";
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

const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { setActive } = useClerk();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const isLoading = fetchStatus === "fetching";
  const canSubmit = Boolean(emailAddress && password && !isLoading);
  const decorateUrl = (url: string) => url;

  const navigateToHome = async () => {
    if (!signIn.createdSessionId || !setActive) {
      console.error("Sign-in completed without an active session id.");
      return;
    }

    await setActive({ session: signIn.createdSessionId });
    const url = decorateUrl("/(tabs)");
    router.replace(url as Href);
  };

  const handleSubmit = async () => {
    const { error } = await signIn.password({ emailAddress, password });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await navigateToHome();
      return;
    }

    if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }

      return;
    }

    if (signIn.status !== "needs_second_factor") {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await navigateToHome();
      return;
    }

    console.error("Sign-in attempt not complete:", signIn);
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={[styles.content, styles.centeredContent]}>
            <Text style={[styles.title, styles.centerText]}>Verify your account</Text>
            <Text style={[styles.subtitle, styles.centerText]}>
              Enter the verification code sent to your email.
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

              <Pressable style={styles.secondaryButton} onPress={() => signIn.mfa.sendEmailCode()}>
                <Text style={styles.secondaryButtonText}>I need a new code</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={() => signIn.reset()}>
                <Text style={styles.secondaryButtonText}>Start over</Text>
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
          <View style={styles.content}>
            <View style={styles.brandBlock}>
              <View style={styles.logoRow}>
                <Image source={icons.logo} resizeMode="contain" style={styles.logo} />
                <View>
                  <Text style={styles.wordmark}>Recurly</Text>
                  <Text style={styles.wordmarkSub}>SMART BILLING</Text>
                </View>
              </View>

              <Text style={[styles.title, styles.centerText]}>Welcome back</Text>
              <Text style={[styles.subtitle, styles.centerText]}>
                Sign in to continue managing your subscriptions
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, errors.fields.identifier && styles.inputError]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="#667798"
                  keyboardType="email-address"
                  onChangeText={setEmailAddress}
                />
                {errors.fields.identifier && (
                  <Text style={styles.error}>{errors.fields.identifier.message}</Text>
                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[styles.input, errors.fields.password && styles.inputError]}
                  value={password}
                  placeholder="Enter your password"
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
                <Text style={styles.buttonText}>Sign in</Text>
              </Pressable>

              <View style={styles.linkRow}>
                <Text style={styles.linkCopy}>New to Recurly?</Text>
                <Link href="/(auth)/Sign-up" asChild>
                  <Pressable>
                    <Text style={styles.linkText}>Create an account</Text>
                  </Pressable>
                </Link>
              </View>
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
  brandBlock: {
    alignItems: "center",
    marginTop: 28,
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
});

export default SignIn;
