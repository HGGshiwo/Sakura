import { Component } from "react";
import { TextStyle } from "react-native";

interface ScrubberProps {
  value?: number;
  bufferedValue?: number;
  totalDuration?: number;
  onSlidingComplete: (value: number) => void;
  onSlidingStart?: () => any;
  onSlide?: (value: number) => any;
  tapNavigation?: boolean;
  trackBackgroundColor?: string;
  trackColor?: string;
  bufferedTrackColor?: string;
  scrubbedColor?: string;
  displayedValueStyle?: TextStyle;
  displayValues?: boolean;
}

declare class Scrubber extends Component<ScrubberProps, any> {}

export = Scrubber;