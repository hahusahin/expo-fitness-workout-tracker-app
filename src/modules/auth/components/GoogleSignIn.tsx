import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GoogleSignInProps {
  onPress: () => void;
  isLoading?: boolean;
}

export default function GoogleSignIn({ onPress, isLoading = false }: GoogleSignInProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      className={`bg-white border-2 border-gray-200 rounded-xl py-4 shadow-sm ${
        isLoading ? 'opacity-50' : ''
      }`}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-center">
        <Ionicons name="logo-google" size={20} color="#EA4335" />
        <Text className="text-gray-900 font-semibold text-lg ml-3">
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
              // See https://clerk.com/docs/custom-flows/overview#session-tasks
              console.log(session?.currentTask);
              return;
            }

            router.push("/");
          },
        });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white border-2 border-gray-200 rounded-xl py-4 shadow-sm"
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-center">
        <Ionicons name="logo-google" size={20} color="#EA4335" />
        <Text className="text-gray-900 font-semibold text-lg ml-3">
          Continue with Google
        </Text>
      </View>
    </TouchableOpacity>
  );
}
