import { CustomInputProps } from "@/types/customComponents";
import { Image, Text, TextInput, View } from "react-native";

const CustomInput = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: CustomInputProps) => {
  return (
    <View className="my-2 w-full">
      {label && (
        <Text className={`text-lg font-lexend-semibold mb-2 ${labelStyle}`}>
          {label}
        </Text>
      )}
      <View
        className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-2xl border border-neutral-100 focus:border-primary-500 ${
          icon ? "pl-4" : ""
        }  ${containerStyle}`}
      >
        {icon && icon}
        <TextInput
          className={`rounded-full p-4 font-lexend text-[15px] flex-1 ${inputStyle} text-left`}
          secureTextEntry={secureTextEntry}
          {...props}
        />
      </View>
    </View>
  );
};

export default CustomInput;
