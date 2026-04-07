import { clsx } from "clsx";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const CATEGORY_OPTIONS = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

const FREQUENCY_OPTIONS = ["Monthly", "Yearly"] as const;

const CATEGORY_COLORS: Record<(typeof CATEGORY_OPTIONS)[number], string> = {
  Entertainment: "#ffd9c8",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#c7e8d2",
  Cloud: "#c4ddff",
  Music: "#d8f0c7",
  Other: "#eadfce",
};

type SubscriptionFrequency = (typeof FREQUENCY_OPTIONS)[number];
type SubscriptionCategory = (typeof CATEGORY_OPTIONS)[number];

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
}

const initialFrequency: SubscriptionFrequency = "Monthly";
const initialCategory: SubscriptionCategory = "Entertainment";

const createSubscriptionId = () => {
  const randomUuid = globalThis.crypto?.randomUUID?.();

  if (randomUuid) {
    return `subscription-${randomUuid}`;
  }

  const randomValues = new Uint8Array(16);
  globalThis.crypto?.getRandomValues?.(randomValues);

  const hexId = Array.from(randomValues, (value) => value.toString(16).padStart(2, "0")).join("");
  return `subscription-${hexId || Math.random().toString(36).slice(2)}`;
};

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<SubscriptionFrequency>(initialFrequency);
  const [category, setCategory] = useState<SubscriptionCategory>(initialCategory);
  const [showErrors, setShowErrors] = useState(false);

  const trimmedName = name.trim();
  const parsedPrice = Number.parseFloat(price);
  const hasValidName = trimmedName.length > 0;
  const hasValidPrice = Number.isFinite(parsedPrice) && parsedPrice > 0;
  const canSubmit = hasValidName && hasValidPrice;

  const validationMessage = useMemo(() => {
    if (!showErrors) return null;
    if (!hasValidName) return "Name is required.";
    if (!hasValidPrice) return "Price must be a positive number.";
    return null;
  }, [hasValidName, hasValidPrice, showErrors]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency(initialFrequency);
    setCategory(initialCategory);
    setShowErrors(false);
  };

  const handleClose = () => {
    setShowErrors(false);
    onClose();
  };

  const handleSubmit = () => {
    setShowErrors(true);

    if (!canSubmit) {
      return;
    }

    const startDate = dayjs();
    const renewalDate =
      frequency === "Yearly" ? startDate.add(1, "year") : startDate.add(1, "month");

    onCreate({
      id: createSubscriptionId(),
      name: trimmedName,
      price: parsedPrice,
      frequency,
      category,
      status: "active",
      startDate: startDate.toISOString(),
      renewalDate: renewalDate.toISOString(),
      icon: undefined,
      iconFallbackText: trimmedName.charAt(0).toUpperCase(),
      billing: frequency,
      color: CATEGORY_COLORS[category],
      currency: "USD",
      plan: `${frequency} Plan`,
      paymentMethod: "Manual entry",
    });

    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable className="modal-overlay" onPress={handleClose}>
        <Pressable onPress={() => {}}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="modal-container"
          >
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">x</Text>
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="modal-body"
            >
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter subscription name"
                  placeholderTextColor="rgba(0, 0, 0, 0.45)"
                  className={clsx("auth-input", showErrors && !hasValidName && "auth-input-error")}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor="rgba(0, 0, 0, 0.45)"
                  keyboardType="decimal-pad"
                  className={clsx("auth-input", showErrors && !hasValidPrice && "auth-input-error")}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {FREQUENCY_OPTIONS.map((option) => {
                    const isActive = frequency === option;

                    return (
                      <Pressable
                        key={option}
                        className={clsx("picker-option", isActive && "picker-option-active")}
                        onPress={() => setFrequency(option)}
                      >
                        <Text
                          className={clsx(
                            "picker-option-text",
                            isActive && "picker-option-text-active",
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORY_OPTIONS.map((option) => {
                    const isActive = category === option;

                    return (
                      <Pressable
                        key={option}
                        className={clsx("category-chip", isActive && "category-chip-active")}
                        onPress={() => setCategory(option)}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            isActive && "category-chip-text-active",
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {validationMessage ? (
                <Text className="auth-error">{validationMessage}</Text>
              ) : (
                <Text className="auth-helper">
                  Fill out the details to create a new subscription.
                </Text>
              )}

              <Pressable
                className={clsx("auth-button", !canSubmit && "auth-button-disabled")}
                onPress={handleSubmit}
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CreateSubscriptionModal;
