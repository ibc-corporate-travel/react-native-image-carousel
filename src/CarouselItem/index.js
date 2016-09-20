import React, {Component} from 'react';
import {TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import styles from './styles';

export default class CarouselItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isImageLoaded: false
    };
  }

  render() {
    const {uri, onPress} = this.props;
    const {isImageLoaded} = this.state;

    return (
      <TouchableOpacity style={styles.imageContainer} onPress={onPress}>
        <ActivityIndicator
          animating = {!isImageLoaded}
          style     = {styles.spinner}
        />
        <Image
          onLoadEnd   = {() => this.setState({isImageLoaded: true})}
          source      = {{uri}}
          style       = {styles.image}
          resizeMode  = "cover"
        />
      </TouchableOpacity>
    );
  }
};
