# `RNHostView` content snaps to its final size during an animated SwiftUI resize

When SwiftUI animates the size of a view that contains an `@expo/ui` `RNHostView`, the
hosted React Native content does not animate with it. It lays out at its **final** size at
the start of the animation, and only the outer frame animates. Images, wrapping text and
buttons visibly jump, then slide into place. The same content built in SwiftUI interpolates
smoothly, frame by frame.

It is most visible on the iPhone Duo, where `ArrangementView` animates its two sides at the
fold, but it reproduces on any simulator with an ordinary animated `frame`.

## Versions

| | |
|---|---|
| expo | 58.0.19 |
| @expo/ui | 58.0.23 |
| react-native | 0.88.0 |
| Xcode | 27.2 (27B48) |

## Run it

```sh
npm install
npx expo prebuild -p ios
cd ios && pod install && cd ..
npx expo run:ios
```

`package.json` builds `ExpoFileSystem` and `ExpoUI` from source
(`expo.autolinking.buildFromSource`). Without it, the stock template crashes at launch in
dyld: the precompiled `ExpoFileSystem.framework` references an `ExpoModulesCore`
`EventEmitter.eventRuntime` symbol the bundled `ExpoModulesCore` does not export. That is a
separate problem; `ExpoUI` is built from source so `RNHostView` compiles from the version
under test.

### Screen 1: Animated width (any iPhone or iPad simulator)

Two copies of the same card (the same photo, a title, body text and a full-width button), one
built in SwiftUI and one in React Native inside `RNHostView`, sit in
SwiftUI frames whose width animates between 200 and 360 points over 0.8s
(`animation(Animation.easeInOut({ duration: 0.8 }), wide)`). Tap **Make wide** / **Make narrow**.

- **Expected:** both cards resize smoothly.
- **Actual:** the SwiftUI card (top) interpolates. The React Native card in `RNHostView`
  (bottom) jumps to its final layout immediately (the photo, the text wrap and the button
  change size in one frame), and only its frame animates.

### Screen 2: ArrangementView (iPhone Duo, iOS 27.1+)

Tap **iPhone Duo: ArrangementView**. On the inner display in landscape, fold into book pose
and back to flat. The SwiftUI side resizes smoothly; the React Native side snaps to its
final size while the arrangement animates around it.

## Why

`RNHostView` reports its size to the React Native shadow node from
`onGeometryChange` (`ios/RNHostView.swift`, `ReportSizeToYogaNodeModifier`). During an
animated layout change SwiftUI reports only the destination geometry, once, so Yoga lays the
hosted tree out at its final size before the animation runs, and nothing reports the
intermediate sizes.
