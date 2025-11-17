import React, { useState, useCallback } from "react";
import { View, LayoutChangeEvent, Text } from "react-native";
import Svg, { Image, Polygon, G } from "react-native-svg";
import { useGlobal } from "@/store/useQuestions";
import {
  frontSideRegions,
  backSideRegions,
} from "@/constants/regionCoordinates";
import { Region } from "@/constants/types";

export default function ResponsivePolygonHotspots() {
  const [imageSize, setImageSize] = useState({ width: 300, height: 300 }); // default nonzero
  const { region, setRegion } = useGlobal();

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    // Prevent 0-size rendering (causes blank SVG)
    if (width > 50 && height > 50) {
      setImageSize({ width: width - 50, height: height - 50 });
    }
  }, []);

  const handleSelectedRegions = useCallback(
    (name: Region) => {
      setRegion((prev) =>
        prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
      );
    },
    [setRegion]
  );

  const getScaledPoints = useCallback(
    (points: { x: number; y: number }[]) =>
      points
        .map((p) => `${p.x * imageSize.width},${p.y * imageSize.height}`)
        .join(" "),
    [imageSize]
  );

  const renderOverlays = (regionsList: typeof frontSideRegions) =>
    regionsList
      .filter((r) => region.includes(r.title as Region))
      .map((r) => (
        <Image
          key={r.id}
          href={r.overlay}
          width={imageSize.width}
          height={imageSize.height}
          preserveAspectRatio="xMidYMid slice"
        />
      ));

  return (
    <View style={{ marginBottom: 85 }} className="flex">
      {/* FRONT */}
      <View
        className="flex items-center justify-center w-full aspect-square -mt-10 -mb-16"
        onLayout={handleLayout}
      >
        <Svg
          width="70%"
          height="70%"
          viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
        >
          {/* Base image */}
          <Image
            href={require("@/assets/images/select-region/front-face-01.png")}
            width={imageSize.width}
            height={imageSize.height}
            preserveAspectRatio="xMidYMid slice"
          />

          {/* Active overlays */}
          <G>{renderOverlays(frontSideRegions)}</G>

          {/* Invisible hit zones */}
          {frontSideRegions.map((r) => (
            <Polygon
              key={r.id}
              points={getScaledPoints(r.points)}
              fill="transparent"
              onPress={() => handleSelectedRegions(r.title as Region)}
            />
          ))}

          <Text className="absolute top-40  right-0 text-[#00748D] font-semibold text-2xl">
            Right
          </Text>
          <Text className="absolute top-40 -left-1 text-[#00748D] font-semibold text-2xl">
            Left
          </Text>
        </Svg>
      </View>

      {/* BACK */}
      <View
        className="flex items-center justify-center w-full aspect-square"
        onLayout={handleLayout}
      >
        <Svg
          width="70%"
          height="70%"
          viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
        >
          {/* Base image */}
          <Image
            href={require("@/assets/images/select-region/back-side.png")}
            width={imageSize.width}
            height={imageSize.height}
            preserveAspectRatio="xMidYMid slice"
          />

          {/* Active overlays */}
          <G>{renderOverlays(backSideRegions)}</G>

          {/* Invisible hit zones */}
          {backSideRegions.map((r) => (
            <Polygon
              key={r.id}
              points={getScaledPoints(r.points)}
              fill="transparent"
              onPress={() => handleSelectedRegions(r.title as Region)}
            />
          ))}

          <Text className="absolute top-40 right-0 text-[#00748D] font-semibold text-2xl">
            Right
          </Text>
          <Text className="absolute top-40 -left-1 text-[#00748D] font-semibold text-2xl">
            Left
          </Text>
        </Svg>
      </View>
    </View>
  );
}
