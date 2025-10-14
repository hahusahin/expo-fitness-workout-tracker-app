// Auth hooks - React integration for authentication
import { useState, useEffect, useCallback } from 'react';
import { useSignIn, useSSO } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

export type AuthResult = {
  success: boolean;
  error?: string;
  createdSessionId?: string;
};

export const useAuth = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Warm up browser for OAuth flows
  useEffect(() => {
    WebBrowser.warmUpAsync();
    WebBrowser.maybeCompleteAuthSession();
    
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  // Handle successful authentication
  const handleAuthSuccess = useCallback(async (result: AuthResult) => {
    if (result.success && result.createdSessionId) {
      await setActive({ session: result.createdSessionId });
      router.replace("/(tabs)");
    }
  }, [setActive, router]);

  // Handle authentication errors
  const handleAuthError = useCallback((error: string) => {
    Alert.alert("Authentication Error", error);
  }, []);

  // Google Sign-In logic
  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      // Start the Google OAuth flow
      const { createdSessionId } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        // Successfully authenticated
        const result: AuthResult = {
          success: true,
          createdSessionId,
        };
        await handleAuthSuccess(result);
      } else {
        // Missing requirements (MFA, additional steps)
        // handleAuthError("Additional authentication steps required");
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      const errorMessage = error?.errors?.[0]?.longMessage || 'Google Sign-In failed';
      handleAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [startSSOFlow, handleAuthSuccess, handleAuthError]);

  // Email Sign-In logic
  const signInWithEmail = useCallback(async (emailAddress: string, password: string) => {
    if (!isLoaded) return;

    if (!emailAddress || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        const result: AuthResult = {
          success: true,
          createdSessionId: signInAttempt.createdSessionId,
        };
        await handleAuthSuccess(result);
      } else {
        handleAuthError("Sign-in incomplete. Please try again.");
      }
    } catch (error: any) {
      console.error('Email Sign-In Error:', error);
      const errorMessage = error?.errors?.[0]?.longMessage || 'Email sign-in failed';
      handleAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, signIn, handleAuthSuccess, handleAuthError]);

  return {
    signInWithGoogle,
    signInWithEmail,
    isLoading,
    isLoaded,
  };
};