import {StyleSheet} from 'react-native';
import Dimensions from 'Dimensions';

const windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  image: {
    height: 200,
    width: windowWidth
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth
  },
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }
});
