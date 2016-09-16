import React, {Component} from 'react';
import {ListView} from 'react-native';
import CarouselItem from './CarouselItem';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class CarouselPager extends Component {
  scrollToPage(page, animated) {
    if (typeof animated === 'undefined') {
      animated = true;
    }
    this.refs.cont.scrollTo({x: page * this.props.width, y: 0, animated: animated});
  }

  _onMomentumScrollEnd(e) {
    const {width, onEnd} = this.props;
    const activePage = e.nativeEvent.contentOffset.x / width;
    onEnd(activePage);
  }

  render() {
    const {
      images,
      onPress,
      contentContainerStyle,
      onBegin
  } = this.props;

    return (
      <ListView
        ref                               = "cont"
        dataSource                        = {ds.cloneWithRows(images.map((uri, i) => ({uri, i})))}
        renderRow                         = {({uri, i}) => <CarouselItem uri={uri} onPress={() => onPress(i)}/>}
        initialListSize                   = {1}
        pageSize                          = {1}
        automaticallyAdjustContentInsets  = {false}
        showsHorizontalScrollIndicator    = {false}
        bounces                           = {false}
        scrollsToTop                      = {false}
        contentContainerStyle             = {contentContainerStyle}
        onScrollBeginDrag                 = {onBegin}
        onMomentumScrollEnd               = {this._onMomentumScrollEnd}
        horizontal
        pagingEnabled
      />
    );
  }
};

export default CarouselPager;
