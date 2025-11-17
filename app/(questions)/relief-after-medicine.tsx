import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useGlobal } from "@/store/useQuestions";
import DateTimePicker from "@react-native-community/datetimepicker";

const reliefAfterMedicine = () => {
  const { relievedMedicine, setRelievedMedicine } = useGlobal();
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
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
        className="flex flex-col justify-evenly"
      >
        <TouchableOpacity className="flex flex-row items-center justify-center">
          <Text>15 min Ago</Text>
          <Image
            source={require("@/assets/images/started-ended-screen/15 min Ago.png")}
            className="w-[120px] h-[120px]"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row items-center justify-center">
          <Text>30 min Ago</Text>
          <Image
            source={require("@/assets/images/started-ended-screen/30 min Ago.png")}
            className="w-[120px] h-[120px]"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row items-center justify-center">
          <Text>1 hour Ago</Text>
          <Image
            source={require("@/assets/images/started-ended-screen/1 hour Ago.png")}
            className="w-[120px] h-[120px]"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowDateTimePicker(true)}
          className="flex flex-row items-center justify-center"
        >
          <Text>Other Time</Text>
          <Image
            source={require("@/assets/images/started-ended-screen/Other Time.png")}
            className="w-[120px] h-[120px]"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {showDateTimePicker && (
        <DateTimePicker
          value={relievedMedicine || new Date()}
          mode={"time"}
          display={"spinner"}
          maximumDate={new Date(Date.now())}
          onChange={(_, e) => setRelievedMedicine(e)}
        />
      )}
    </View>
  );
};

export default reliefAfterMedicine;
