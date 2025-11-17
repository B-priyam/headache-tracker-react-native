// TextIcon.tsx
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { Button, ButtonText } from "../ui/button";
import { Input, InputField } from "../ui/input";

type TextIconProps = {
  name: string[];
  data: string;
  img?: ImageSourcePropType;
  imgsize?: number;
  overLaySize?: number;
  overLayTop?: number;
  otherText?: string;
  setData: (texts: string[]) => void;
  onImageLoad?: () => void;
};

const TextIcon = ({
  name,
  data,
  img,
  imgsize = 80,
  overLaySize = 70,
  overLayTop = 5,
  otherText,
  setData,
  onImageLoad,
}: TextIconProps) => {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [text, setText] = useState("");

  const handleClose = () => setShowAlertDialog(false);

  const handleData = (item: string) => {
    if (name.includes(item)) {
      setData(name.filter((prev) => prev !== item));
    } else {
      setData([...name, item]);
    }
  };

  const handleAddOther = () => {
    if (!text.trim()) return;
    const filtered = name.filter(
      (n) => n.toLowerCase() !== "other" && !n.startsWith("Other:")
    );
    const newValue = `Other:${text.trim()}`;
    setData([...filtered, newValue]);
    setShowAlertDialog(false);
  };

  const selectedOtherValue = name.find((n) => n.startsWith("Other:"));
  const isSelected =
    data === "Other" ? Boolean(selectedOtherValue) : name.includes(data);
  const displayLabel =
    data === "Other"
      ? selectedOtherValue
        ? selectedOtherValue.replace("Other:", "")
        : "Other"
      : data;

  return (
    <TouchableOpacity
      className="flex items-center max-h-32 min-h-32"
      style={{
        maxHeight: imgsize > 95 ? "25%" : "20%",
        minHeight: imgsize > 95 ? "25%" : "20%",
      }}
      onPress={() => {
        if (data === "Other") {
          setShowAlertDialog(true);
        } else {
          handleData(data);
        }
      }}
    >
      {isSelected && (
        <View
          className="border-4 border-orange-400 absolute rounded-3xl z-50"
          style={{
            height: overLaySize,
            width: overLaySize,
            top: overLayTop,
          }}
        />
      )}

      <Image
        source={img}
        className="rounded-lg"
        resizeMode="contain"
        style={{
          height: imgsize,
          width: imgsize,
        }}
        onLoad={onImageLoad}
        onError={onImageLoad}
      />

      <Text
        className="text-[#00748D] max-w-20 text-center"
        style={{
          marginBottom: imgsize > 95 ? 15 : 5,
        }}
      >
        {displayLabel}
      </Text>

      <View>
        <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
          <AlertDialogBackdrop />
          <AlertDialogContent>
            <AlertDialogHeader className="flex flex-col mb-5">
              <Text className="text-typography-950 font-semibold py-5 w-full">
                {otherText || "Enter your custom text"}
              </Text>
              <Input variant="outline" size="md" className="w-full">
                <InputField
                  placeholder="Enter here..."
                  value={text}
                  onChangeText={(e) => setText(e)}
                />
              </Input>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="outline"
                action="secondary"
                onPress={handleClose}
                size="sm"
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button size="sm" onPress={handleAddOther}>
                <ButtonText>Submit</ButtonText>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View>
    </TouchableOpacity>
  );
};

export default TextIcon;
