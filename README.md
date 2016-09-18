## Image carousel component for react-native
Based on https://github.com/nick/react-native-carousel .

### Installation
```bash
npm install https://github.com/ibc-corporate-travel/react-native-image-carousel
```

###Properties
#### Props were changed, actual readme coming soon.

```
hideIndicators={false} // Set to true to hide the indicators
indicatorStyle={color: '#000000', fontSize: 50} // Active indicator style
inactiveIndicatorStyle={color: '#999999', fontSize: 50} // Inactive indicator style
indicatorSpace={15} // space between each indicator
indicatorAtBottom={true} // Set to false to show the indicators at the top
indicatorOffset={250} // Indicator relative position from top or bottom
onPageChange={callback} // Called when the active page changes
inactiveIndicatorText= '•' // Inactive indicator content ( You can customize to use any Unicode character )
indicatorText= '•' // Active indicator content ( You can customize to use any Unicode character )
indicatorsPadding=3 // Amount of padding indicators on left and right sides;

animate={true} // Enable carousel autoplay
delay={1000} // Set Animation delay between slides
loop={true} // Allow infinite looped animation. Depends on Prop {...animate} set to true.

leftArr={'〈'}, // Left arr char. Can be text or React.Component.
rightArr={'〉'}, // Right arr char. Can be text or React.Component.
arrStyle={color: '#000000', fontSize: 30} // Styles for text(unicode?) arrows. It be applied only to text arrows!
arrowsTopOffset={50} // Arrows position from top

```
