import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { BarChart, PieChart } from "react-native-gifted-charts";
import ReportLabel from "./ReportLabel";
import Svg, { Circle } from "react-native-svg";
import {
  format,
  differenceInDays,
  isBefore,
  isAfter,
  isSameDay,
  differenceInMinutes,
  startOfDay,
} from "date-fns";
import CustomDateSelector from "./customDateSelector";
import { useUserStore } from "@/store/userStore";
import {
  backSideRegions,
  frontSideRegions,
} from "@/constants/regionCoordinates";
import ViewShot from "react-native-view-shot";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystemLegacy from "expo-file-system/legacy";
import MyScreen from "./ExportToPdf";

const Report = (data: any) => {
  const { createdAt, email } = useUserStore();
  const [triggers, setTriggers] = useState<any>([]);
  const [sensations, setSensations] = useState<any>([]);
  const [symptoms, setSymptoms] = useState<any>([]);
  const [relievers, setRelievers] = useState<any>([]);
  const [frequency, setFrequency] = useState<number>(0);
  const [averageDuration, setAverageDuration] = useState("");
  const [startDate, setStartDate] = useState<Date | number | undefined>(
    new Date().setDate(1)
  );
  // console.log(startDate instanceof Date);
  // console.log(format(startDate, "do MMM yyyy"));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [allSeverity, setAllSeverity] = useState<any>([
    {
      value: 0,
    },
  ]);
  const [frontRegion, setFrontRegion] = useState([
    {
      label: "",
      value: 0,
    },
  ]);
  const [backRegion, setBackRegion] = useState([
    {
      label: "",
      value: 0,
    },
  ]);

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const handleClose = () => setShowAlertDialog(false);

  // console.log(differenceInDays(endDate, startDate));

  function addOrIncrement(data: any) {
    const counts: any = [];
    for (const entry of data) {
      // split comma-separated string into individual items
      const triggers = entry.split(",").map((t: any) => t.trim());

      for (const trigger of triggers) {
        const existing = counts.find((item: any) => item.label === trigger);

        if (existing) {
          existing.value += 1;
        } else {
          counts.push({ label: trigger, value: 1 });
        }
      }
    }
    return counts;
  }

  useEffect(() => {
    if (data.data.data) {
      let searchableData =
        startDate &&
        endDate &&
        data.data.data
          .map((d: any) =>
            isSameDay(new Date(d.timestamp), startDate) ||
            (isAfter(new Date(d.timestamp), startDate) &&
              isBefore(new Date(d.timestamp), endDate))
              ? d
              : null
          )
          .filter((d: any) => d !== null);
      const triggers = searchableData
        .map((d: any) => d.triggers)
        .map((t: any) => t.join(","));
      const severity = searchableData.map((d: any) => d.severity);
      const sensations = searchableData
        .map((d: any) => d.sensations)
        .map((t: any) => t.join(","));
      const symptoms = searchableData
        .map((d: any) => d.symptoms)
        .map((t: any) => t.join(","));
      const regions = searchableData
        .map((d: any) => d.region)
        .map((t: any) => t.join(","));
      const relievers = searchableData
        .map((d: any) => d.relievers)
        .map((t: any) => t.join(","));
      const toptriggers = addOrIncrement(triggers);
      const topsensations = addOrIncrement(sensations);
      const topsymptoms = addOrIncrement(symptoms);
      const severities = addOrIncrement(severity);
      const topRegions = addOrIncrement(regions);
      const topRelievers = addOrIncrement(relievers);
      setTriggers(
        toptriggers
          .sort((a: any, b: any) => b.value - a.value)
          .map((d: any, index: any) =>
            index === 0
              ? { ...d, text: d.label, frontColor: "#027082" }
              : index === 1
              ? { ...d, text: d.label, frontColor: "#0296af" }
              : { ...d, text: d.label, frontColor: "#00bfbf" }
          )
      );
      setSensations(
        topsensations
          .sort((a: any, b: any) => b.value - a.value)
          .map((d: any, index: any) =>
            index === 0
              ? { ...d, text: d.label, frontColor: "#027082" }
              : index === 1
              ? { ...d, text: d.label, frontColor: "#0296af" }
              : { ...d, text: d.label, frontColor: "#00bfbf" }
          )
      );
      setSymptoms(
        topsymptoms
          .sort((a: any, b: any) => b.value - a.value)
          .map((d: any, index: any) =>
            index === 0
              ? { ...d, text: d.label, frontColor: "#027082" }
              : index === 1
              ? { ...d, text: d.label, frontColor: "#0296af" }
              : { ...d, text: d.label, frontColor: "#00bfbf" }
          )
      );
      setRelievers(
        topRelievers
          .sort((a: any, b: any) => b.value - a.value)
          .map((d: any, index: any) =>
            index === 0
              ? { ...d, text: d.label, frontColor: "#027082" }
              : index === 1
              ? { ...d, text: d.label, frontColor: "#0296af" }
              : { ...d, text: d.label, frontColor: "#00bfbf" }
          )
      );
      const frontRegions = topRegions
        .sort((a: any, b: any) => b.value - a.value)
        .filter((d: any) => d.label.split("-")[0] == "front");
      const backRegions = topRegions
        .sort((a: any, b: any) => b.value - a.value)
        .filter((d: any) => d.label.split("-")[0] == "back");

      setFrontRegion(
        frontRegions.filter((x: any) => x.value === frontRegions[0].value)
      );
      setBackRegion(
        backRegions.filter((x: any) => x.value === backRegions[0].value)
      );

      setAllSeverity(
        severities
          .sort((a: any, b: any) => b.value - a.value)
          .map((d: any, index: any) =>
            index === 0
              ? {
                  ...d,
                  tooltipText: "Severe Pain",
                  color: "#FF9700",
                  text: d.value,
                }
              : index === 1
              ? {
                  ...d,
                  tooltipText: "Very Severe Pain",
                  color: "#EB3A2A",
                  text: d.value,
                }
              : index === 2
              ? {
                  ...d,
                  tooltipText: "Moderate Pain",
                  color: "#FDD154",
                  text: d.value,
                }
              : index === 3
              ? {
                  ...d,
                  tooltipText: "Worst Possible Pain",
                  color: "#A91919",
                  text: d.value,
                }
              : {
                  ...d,
                  labtooltipTextel: "Mild Pain",
                  color: "#4FC854",
                  text: d.value,
                }
          )
      );

      setFrequency(
        new Set(searchableData.map((d: any) => d.timestamp.split("T")[0])).size
      );

      let totalAttacks = searchableData.map((d: any) => ({
        startTime: d.startTime,
        endTime: d.endTime,
      }));

      const totalDuration = totalAttacks.reduce((acc: number, attack: any) => {
        const start = new Date(attack.startTime);
        const end = new Date(attack.endTime);
        return acc + differenceInMinutes(end, start);
      }, 0);
      const averageMinutes = totalDuration / totalAttacks.length;

      // Convert to hours and minutes
      const hours = Math.floor(averageMinutes / 60);
      const minutes = Math.round(averageMinutes % 60);

      setAverageDuration(
        `${String(hours ? hours : 0).padStart(2, "0")}H : ${String(
          minutes ? minutes : 0
        ).padStart(2, "0")}M`
      );
    }
  }, [data, startDate, endDate]);

  let size = 200;
  let strokeWidth = 18;
  let totalDays = differenceInDays(
    startOfDay(endDate ?? new Date()),
    startOfDay(startDate ?? new Date(createdAt!))
  );

  let progress = Math.round((frequency / totalDays) * 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <View>
      <ScrollView className="flex">
        <View className="w-full flex flex-row">
          <TouchableOpacity
            className="w-1/4 bg-[#00bfbf] py-3"
            onPress={() => setStartDate(new Date(createdAt!))}
          >
            <Text className="text-center text-white">All</Text>
          </TouchableOpacity>
          <View className="h-full bg-white w-[2px] border-white" />
          <TouchableOpacity
            className="w-1/4 bg-[#00bfbf] py-3"
            onPress={() => {
              setStartDate(new Date().setDate(new Date().getDate() - 15));
              setEndDate(new Date());
            }}
          >
            <Text className="text-center text-white">Last 15 Days</Text>
          </TouchableOpacity>
          <View className="h-full bg-white w-[2px] border-white" />
          <TouchableOpacity
            className="w-1/4 bg-[#00bfbf] py-3"
            onPress={() => {
              setStartDate(new Date().setDate(new Date().getDate() - 30));
              setEndDate(new Date());
            }}
          >
            <Text className="text-center text-white">Last 30 Days</Text>
          </TouchableOpacity>
          <View className="h-full bg-white w-[2px] border-white" />
          <TouchableOpacity
            className="w-1/4 bg-[#00bfbf] py-3"
            onPress={() => setShowAlertDialog(true)}
          >
            <Text className="text-center text-white">Custom</Text>
            <CustomDateSelector
              handleClose={handleClose}
              showAlertDialog={showAlertDialog}
              startDate={startDate}
              endDate={endDate}
              setEndDate={setEndDate}
              setStartDate={setStartDate}
            />
          </TouchableOpacity>
        </View>
        <View className="bg-[#00bfbf] mt-1 py-1">
          {startDate && endDate ? (
            <Text className="text-center text-white">{`FROM  ${format(
              startDate,
              "dd-MM-yyyy"
            )} TO  ${format(endDate, "dd-MM-yyyy")}`}</Text>
          ) : (
            <Text className="text-center text-white">ALL TIME DATA</Text>
          )}
        </View>
        <ReportLabel
          text="Frequency"
          img={require("@/assets/icons/Reports icons/Frequency.png")}
        />
        <View
          className="items-center justify-center self-center my-10"
          style={{ width: size, height: size }}
        >
          <Svg width={size} height={size}>
            <Circle
              stroke="#e5e7eb"
              fill="none"
              strokeWidth={strokeWidth}
              cx={size / 2}
              cy={size / 2}
              r={radius}
            />

            <Circle
              stroke="#00bfbf"
              fill="none"
              strokeWidth={strokeWidth}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>

          {/* Text value */}
          <View className="absolute items-center justify-center">
            <Text className="text-4xl font-bold text-gray-900">{`${frequency} / ${totalDays}`}</Text>
          </View>
        </View>

        <ReportLabel
          text="Average Duration"
          img={require("@/assets/icons/Reports icons/Average Duration.png")}
        />
        <Text className="text-center text-4xl py-5 font-semibold">
          {averageDuration ? averageDuration : "0H : 0M"}
        </Text>
        <ReportLabel
          text="Triggers"
          img={require("@/assets/icons/Reports icons/Triggers.png")}
        />
        <View className="mt-10">
          <BarChart
            isAnimated
            barWidth={70}
            noOfSections={10}
            frontColor="#00bfbf"
            data={triggers.slice(0, 3) as any}
            xAxisTextNumberOfLines={2}
            autoCenterTooltip
            renderTooltip={(item: any, index: number) => {
              return (
                <View
                  style={{
                    position: "absolute",
                    top: -30,
                    marginBottom: 5,
                    backgroundColor: "#00748d",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 4,
                    alignSelf: "center",
                  }}
                >
                  <Text className="text-white font-semibold">{item.value}</Text>
                </View>
              );
            }}
          />
        </View>
        <ReportLabel
          text="Sensations"
          img={require("@/assets/icons/Reports icons/Sensations.png")}
        />
        <View className="mt-10">
          <BarChart
            isAnimated
            barWidth={70}
            noOfSections={10}
            frontColor="#00bfbf"
            data={sensations.slice(0, 3) as any}
            xAxisTextNumberOfLines={2}
            autoCenterTooltip
            renderTooltip={(item: any, index: number) => {
              return (
                <View
                  style={{
                    position: "absolute",
                    top: -30,
                    marginBottom: 20,
                    backgroundColor: "#00748d",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 4,
                    alignSelf: "center",
                  }}
                >
                  <Text className="text-white font-semibold">{item.value}</Text>
                </View>
              );
            }}
          />
        </View>
        <ReportLabel
          text="Symptoms"
          img={require("@/assets/icons/Reports icons/Symptoms.png")}
        />
        <View className="mt-10">
          <BarChart
            isAnimated
            barWidth={70}
            trimYAxisAtTop
            noOfSections={10}
            frontColor="#00bfbf"
            autoCenterTooltip
            data={symptoms.slice(0, 3) as any}
            xAxisTextNumberOfLines={2}
            renderTooltip={(item: any, index: number) => {
              return (
                <View
                  style={{
                    position: "absolute",
                    top: -30,
                    marginBottom: 5,
                    backgroundColor: "#00748d",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 4,
                    alignSelf: "center",
                  }}
                >
                  <Text className="text-white font-semibold">{item.value}</Text>
                </View>
              );
            }}
          />
        </View>
        <ReportLabel
          text="Relievers"
          img={require("@/assets/icons/Reports icons/Relievers.png")}
        />
        <View className="mt-10">
          <BarChart
            isAnimated
            barWidth={70}
            trimYAxisAtTop
            noOfSections={10}
            frontColor="#00bfbf"
            autoCenterTooltip
            data={relievers.slice(0, 3) as any}
            xAxisTextNumberOfLines={2}
            renderTooltip={(item: any, index: number) => {
              return (
                <View
                  style={{
                    position: "absolute",
                    top: -30,
                    marginBottom: 5,
                    backgroundColor: "#00748d",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 4,
                    alignSelf: "center",
                  }}
                >
                  <Text className="text-white font-semibold">{item.value}</Text>
                </View>
              );
            }}
          />
        </View>
        <ReportLabel
          text="Severity"
          img={require("@/assets/icons/Reports icons/Severity.png")}
        />
        <View className="self-end pr-2">
          <View className="flex flex-row items-center gap-2">
            <View className="bg-[#4FC854] w-6 h-4" />
            <Text>Mild Pain</Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <View className="bg-[#FDD154] w-6 h-4" />
            <Text>Moderate Pain</Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <View className="bg-[#FF9700] w-6 h-4" />
            <Text>Severe Pain</Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <View className="bg-[#EB3A2A] w-6 h-4" />
            <Text>Very Severe Pain</Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <View className="bg-[#A91919] w-6 h-4" />
            <Text>Worst Possible Pain</Text>
          </View>
        </View>
        <View className="py-10 flex items-center">
          <PieChart
            data={
              allSeverity.length > 0
                ? allSeverity
                : [
                    {
                      value: 0,
                      color: "#C0C0C0",
                      text: "No Data",
                      tooltipText: "No Data Available",
                    },
                  ]
            }
            isAnimated
            showTooltip
            textBackgroundColor="black"
            textColor="white"
            focusOnPress
            radius={130}
            // showTextBackground
            // textBackgroundRadius={15}
            textSize={20}
            tooltipBackgroundColor={"black"}
            showValuesAsTooltipText={false}
          />
        </View>
        <ReportLabel
          text="Region"
          img={require("@/assets/icons/Reports icons/Region.png")}
        />
        <View className="items-center">
          <View>
            <Image
              source={require("@/assets/images/select-region/front-face-01.png")}
              resizeMode="contain"
              className="w-[250px] h-[250px]"
            />
            {frontSideRegions
              .filter((d) => frontRegion.some((r: any) => r.label === d.title))
              .map((d) => (
                <Image
                  key={d.id}
                  source={d.overlay}
                  className="w-[250px] h-[250px] absolute"
                  resizeMode="contain"
                />
              ))}
          </View>
          <View>
            <Image
              source={require("@/assets/images/select-region/back-side.png")}
              resizeMode="contain"
              className="w-[250px] h-[250px]"
            />
            {backSideRegions
              .filter((d) => backRegion.some((r: any) => r.label === d.title))
              .map((d) => (
                <Image
                  key={d.id}
                  source={d.overlay}
                  className="w-[250px] h-[250px] absolute"
                  resizeMode="contain"
                />
              ))}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#007AFF",
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 25,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          Export PDF
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Report;
