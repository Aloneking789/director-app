import { AnalyticsProvider } from '@rork-ai/toolkit-sdk';
import { RorkDevWrapper } from '@rork-ai/toolkit-dev-sdk/v54';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/contexts/AppContext";
import Colors from "@/constants/colors";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: Colors.light.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold" as const,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="students/index" options={{ title: "Student Directory" }} />
      <Stack.Screen name="students/[id]" options={{ title: "Student Details" }} />
      <Stack.Screen name="staff/index" options={{ title: "Staff Directory" }} />
      <Stack.Screen name="staff/[id]" options={{ title: "Staff Details" }} />
      <Stack.Screen name="fees/index" options={{ title: "Fee Management" }} />
      <Stack.Screen name="attendance/index" options={{ title: "Attendance" }} />
      <Stack.Screen name="reports/index" options={{ title: "Reports & Analytics" }} />
      <Stack.Screen name="reports/deleted-receipts" options={{ title: "Deleted Receipts" }} />
      <Stack.Screen name="reports/student-grid" options={{ title: "Class-wise Student Grid" }} />
      <Stack.Screen name="reports/working-log" options={{ title: "Working Log" }} />
      <Stack.Screen name="reports/staff-attendance" options={{ title: "Staff Attendance Report" }} />
      <Stack.Screen name="reports/monthly-charts" options={{ title: "Analytics Charts" }} />
      <Stack.Screen name="reports/daily-collection" options={{ title: "Daily Collection" }} />
      <Stack.Screen name="reports/monthly-collection" options={{ title: "Monthly Collection" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </AppProvider>
    </QueryClientProvider>
  );
}
export default function RorkRootLayoutWrapper() {
  return (
    <AnalyticsProvider><RorkDevWrapper><RootLayout /></RorkDevWrapper></AnalyticsProvider>
  );
}