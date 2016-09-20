'use strict';

import React from 'react';
import {Text, View, TouchableOpacity, Dimensions} from 'react-native';
import TimerMixin from 'react-timer-mixin';
import CarouselPager from '../CarouselPager';
import styles from './styles';

const windowWidth = Dimensions.get('window').width;

const Carousel = React.createClass({
  mixins: [TimerMixin],

  getDefaultProps() {
    return {
      hideIndicators:         false,
      indicatorStyle:         styles.defaultIndicatorStyle,
      inactiveIndicatorStyle: styles.defaultInactiveIndicatorStyle,
      indicatorAtBottom:      true,
      indicatorOffset:        250,
      indicatorText:          '•',
      inactiveIndicatorText:  '•',
      indicatorsPadding:      3,
      width:                  windowWidth,
      initialPage:            0,
      indicatorSpace:         25,
      animate:                true,
      delay:                  1000,
      loop:                   true,
      rightArr:               '〉',
      leftArr:                '〈',
      arrStyle:               styles.defaultArr,
      arrowsTopOffset:        50,
    };
  },

  getInitialState() {
    return {
      activePage: this.props.initialPage > 0 ? this.props.initialPage : 0,
    };
  },

  componentDidMount() {
    const {initialPage} = this.props;
    if (initialPage > 0) this.refs.pager.scrollToPage(initialPage, false);

    const {animate, images} = this.props;
    if (animate && images) this._setUpTimer();
  },

  scrollTo(activePage) {
    this.setState({activePage});
    this.refs.pager.scrollToPage(activePage);
  },

  _wrapArrow(arrow) {
    const {arrStyle} = this.props;

    if (typeof arrow === 'string') {
      //text or unicode char
      return (
        <Text style={[styles.defaultArr, arrStyle]}>
          {arrow}
        </Text>
      );
    } else {
      //component
      return arrow;
    }
  },

  _calcIndicatorsPosition(indicatorContWidth) {
    const {width} = this.props;
    const isWidthContainIndicators = width > indicatorContWidth;
    if (isWidthContainIndicators) {
      return (width - indicatorContWidth) / 2;
    }

    const {indicatorSpace} = this.props;
    const {activePage} = this.state;
    const spaceToActiveIndicator = activePage * indicatorSpace;

    const diff = spaceToActiveIndicator - width;
    if (diff >= 0) {
      return -(diff + indicatorSpace);
    } else {
      return 0;
    }
  },

  _addPaddingsToIndicators(indicators, indicatorContWidth) {
    const {width} = this.props;
    const isWidthContainIndicators = width > indicatorContWidth;
    if (isWidthContainIndicators) return indicators;

    const {
      images,
      indicatorsPadding,
      inactiveIndicatorStyle,
      inactiveIndicatorText
    } = this.props;

    for (let i = 1, l = indicatorsPadding; i <= l; i++) {
      indicators.unshift(
        <Text
          style   = {inactiveIndicatorStyle}
          key     = {`paddingLeft_${i}`}
          onPress = {() => this.scrollTo(images.length - i)}
        >
          {inactiveIndicatorText}
        </Text>
      );

      indicators.push(
        <Text
          style   = {inactiveIndicatorStyle}
          key     = {`paddingRight_${i}`}
          onPress = {() => this.scrollTo(i - 1)}
        >
          {inactiveIndicatorText}
        </Text>
      )
    }

    return indicators;
  },

  _setUpTimer() {
    const {images, delay} = this.props;
    if (images.length > 1) {
      this.clearTimeout(this.timer);
      this.timer = this.setTimeout(this._animateNextPage, delay);
    }
  },

  _animateNextPage() {
    const {loop} = this.props;
    if (!loop) return;

    const {activePage} = this.state;
    const {images} = this.props;

    let nextActivePage = 0;
    if (activePage < images.length - 1) nextActivePage = activePage + 1;

    this.scrollTo(nextActivePage);
    this._setUpTimer();
  },

  _onAnimationBegin() {
    this.clearTimeout(this.timer);
  },

  _onAnimationEnd(activePage) {
    this.setState({activePage});

    const {onPageChange} = this.props;
    if (onPageChange) onPageChange(activePage);
  },

  renderPageIndicator() {
    const {hideIndicators} = this.props;
    if (hideIndicators) return null;

    const {images} = this.props;
    const {activePage} = this.state;

    let indicators = [];
    for (var i = 0, l = images.length; i < l; i++) {
      const isActive  = i === activePage;

      const {indicatorStyle, inactiveIndicatorStyle} = this.props;
      const style = isActive ? indicatorStyle : inactiveIndicatorStyle;

      const {indicatorText, inactiveIndicatorText} = this.props;
      const text = isActive ? indicatorText : inactiveIndicatorText;

      indicators.push(
        <Text
          style   = {style}
          key     = {i}
          onPress = {this.scrollTo.bind(this, i)}
        >
          {text}
        </Text>
      );
    }

    if (indicators.length === 1) return null;

    const {indicatorSpace} = this.props;
    const indicatorContWidth = images.length * indicatorSpace;

    const indicatorsContStyle = {
      width: indicatorContWidth,
      left: this._calcIndicatorsPosition(indicatorContWidth)
    };

    const {indicatorAtBottom, indicatorOffset} = this.props;
    if (indicatorAtBottom) {
      indicatorsContStyle.bottom = indicatorOffset;
    } else {
      indicatorsContStyle.top = indicatorOffset;
    }

    indicators = this._addPaddingsToIndicators(indicators, indicatorContWidth);

    return (
      <View style={[styles.pageIndicator, indicatorsContStyle]}>
        {indicators}
      </View>
    );
  },

  renderLeftArr() {
    const {activePage} = this.state;
    const prev = activePage - 1;

    const {images, loop} = this.props;

    let onPress;
    if (prev >= 0) {
      onPress = () => this.scrollTo(prev);
    } else {
      onPress = loop
        ? () => this.scrollTo(images.length - 1)
        : () => null;
    }

    const {leftArr, arrowsTopOffset} = this.props;

    return (
      <View style={[styles.leftArrCont, {top: arrowsTopOffset}]}>
        <TouchableOpacity onPress={onPress}>
          {this._wrapArrow(leftArr)}
        </TouchableOpacity>
      </View>
    );
  },

  renderRightArr() {
    const {activePage} = this.state;
    const next = activePage + 1;

    const {images, loop} = this.props;

    let onPress;
    if (next < images.length) {
      onPress = () => this.scrollTo(next);
    } else {
      onPress = loop
        ? () => this.scrollTo(0)
        : () => null;
    }

    const {rightArr, arrowsTopOffset} = this.props;

    return (
      <View style={[styles.rightArrCont, {top: arrowsTopOffset}]}>
        <TouchableOpacity onPress={onPress}>
          {this._wrapArrow(rightArr)}
        </TouchableOpacity>
      </View>
    );
  },

  render() {
    const {onPress, images, width} = this.props;

    return (
      <View style={{flex: 1}}>
        <CarouselPager
          ref                   = "pager"
          width                 = {width}
          onPress               = {onPress}
          images                = {images}
          contentContainerStyle = {styles.container}
          onBegin               = {this._onAnimationBeginPage}
          onEnd                 = {this._onAnimationEnd}
        />
        {this.renderPageIndicator()}
        {this.renderLeftArr()}
        {this.renderRightArr()}
      </View>
    );
  },
});

export default Carousel;
