import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import images from "@/constants/image";
import { colors } from "@/constants/theme";
import { formatCurrency } from "@/utils/formatCurrency";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useClerk, useUser } from "@clerk/expo";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const activeSubscriptions = HOME_SUBSCRIPTIONS.filter(
    (item) => item.status === "active" || item.status === "paused",
  );
  const monthlySpend = activeSubscriptions.reduce((total, item) => {
    if (item.billing === "Yearly") {
      return total + item.price / 12;
    }
    return total + item.price;
  }, 0);

  const accountName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Recurly User";

  const accountEmail =
    user?.primaryEmailAddress?.emailAddress || "No primary email available";

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 36 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Profile & Control</Text>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Manage your account, review subscription activity, and switch sessions
            whenever you need to test the auth flow again.
          </Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.profileRow}>
            <Image source={images.avatar} style={styles.avatar} />
            <View style={styles.profileCopy}>
              <Text style={styles.profileName}>{accountName}</Text>
              <Text style={styles.profileEmail}>{accountEmail}</Text>
              <Text style={styles.profileMeta}>Clerk account connected</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Active plans</Text>
              <Text style={styles.statValue}>{activeSubscriptions.length}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Monthly spend</Text>
              <Text style={styles.statValue}>{formatCurrency(monthlySpend, "USD")}</Text>
            </View>
          </View>
        </View>

        <SectionTitle title="Account" />
        <View style={styles.sectionCard}>
          <SettingsRow
            label="Email"
            value={accountEmail}
            helper="Primary contact used for sign-in"
          />
          <Divider />
          <SettingsRow
            label="User ID"
            value={user?.id ?? "Unavailable"}
            helper="Useful while debugging Clerk sessions"
          />
          <Divider />
          <SettingsRow
            label="Session status"
            value="Signed in"
            helper="Protected routes are currently unlocked"
          />
        </View>

        <SectionTitle title="Preferences" />
        <View style={styles.sectionCard}>
          <SettingsRow
            label="Billing alerts"
            value="Enabled"
            helper="Get reminded before renewals hit your card"
          />
          <Divider />
          <SettingsRow
            label="Currency view"
            value="USD"
            helper="Matches the balances shown across the app"
          />
          <Divider />
          <SettingsRow
            label="Theme"
            value="Warm light"
            helper="Styled to match the current Recurly concept"
          />
        </View>

        <SectionTitle title="Security" />
        <View style={styles.sectionCard}>
          <Text style={styles.securityTitle}>Need to test auth again?</Text>
          <Text style={styles.securityCopy}>
            Use the action below to clear your current session and jump back to the
            sign-in or sign-up screens.
          </Text>
          <Pressable
            style={[styles.logoutButton, isSigningOut && styles.logoutButtonDisabled]}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            <Text style={styles.logoutButtonText}>
              {isSigningOut ? "Signing out..." : "Log out"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SectionTitle = ({ title }: { title: string }) => (
  <View style={styles.sectionHeading}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const SettingsRow = ({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) => (
  <View style={styles.row}>
    <View style={styles.rowCopy}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowHelper}>{helper}</Text>
    </View>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  eyebrow: {
    marginBottom: 8,
    fontFamily: "sans-semibold",
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.accent,
  },
  title: {
    fontFamily: "sans-extrabold",
    fontSize: 34,
    color: colors.primary,
  },
  subtitle: {
    marginTop: 10,
    maxWidth: 330,
    fontFamily: "sans-medium",
    fontSize: 15,
    lineHeight: 23,
    color: colors.mutedForeground,
  },
  heroCard: {
    borderRadius: 30,
    backgroundColor: colors.primary,
    padding: 22,
    marginBottom: 26,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  profileCopy: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontFamily: "sans-bold",
    fontSize: 24,
    color: "#fff8ea",
  },
  profileEmail: {
    marginTop: 4,
    fontFamily: "sans-medium",
    fontSize: 14,
    color: "rgba(255, 248, 234, 0.88)",
  },
  profileMeta: {
    marginTop: 6,
    fontFamily: "sans-semibold",
    fontSize: 12,
    color: "#f6c8b4",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
  },
  statCard: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: "rgba(255, 249, 227, 0.12)",
    padding: 16,
  },
  statLabel: {
    fontFamily: "sans-medium",
    fontSize: 13,
    color: "rgba(255, 248, 234, 0.72)",
  },
  statValue: {
    marginTop: 10,
    fontFamily: "sans-bold",
    fontSize: 22,
    color: "#fff8ea",
  },
  sectionHeading: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: "sans-bold",
    fontSize: 22,
    color: colors.primary,
  },
  sectionCard: {
    marginBottom: 22,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 16,
  },
  rowCopy: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: "sans-semibold",
    fontSize: 15,
    color: colors.primary,
  },
  rowHelper: {
    marginTop: 4,
    fontFamily: "sans-medium",
    fontSize: 13,
    lineHeight: 19,
    color: colors.mutedForeground,
  },
  rowValue: {
    maxWidth: 128,
    textAlign: "right",
    fontFamily: "sans-bold",
    fontSize: 14,
    color: colors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  securityTitle: {
    marginTop: 10,
    fontFamily: "sans-bold",
    fontSize: 18,
    color: colors.primary,
  },
  securityCopy: {
    marginTop: 8,
    fontFamily: "sans-medium",
    fontSize: 14,
    lineHeight: 21,
    color: colors.mutedForeground,
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 12,
    minHeight: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
  logoutButtonDisabled: {
    opacity: 0.5,
  },
  logoutButtonText: {
    fontFamily: "sans-bold",
    fontSize: 16,
    color: "#fff8ea",
  },
});

export default Settings;
