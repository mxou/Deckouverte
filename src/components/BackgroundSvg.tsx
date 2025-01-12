import React from "react";
import { Svg, Rect, Defs, RadialGradient, Stop } from "react-native-svg";

type DynamicSVGProps = {
  fillColor: string; // Prop pour la couleur dynamique
};

const BackgroundSvg = ({ fillColor }: DynamicSVGProps) => (
  <Svg viewBox="0 0 1000 1000">
    <Rect fill="#7629DD" width="1000" height="1000" />
    <Defs>
      <RadialGradient id="a" cx="500" cy="500" r="100%" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#7629DD" />
        <Stop offset="1" stopColor="#A943D6" />
      </RadialGradient>
    </Defs>
    <Rect fill="url(#a)" width="1000" height="1000" />
    <Rect fill={fillColor} width="200" height="200" x="400" y="400" />
  </Svg>
);

export default BackgroundSvg;
