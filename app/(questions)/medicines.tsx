import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Input, InputField } from "@/components/ui/input";
import { Form } from "react-hook-form";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { CircleIcon, X } from "lucide-react-native";
import { useGlobal } from "@/store/useQuestions";

const medicines = () => {
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [takingMedicine, setTakingMedicine] = useState("");
  const [takingMedicinesList, setTakingMedicinesList] = useState<string[]>([]);

  const { setMedicine, setMedicinesList } = useGlobal();

  const handleMedicineChange = (text: string, index: number) => {
    setTakingMedicinesList((prev) => {
      const updated = [...prev];
      updated[index] = text;
      return updated;
    });
  };

  useEffect(() => {
    setMedicine(takingMedicine);
    setMedicinesList(takingMedicinesList);
  }, [takingMedicine, takingMedicinesList]);

  return (
    <View
      className="flex-1 bg-gray-100"
      onLayout={(e) => {
        setContainerHeight(e.nativeEvent.layout.height);
      }}
    >
      <View
        style={{
          height: containerHeight ? containerHeight - 80 : "auto",
        }}
        className="flex items-center"
      >
        <Image
          source={require("@/assets/images/Screen_08.png")}
          className="w-[200px] h-[200px]"
          resizeMode="contain"
        />
        <View className="py-5">
          <RadioGroup
            className="flex flex-row gap-32 w-full"
            value={takingMedicine}
            onChange={(e) => setTakingMedicine(e)}
          >
            <Radio
              value="Yes"
              size="md"
              isInvalid={false}
              isDisabled={false}
              onPress={() =>
                takingMedicinesList.length === 0 && takingMedicinesList.push("")
              }
            >
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel
                selectionColor={"#00748D"}
                className="text-[#00748D] font-semibold text-xl selection:text=[#00748D]"
              >
                YES
              </RadioLabel>
            </Radio>
            <Radio value="No" size="md" isInvalid={false} isDisabled={false}>
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel className="text-[#00748D] font-semibold text-xl">
                NO
              </RadioLabel>
            </Radio>
          </RadioGroup>
        </View>
        <View className="w-full px-5 items-center">
          {takingMedicine === "Yes" && (
            <>
              {takingMedicinesList.map((data, index) => (
                <View
                  key={index}
                  className="flex flex-row gap-2 max-w-full items-center"
                >
                  <Text className="text-[#00748D]">{`Medicine 0${
                    index + 1
                  }`}</Text>
                  <Input
                    variant="underlined"
                    size="md"
                    isDisabled={false}
                    isInvalid={false}
                    isReadOnly={false}
                    className="w-2/3"
                  >
                    <InputField
                      placeholder="Enter Text here..."
                      value={data}
                      onChangeText={(e) => handleMedicineChange(e, index)}
                    />
                  </Input>
                  <X
                    onPress={() =>
                      setTakingMedicinesList((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  />
                </View>
              ))}
              <TouchableOpacity
                className="p-2 w-[60%] rounded-full border-2  mt-5 border-[#00748D]"
                onPress={() => setTakingMedicinesList((prev) => [...prev, ""])}
              >
                <Text className="px-4 font-semibold text-center text-[#00748D] text-xl">
                  ADD MEDICINE
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default medicines;
