import React, { useRef } from "react";
import { View, Button, Text, Image, ScrollView } from "react-native";
import ViewShot from "react-native-view-shot";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy"; // <-- IMPORTANT

export default function MyScreen() {
  const viewRef = useRef<any | null>(null);

  const exportToPDF = async () => {
    try {
      // 1. Capture the view as an image
      const imageUri = await viewRef.current.capture();

      // 2. Convert image → base64 (LEGACY API)
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: "base64",
      });

      // 3. Use the Base64 image in HTML
      const html = `
        <html>
          <body style="margin:0;padding:0;">
            <img src="data:image/png;base64,${base64}" style="width:100%;height:auto;" />
          </body>
        </html>
      `;

      // 4. Generate PDF
      const { uri: pdfUri } = await Print.printToFileAsync({ html });

      // 5. Share PDF
      await Sharing.shareAsync(pdfUri);
    } catch (err) {
      console.log("PDF ERROR:", err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ViewShot
        ref={viewRef}
        options={{ format: "png", quality: 1.0 }}
        style={{ flex: 1 }}
      >
        {/* Your content */}
        <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
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
          <Image
            source={require("@/assets/images/select-region/front-face-01.png")}
            resizeMode="contain"
            className="w-[250px] h-[250px]"
          />
          <Image
            source={require("@/assets/images/select-region/front-face-01.png")}
            resizeMode="contain"
            className="w-[250px] h-[250px]"
          />
          <Image
            source={require("@/assets/images/select-region/front-face-01.png")}
            resizeMode="contain"
            className="w-[250px] h-[250px]"
          />
        </ScrollView>
      </ViewShot>

      <Button title="Export as PDF" onPress={exportToPDF} />
    </View>
  );
}
