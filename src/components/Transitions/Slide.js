import React, { PureComponent } from 'react'
import Transition from 'react-transition-group/Transition'
import PropTypes from 'prop-types'

const TIMEOUT = 0
const TRASITION_TIME = 200
const WIDTH = 200
const TIMING_FUNCTION = 'ease-in-out'

const AXIS = 'x'

class Slide extends PureComponent {
  static propTypes = {
    /**
     * A convenience prop that enables or disabled appear animations for
     * all children. Note that specifying this will override any defaults
     * set on individual children Transitions.
     */
    appear: PropTypes.bool,

    /** Axis that is animated */
    axis: PropTypes.oneOf(['x', 'y']),

    /** Show the component; triggers the enter or exit states */
    in: PropTypes.bool,

    /** Inverts offset direction, e.g. changes animation direction from right to left */
    invert: PropTypes.bool,

    /** Optional style overrides. */
    style: PropTypes.object,

    /** Delay in milliseconds until animation start. */
    timeout: PropTypes.number,

    /** Name of the transition-timing-function CSS property. */
    timingFunction: PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']),

    /** Time of animation in milliseconds. */
    transitionTime: PropTypes.number,

    /** Width in pixels of the container, this value is used for the translation offset. */
    width: PropTypes.number,
  }

  static defaultProps = {
    timeout: TIMEOUT,
    transitionTime: TRASITION_TIME,
    timingFunction: TIMING_FUNCTION,
    width: WIDTH,
    axis: AXIS,
    style: {},
    in: true,
    appear: true,
    invert: false,
  }

  get transformAxis() {
    return this.props.axis == 'x' ? 'translateX' : 'translateY'
  }

  get transitionStyles() {
    const { width, invert } = this.props
    const offsetDirection = invert ? '-' : ''
    return {
      entering: {
        transform: `${this.transformAxis}(${offsetDirection}${width}px)`
      },
      entered: {
        transform: `${this.transformAxis}(0)`
      },
    }
  }

  get initialStyles() {
    const { transitionTime, timingFunction, width, invert } = this.props
    const offsetDirection = invert ? '' : '-'
    return {
      transform: `${this.transformAxis}(${offsetDirection}${width}px)`,
      transition: `all ${transitionTime}ms ${timingFunction}`,
    }
  }

  renderChild = (state) => {
    const { style, children } = this.props
    const styles = {
      ...this.initialStyles,
      ...this.transitionStyles[state]
    }
    const containerStyle = {
      overflowY: 'hidden',
      overflowX: 'visible',
      ...style,
    }

    return (
      <div style={containerStyle}>
        <div style={styles} >
          {children}
        </div>
      </div>
    )
  }

  render() {
    const { in: inProp, timeout, appear } = this.props
    return (
      <Transition
        in={inProp}
        appear={appear}
        timeout={timeout}
      >
        {this.renderChild}
      </Transition>
    )
  }
}

export default Slide