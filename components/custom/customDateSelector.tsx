import { View, Text, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "../ui/button";
import { format } from "date-fns";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface Props {
  showAlertDialog: boolean;
  handleClose: () => void;
  startDate: Date | undefined | number;
  endDate: Date | undefined;
  setStartDate: (startDate: Date | undefined | number) => void;
  setEndDate: (endDate: Date | undefined) => void;
}

const CustomDateSelector = ({
  showAlertDialog,
  handleClose,
  startDate,
  endDate,
  setEndDate,
  setStartDate,
}: Props) => {
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>();
  const [selectedEndDate, setSelectedEndDate] = useState<Date>();
  const [current, setCurrent] = useState("");
  const onDateChange = (e: DateTimePickerEvent, date: Date | undefined) => {
    if (current === "startDate") {
      setSelectedStartDate(date);
    } else {
      setSelectedEndDate(date);
    }
    setShowDateTimePicker(false);
  };

  const setDate = () => {
    selectedStartDate && setStartDate(selectedStartDate);
    selectedEndDate && setEndDate(selectedEndDate);
  };

  useEffect(() => {
    startDate instanceof Date && setSelectedStartDate(new Date(startDate!));
    endDate instanceof Date && setSelectedEndDate(new Date(endDate!));
  }, [startDate, endDate]);
  return (
    <View>
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader className="w-full  justify-center">
            <Text className="text-typography-950 font-semibold text-center">
              Select the start date and end date
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4 ">
            <View className="flex flex-row">
              <View className="w-1/2 items-center flex flex-col gap-2">
                <Text className="text-center text-sm">Start Date</Text>
                <TouchableOpacity
                  className="p-2 bg-[#00bfbf] rounded-lg"
                  onPress={() => {
                    setCurrent("startDate");
                    setShowDateTimePicker(true);
                  }}
                >
                  {selectedStartDate ? (
                    <Text className="text-white font-semibold">
                      {format(new Date(selectedStartDate), "do MMM yyyy")}
                    </Text>
                  ) : (
                    <Text className="text-white font-semibold">
                      {startDate ? format(startDate, "do MMM yyyy") : ""}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <View className="w-1/2 items-center flex flex-col gap-2">
                <Text className="text-center text-sm">End Date</Text>
                <TouchableOpacity
                  className="p-2 bg-[#00bfbf] rounded-lg"
                  onPress={() => {
                    setCurrent("endDate");
                    setShowDateTimePicker(true);
                  }}
                >
                  {selectedEndDate ? (
                    <Text className="text-white font-semibold">
                      {format(new Date(selectedEndDate), "do MMM yyyy")}
                    </Text>
                  ) : (
                    <Text className="text-white font-semibold">
                      {endDate ? format(endDate, "do MMM yyyy") : ""}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </AlertDialogBody>
          <AlertDialogFooter className="">
            <Button
              variant="outline"
              action="secondary"
              onPress={handleClose}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              size="sm"
              onPress={() => {
                setDate();
                handleClose();
              }}
            >
              <ButtonText>set</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {showDateTimePicker && (
        <DateTimePicker
          value={
            current === "startDate"
              ? startDate instanceof Date
                ? startDate
                : new Date()
              : endDate instanceof Date
              ? endDate
              : new Date()
          }
          maximumDate={
            current === "startDate"
              ? selectedEndDate
                ? new Date(selectedEndDate)
                : new Date(endDate!)
              : undefined
          }
          minimumDate={
            current === "endDate"
              ? selectedStartDate
                ? new Date(selectedStartDate)
                : new Date(startDate!)
              : undefined
          }
          mode={"date"}
          display={Platform.OS === "ios" ? "inline" : "calendar"}
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

export default CustomDateSelector;
