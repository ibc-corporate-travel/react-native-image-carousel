import React, {Component} from 'react';
import {ListView, TouchableOpacity, Image, ActivityIndicator, StyleSheet} from 'react-native';
import Dimensions from 'Dimensions';


const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: windowWidth
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth
  }
});

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class ImageCell extends Component {
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
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
          }}
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

var CarouselPager = React.createClass({

  scrollToPage(page, animated) {
    if (typeof animated === 'undefined') {
      animated = true;
    }
    this.refs.cont.scrollTo({x: page * this.props.width, y: 0, animated: animated});
  },

  _onMomentumScrollEnd(e) {
    var activePage = e.nativeEvent.contentOffset.x / this.props.width;
    this.props.onEnd(activePage);
  },

  render() {
    const {images, onPress} = this.props;

    return (
      <ListView
        ref                               = "cont"
        dataSource                        = {ds.cloneWithRows(images.map((uri, i) => ({uri, i})))}
        renderRow                         = {({uri, i}) => <ImageCell uri={uri} onPress={() => onPress(i)}/>}
        initialListSize                   = {1}
        pageSize                          = {1}
        automaticallyAdjustContentInsets  = {false}
        showsHorizontalScrollIndicator    = {false}
        bounces                           = {false}
        scrollsToTop                      = {false}
        contentContainerStyle             = {this.props.contentContainerStyle}
        onScrollBeginDrag                 = {this.props.onBegin}
        onMomentumScrollEnd               = {this._onMomentumScrollEnd}
        horizontal
        pagingEnabled
      />
    );
  },
});

module.exports = CarouselPager;
