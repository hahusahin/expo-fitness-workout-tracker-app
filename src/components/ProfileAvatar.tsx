import React from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileAvatarProps {
  imageUrl?: string | null;
  firstName?: string | null;
  email?: string;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  isUploading?: boolean;
  showEditIcon?: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUrl,
  firstName,
  email,
  size = 'medium',
  onPress,
  isUploading = false,
  showEditIcon = false,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-10 h-10';
      case 'large':
        return 'w-24 h-24';
      default:
        return 'w-16 h-16';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-2xl';
      default:
        return 'text-xl';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 20;
      default:
        return 16;
    }
  };

  const getInitials = () => {
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const avatarContent = (
    <View className="relative">
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className={`${getSizeClasses()} rounded-full`}
          style={{ resizeMode: 'cover' }}
        />
      ) : (
        <View className={`${getSizeClasses()} rounded-full bg-blue-500 items-center justify-center`}>
          <Text className={`text-white ${getTextSize()} font-lexend-bold`}>
            {getInitials()}
          </Text>
        </View>
      )}

      {/* Loading overlay */}
      {isUploading && (
        <View className={`absolute inset-0 ${getSizeClasses()} rounded-full bg-black bg-opacity-50 items-center justify-center`}>
          <ActivityIndicator size="small" color="white" />
        </View>
      )}

      {/* Edit icon */}
      {showEditIcon && !isUploading && (
        <View className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 border-2 border-white">
          <Ionicons name="camera" size={getIconSize()} color="white" />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isUploading}
        activeOpacity={0.8}
      >
        {avatarContent}
      </TouchableOpacity>
    );
  }

  return avatarContent;
};

export default ProfileAvatar;