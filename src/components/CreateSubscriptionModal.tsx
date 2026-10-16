import { icons } from "@/constants/icons";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
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

const FREQUENCY_OPTIONS = ["Monthly", "Yearly"] as const;
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

const CATEGORY_COLORS: Record<(typeof CATEGORY_OPTIONS)[number], string> = {
    Entertainment: "#f5c542",
    "AI Tools": "#b8d4e3",
    "Developer Tools": "#e8def8",
    Design: "#b8e8d0",
    Productivity: "#8fd1bd",
    Cloud: "#c5d4f0",
    Music: "#f5b8c8",
    Other: "#f6eecf",
};

type Frequency = (typeof FREQUENCY_OPTIONS)[number];
type Category = (typeof CATEGORY_OPTIONS)[number];

interface CreateSubscriptionModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (subscription: Subscription) => void;
}

const CreateSubscriptionModal = ({
    visible,
    onClose,
    onCreate,
}: CreateSubscriptionModalProps) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [frequency, setFrequency] = useState<Frequency>("Monthly");
    const [category, setCategory] = useState<Category>("Entertainment");

    const parsedPrice = Number.parseFloat(price);
    const isNameValid = name.trim().length > 0;
    const isPriceValid = Number.isFinite(parsedPrice) && parsedPrice > 0;
    const isFormValid = isNameValid && isPriceValid;

    const resetForm = () => {
        setName("");
        setPrice("");
        setFrequency("Monthly");
        setCategory("Entertainment");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = () => {
        if (!isFormValid) return;

        const startDate = dayjs();
        const renewalDate =
            frequency === "Yearly"
                ? startDate.add(1, "year")
                : startDate.add(1, "month");

        const subscription: Subscription = {
            id: `sub-${Date.now()}`,
            name: name.trim(),
            price: parsedPrice,
            frequency,
            category,
            status: "active",
            startDate: startDate.toISOString(),
            renewalDate: renewalDate.toISOString(),
            icon: icons.wallet,
            billing: frequency,
            color: CATEGORY_COLORS[category],
            currency: "USD",
        };

        onCreate(subscription);
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
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View className="modal-overlay">
                    <Pressable className="flex-1" onPress={handleClose} />

                    <View className="modal-container">
                        <View className="modal-header">
                            <Text className="modal-title">New Subscription</Text>
                            <Pressable className="modal-close" onPress={handleClose}>
                                <Text className="modal-close-text">×</Text>
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
                                    className="auth-input"
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Netflix, Figma, ChatGPT..."
                                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                    autoCapitalize="words"
                                />
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Price</Text>
                                <TextInput
                                    className="auth-input"
                                    value={price}
                                    onChangeText={setPrice}
                                    placeholder="9.99"
                                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                    keyboardType="decimal-pad"
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
                                                className={clsx(
                                                    "picker-option",
                                                    isActive && "picker-option-active"
                                                )}
                                                onPress={() => setFrequency(option)}
                                            >
                                                <Text
                                                    className={clsx(
                                                        "picker-option-text",
                                                        isActive && "picker-option-text-active"
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
                                                className={clsx(
                                                    "category-chip",
                                                    isActive && "category-chip-active"
                                                )}
                                                onPress={() => setCategory(option)}
                                            >
                                                <Text
                                                    className={clsx(
                                                        "category-chip-text",
                                                        isActive && "category-chip-text-active"
                                                    )}
                                                >
                                                    {option}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>

                            <Pressable
                                className={clsx(
                                    "auth-button",
                                    !isFormValid && "auth-button-disabled"
                                )}
                                onPress={handleSubmit}
                                disabled={!isFormValid}
                            >
                                <Text className="auth-button-text">Add Subscription</Text>
                            </Pressable>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CreateSubscriptionModal;
