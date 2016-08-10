'use strict';

var React = require('react');
var {
  Dimensions,
  Text,
  View,
  TouchableOpacity
} = require('react-native');

var TimerMixin = require('react-timer-mixin');
var CarouselPager = require('./CarouselPager');
var styles = require('./styles');

var Carousel = React.createClass({
  mixins: [TimerMixin],

  getDefaultProps() {
    return {
      hideIndicators: false,
      indicatorStyle: styles.defaultIndicatorStyle,
      inactiveIndicatorStyle: styles.defaultInactiveIndicatorStyle,
      indicatorAtBottom: true,
      indicatorOffset: 250,
      indicatorText: '•',
      inactiveIndicatorText: '•',
      width: null,
      initialPage: 0,
      indicatorSpace: 25,
      animate: true,
      delay: 1000,
      loop: true,
      rightArr: '〉',
      leftArr: '〈',
      arrStyle: styles.defaultArr,
      arrowsTopOffset: 50,
    };
  },

  getInitialState() {
    return {
      activePage: this.props.initialPage > 0 ? this.props.initialPage : 0,
    };
  },

  getWidth() {
    if (this.props.width !== null) {
      return this.props.width;
    } else {
      return Dimensions.get('window').width;
    }
  },

  componentDidMount() {
    if (this.props.initialPage > 0) {
      this.refs.pager.scrollToPage(this.props.initialPage, false);
    }

    if (this.props.animate && this.props.children) {
      this._setUpTimer();
    }
  },

  scrollTo(activePage) {
    this.setState({activePage});
    this.refs.pager.scrollToPage(activePage);
  },

  wrapArrow(arrow) {
    var {arrStyle} = this.props;

    if (typeof arrow === 'string') {
      //text or unicode char
      return <Text style={[styles.defaultArr, arrStyle]}>
        {arrow}
      </Text>;
    } else {
      //component
      return arrow;
    }
  },

  calcIndicatorsPosition(indicatorContWidth) {
    return (this.getWidth() - indicatorContWidth) / 2;
  },

  renderPageIndicator() {
    const {hideIndicators} = this.props;
    if (hideIndicators) return null;

    const {activePage} = this.state;
    const {children} = this.props;

    const indicators = [];
    for (var i = 0, l = children.length; i < l; i++) {
      if (children[i] === undefined) continue;

      const isActive  = i === activePage;
      
      const {indicatorStyle, inactiveIndicatorStyle} = this.props;
      const style = isActive ? indicatorStyle : inactiveIndicatorStyle;

      const {indicatorText, inactiveIndicatorText} = this.props;
      const text = isActive ? indicatorText : inactiveIndicatorText;

      indicators.push(
        <Text
          style   = {style}
          key     = {i}
          onPress = {() => this.scrollTo(i)}
        >
          {text}
        </Text>
      );
    }

    if (indicators.length === 1) return null;

    const {indicatorSpace} = this.props;
    const indicatorContWidth = children.length * indicatorSpace;

    const indicatorsContStyle = {
      width: indicatorContWidth,
      left: this.calcIndicatorsPosition(indicatorContWidth)
    };

    const {indicatorAtBottom, indicatorOffset} = this.props;
    if (indicatorAtBottom) {
      indicatorsContStyle.bottom = indicatorOffset;
    } else {
      indicatorsContStyle.top = indicatorOffset;
    }

    return <View style={[styles.pageIndicator, indicatorsContStyle]}>
      {indicators}
    </View>;
  },

  renderLeftArr() {
    var {
      leftArr,
      arrowsTopOffset,
      children,
      loop
    } = this.props;

    var {activePage} = this.state;

    var prev = activePage - 1;

    var onPress;
    if (prev >= 0) {
      onPress = () => this.scrollTo(prev);
    } else {
      onPress = loop
        ? () => this.scrollTo(children.length - 1)
        : () => null;
    }


    return (
      <View style={[styles.leftArrCont, {top: arrowsTopOffset}]}>
        <TouchableOpacity onPress={onPress}>
          {this.wrapArrow(leftArr)}
        </TouchableOpacity>
      </View>
    );
  },

  renderRightArr() {
    var {
      rightArr,
      arrowsTopOffset,
      children,
      loop
    } = this.props;

    var {activePage} = this.state;

    var next = activePage + 1;

    var onPress;
    if (next < children.length) {
      onPress = () => this.scrollTo(next);
    } else {
      onPress = loop
        ? () => this.scrollTo(0)
        : () => null;
    }

    return (
      <View style={[styles.rightArrCont, {top: arrowsTopOffset}]}>
        <TouchableOpacity onPress={onPress}>
          {this.wrapArrow(rightArr)}
        </TouchableOpacity>
      </View>
    );
  },

  _setUpTimer() {
    if (this.props.children.length > 1) {
      this.clearTimeout(this.timer);
      this.timer = this.setTimeout(this._animateNextPage, this.props.delay);
    }
  },

  _animateNextPage() {
    var activePage = 0;
    if (this.state.activePage < this.props.children.length - 1) {
      activePage = this.state.activePage + 1;
    } else if (!this.props.loop) {
      return;
    }

    this.scrollTo(activePage);
    this._setUpTimer();
  },

  _onAnimationBegin() {
    this.clearTimeout(this.timer);
  },

  _onAnimationEnd(activePage) {
    this.setState({activePage});
    if (this.props.onPageChange) {
      this.props.onPageChange(activePage);
    }
  },

  render() {
    return (
      <View style={{ flex: 1 }}>
        <CarouselPager
          ref="pager"
          width={this.getWidth()}
          contentContainerStyle={styles.container}
          onBegin={this._onAnimationBeginPage}
          onEnd={this._onAnimationEnd}
        >
          {this.props.children}
        </CarouselPager>
        {this.renderPageIndicator()}
        {this.renderLeftArr()}
        {this.renderRightArr()}
      </View>
    );
  },
});

module.exports = Carousel;
