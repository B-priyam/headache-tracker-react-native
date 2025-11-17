import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { BarChart, PieChart } from "react-native-gifted-charts";
import ReportLabel from "./ReportLabel";
import Svg, { Circle } from "react-native-svg";
import { Asset } from "expo-asset";
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
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";

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
  const regionFrontRef = useRef<any | null>(null);
  const regionBackRef = useRef<any | null>(null);
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
                  tooltipText: "Mild Pain",
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

  // Testing arae

  async function prepareImages(assetRequiresMap: any) {
    const results: any = {};
    for (const key of Object.keys(assetRequiresMap)) {
      try {
        const mod = assetRequiresMap[key];
        const asset = Asset.fromModule(mod);
        // ensure asset is downloaded and localUri available
        await asset.downloadAsync();
        const uri = asset.localUri || asset.uri;
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // guess png/jpg by extension - adjust if you have svg
        const ext = uri.split(".").pop()!.toLowerCase();
        const mime =
          ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
        results[key] = `data:${mime};base64,${base64}`;
      } catch (e) {
        console.warn("prepareImages failed for", key, e);
        results[key] = ""; // fallback blank
      }
    }
    return results;
  }
  function generateReportHtml(options: any) {
    const {
      triggers = [],
      sensations = [],
      symptoms = [],
      relievers = [],
      allSeverity = [],
      averageDuration = "00H : 00M",
      startDate,
      endDate,
      createdAt,
      email,

      iconFrequencyDataUri,
      iconAvgDurationDataUri,
      iconTriggersDataUri,
      iconSensationsDataUri,
      iconSymptomsDataUri,
      iconRelieversDataUri,
      iconSeverityDataUri,
      iconRegionDataUri,
      frontRegionImg,
      backRegionImg,
    } = options;

    const fmt = (d: any) => {
      try {
        const dt = new Date(d);
        return `${String(dt.getDate()).padStart(2, "0")}-${String(
          dt.getMonth() + 1
        ).padStart(2, "0")}-${dt.getFullYear()}`;
      } catch {
        return "";
      }
    };

    const makeVerticalBarSVG = (dataArray: any, width = 360, height = 220) => {
      const items = dataArray || [];
      const maxVal = Math.max(...items.map((i: any) => i.value || 0), 1);
      const padding = 16;
      const gap = 20;
      const barWidth = 70;
      const totalWidth = items.length * (barWidth + gap) - gap + padding * 2;
      const svgW = Math.max(totalWidth, width);
      const svgH = height;

      const labelMaxWidth = 60;
      let rects = "";
      items.forEach((it: any, idx: any) => {
        const x = padding + idx * (barWidth + gap);
        const value = it.value || 0;
        const barHeight = Math.round((value / maxVal) * (svgH - 40)); // leave for labels
        const y = svgH - barHeight - 30;
        const color = it.frontColor || "#00bfbf";
        rects += `
        <g>
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" ry="6" fill="${color}"></rect>
          <text x="${x + barWidth / 2}" y="${y - 6}"
          font-size="12"
          text-anchor="middle"
          fill="#111">${value}</text>

        <!-- WRAPPED LABEL BELOW BAR -->
        <foreignObject x="${x}" y="${
          svgH - 28
        }" width="${labelMaxWidth}" height="28">
          <div xmlns="http://www.w3.org/1999/xhtml"
            style="font-size:12px; color:#111; text-align:center; width:${labelMaxWidth}px;
            word-wrap:break-word; overflow:hidden;">
            ${escapeHtml(it.label)}
          </div>
        </foreignObject>
        </g>
      `;
      });

      return `<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
    };

    const makeFrequencySVG = (freq: any, totalDays: any) => {
      const size = 200;
      const strokeWidth = 18;
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      const progress = totalDays > 0 ? Math.round((freq / totalDays) * 100) : 0;
      const offset = circumference - (progress / 100) * circumference;
      return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size / 2}" cy="${
        size / 2
      }" r="${radius}" stroke="#e5e7eb" stroke-width="${strokeWidth}" fill="none" />
        <circle cx="${size / 2}" cy="${
        size / 2
      }" r="${radius}" stroke="#00bfbf" stroke-width="${strokeWidth}" fill="none"
          stroke-dasharray="${circumference} ${circumference}"
          stroke-dashoffset="${offset}"
          stroke-linecap="round"
          transform="rotate(-90 ${size / 2} ${size / 2})"
        />
        <text x="50%" y="50%" font-size="30" text-anchor="middle" dominant-baseline="middle" fill="#111" font-weight="700">
          ${freq} / ${totalDays}
        </text>
      </svg>
    `;
    };

    const makePieSVG = (items: any, diameter = 260) => {
      const cx = diameter / 2;
      const cy = diameter / 2;
      const r = diameter / 2;
      const total =
        items.reduce((s: any, it: any) => s + (it.value || 0), 0) || 1;
      let currentAngle = -90;
      let slices = "";
      items.forEach((it: any, idx: any) => {
        const value = it.value || 0;
        const portion = value / total;
        const angle = portion * 360;
        const large = angle > 180 ? 1 : 0;
        const start = polarToCartesian(cx, cy, r, currentAngle);
        const end = polarToCartesian(cx, cy, r, currentAngle + angle);
        const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} z`;
        slices += `<path d="${d}" fill="${
          it.color || "#C0C0C0"
        }" stroke="#fff" stroke-width="1"></path>`;
        currentAngle += angle;
      });
      return `<svg width="${diameter}" height="${diameter}" viewBox="0 0 ${diameter} ${diameter}" xmlns="http://www.w3.org/2000/svg">
      ${slices}
    </svg>`;
    };

    function escapeHtml(str: any) {
      if (str == null) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function polarToCartesian(cx: any, cy: any, r: any, angleDeg: any) {
      const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
      return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad),
      };
    }

    const triggersSVG = makeVerticalBarSVG(triggers, 420, 220);
    const sensationsSVG = makeVerticalBarSVG(sensations, 420, 220);
    const symptomsSVG = makeVerticalBarSVG(symptoms, 420, 220);
    const relieversSVG = makeVerticalBarSVG(relievers, 420, 220);

    const frequencySVG = makeFrequencySVG(frequency, totalDays);
    const pieSVG = makePieSVG(allSeverity, 260);

    // Build the full HTML
    const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <style>
      /* Reset + simple layout to match your RN UI stacking */
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; margin:0; padding:16px; color:#111; background:#fff; }
      .section { margin-bottom: 22px; }
      .section-header { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
      .section-header img { width:22px; height:22px; object-fit:contain; }
      .section-title { font-size:22px; font-weight:700; color:#111; text-align:center ; width:100% }
      .subtext { font-size:12px; color:#444; margin-top:4px; }
      .center { display:flex; justify-content:center; align-items:center; }
      .row { display:flex; flex-direction:row; gap:12px; align-items:center; }
      .column { display:flex; flex-direction:column; gap:8px; }
      .boxed { background:#fff; padding:12px; border-radius:8px; box-shadow: 0 0 0 rgba(0,0,0,0); }
      /* ensure svg blocks behave like your RN sizes */
      svg { display:block; }
      .legend { font-size:12px; }
      .chart-wrap { padding: 8px 0; max-width: 10px; text-wrap:wrap }
      .region-wrap { display:flex; gap:16px; align-items:center; justify-content:center; margin-top:10px; }
    </style>
    <title>hello</title>
  </head>
  <body>
    <!-- Header -->
    <div class="section">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="font-weight:700; font-size:20px;">Report</div>
        <div style="text-align:right; font-size:12px;">
          <div>${escapeHtml(email || "")}</div>
          <div style="color:#666;">Generated: ${fmt(new Date())}</div>
        </div>
      </div>

      <div style="margin-top:8px; font-size:12px; color:#666;">
        ${
          startDate && endDate
            ? `FROM ${fmt(startDate)} TO ${fmt(endDate)}`
            : "ALL TIME DATA"
        }
      </div>
    </div>

    <!-- Frequency (SVG circle) -->
    <div class="section boxed center">
      <div style="display:flex; flex-direction:column; align-items:center;">
        <div class="section-header">
          <!-- <img src="${iconFrequencyDataUri || ""}" alt="freq"/> -->
          <div class="section-title">Frequency</div>
        </div>

        <div style="width:220px; height:220px; margin-top:35px"" >
          ${frequencySVG}
        </div>
      </div>
    </div>
    <hr  />

    <!-- Average Duration -->
    <div class="section boxed" style="margin-top:50px padding-top:20px">
      <div class="section-header">
        <div class="section-title">Average Duration</div>
      </div>
      <div style="font-size:28px; text-align:center; padding:12px 0; font-weight:600; margin-top:40px">${escapeHtml(
        averageDuration || "0H : 0M"
      )}</div>
    </div>
    <hr />

    <!-- Triggers (vertical bar SVG) -->
    <div class="section boxed" style="margin-top:50px">
      <div class="section-header">
        <div class="section-title">Triggers</div>
      </div>
      <div
  class="chart-wrap"
  style="
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;
    align-items: flex-end;
    max-width: 100%;
  "
>
  ${triggersSVG}
</div>
    </div>
    <hr />

    <!-- Sensations -->
    <div class="section boxed" style="margin-top:150px ; padding-top:50px">
      <div class="section-header">
        <div class="section-title">Sensations</div>
      </div>
      <div class="chart-wrap"  style="
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;
    align-items: flex-end;
    max-width: 100%;
  ">
        ${sensationsSVG}
      </div>
    </div>
    <hr />

    <!-- Symptoms -->
    <div class="section boxed">
      <div class="section-header">
        <div class="section-title">Symptoms</div>
      </div>
      <div class="chart-wrap"  style="
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;
    align-items: flex-end;
    max-width: 100%;
  ">
        ${symptomsSVG}
      </div>
    </div>
    <hr />

    <!-- Relievers -->
    <div class="section boxed">
      <div class="section-header">
        <div class="section-title">Relievers</div>
      </div>
      <div class="chart-wrap"  style="
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;
    align-items: flex-end;
    max-width: 100%;
  ">
        ${relieversSVG}
      </div>
    </div>
    <hr />

    <!-- Severity (Pie) -->
    <div class="section boxed" style="margin-top:200px; padding-top:50px">
      <div class="section-header">
        <div class="section-title">Severity</div>
      </div>
      <div style="display:flex; align-items:center; gap:18px; justify-content:center; margin-top:150px padding-top:50px">
        <div>${pieSVG}</div>
        <div class="column" style="font-size:13px;">
          ${(allSeverity || [])
            .map(
              (it: any) => `
            <div style="display:flex; align-items:center; gap:8px;">
              <div style="width:14px; height:12px; background:${
                it.color || "#C0C0C0"
              };"></div>
              <div style="font-weight:600;">${escapeHtml(
                it.tooltipText || it.text || ""
              )}</div>
              <div style="color:#666; margin-left:8px;">${it.value || 0}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
    <hr />

    <!-- Region (front + back with overlays) -->
    <div class="section boxed">
  <div class="section-header">
    <div class="section-title">Region</div>
  </div>

  <div style="display:flex; gap:20px; margin-top:20px; justify-content:center;">
    <img src="${frontRegionImg}" style="width:250px; height:250px;" />
    <img src="${backRegionImg}" style="width:250px; height:250px;" />
  </div>
</div>
<hr />

    <!-- Footer small metadata -->
    <div style="font-size:11px; color:#666; margin-top:10px;">
      <div>Created at: ${fmt(createdAt || new Date())}</div>
      <div>Report exported by: ${escapeHtml(email || "")}</div>
    </div>

  </body>
  </html>
  `;

    // return HTML string
    return html;
  }

  // inside your component
  const assetMap = {
    frequencyIcon: require("@/assets/icons/Reports icons/Frequency.png"),
    avgDurationIcon: require("@/assets/icons/Reports icons/Average Duration.png"),
    triggersIcon: require("@/assets/icons/Reports icons/Triggers.png"),
    sensationsIcon: require("@/assets/icons/Reports icons/Sensations.png"),
    symptomsIcon: require("@/assets/icons/Reports icons/Symptoms.png"),
    relieversIcon: require("@/assets/icons/Reports icons/Relievers.png"),
    severityIcon: require("@/assets/icons/Reports icons/Severity.png"),
    regionIcon: require("@/assets/icons/Reports icons/Region.png"),
    frontFace: require("@/assets/images/select-region/front-face-01.png"),
    backFace: require("@/assets/images/select-region/back-side.png"),
  };

  // call in your exportToPDF
  const exportToPDF = async () => {
    try {
      const frontSnap = await regionFrontRef.current.capture();
      const backSnap = await regionBackRef.current.capture();

      const frontB64 = await FileSystem.readAsStringAsync(frontSnap, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const backB64 = await FileSystem.readAsStringAsync(backSnap, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const frontRegionImg = `data:image/png;base64,${frontB64}`;
      const backRegionImg = `data:image/png;base64,${backB64}`;
      const vars = {
        createdAt,
        email,
        startDate,
        endDate,
        frequency,
        totalDays,
        averageDuration,
        triggers,
        sensations,
        symptoms,
        relievers,
        allSeverity,
        frontRegion,
        backRegion,
        frontRegionImg,
        backRegionImg,
      };

      // 3. Create HTML
      const html = generateReportHtml(vars);

      // 4. Create PDF
      const temp = await Print.printToFileAsync({ html });

      // 5. Rename file
      const fileName = `Migraine_Report_${Date.now()}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      const downloadPath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.moveAsync({
        from: temp.uri,
        to: fileUri,
      });

      // 6. Share
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/pdf",
        dialogTitle: "Share Your Report",
      });

      // 7. Optional: Save to Android downloads
      // if (Platform.OS === "android") {
      //   const { status } = await MediaLibrary.requestPermissionsAsync();
      //   if (status !== "granted") {
      //     alert("Permission needed to save PDF");
      //     return;
      //   }
      //   if (status) {
      //     const asset = await MediaLibrary.createAssetAsync(fileUri);
      //     await MediaLibrary.createAlbumAsync("Download", asset, false);
      //   }
      //   await MediaLibrary.saveToLibraryAsync(downloadPath);
      // }
    } catch (err) {
      console.error("PDF ERROR:", err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView className="flex">
        <ReportLabel
          text="Region"
          img={require("@/assets/icons/Reports icons/Region.png")}
        />
        <View className="items-center">
          <ViewShot
            ref={regionFrontRef}
            options={{ format: "png", quality: 1 }}
          >
            <View>
              <Image
                source={require("@/assets/images/select-region/front-face-01.png")}
                resizeMode="contain"
                className="w-[250px] h-[250px]"
              />
              {frontSideRegions
                .filter((d) =>
                  frontRegion.some((r: any) => r.label === d.title)
                )
                .map((d) => (
                  <Image
                    key={d.id}
                    source={d.overlay}
                    className="w-[250px] h-[250px] absolute"
                    resizeMode="contain"
                  />
                ))}
            </View>
          </ViewShot>
          <ViewShot ref={regionBackRef} options={{ format: "png", quality: 1 }}>
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
          </ViewShot>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={exportToPDF}
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
