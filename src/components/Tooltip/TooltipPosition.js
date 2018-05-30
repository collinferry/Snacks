import React, { PureComponent, cloneElement } from 'react'
import { findDOMNode }                        from 'react-dom'
import PropTypes                              from 'prop-types'

const styles = {
  root: {
    position: 'absolute',
    zIndex: 9999999,
  },
}

const SPACING = 8
const ARROW_SPACING = 6
const ARROW_BORDER_SPACING = 2

class TooltipPosition extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    target: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]).isRequired,
    placement: PropTypes.oneOf([
      'top',
      'left',
      'right',
      'bottom',
    ]).isRequired,
  }

  state = {
    overlayRect: {},
    arrowPosition: {}
  }

  componentDidMount() {
    this.calculatePosition()
  }

  getTarget = () => {
    const { target } = this.props
    const targetNode = typeof target === 'function' ? target() : target
    return targetNode && findDOMNode(targetNode) || null
  }

  getRect(node) {
    const container = node.getBoundingClientRect()
    const offset = {
      top: 0,
      left: 0,
      width: container.width || node.offsetWidth,
      height: container.height || node.offsetHeight
    }
    let offsetEl = node
    // Calculate offset relative to document.
    // Need to traverse offset for all parents
    while (offsetEl) {
      offset.top += offsetEl.offsetTop
      offset.left += offsetEl.offsetLeft
      offsetEl = offsetEl.offsetParent
    }

    return offset
  }

  calculatePosition() {
    const { placement } = this.props
    const target        = this.getTarget()
    const overlay       = findDOMNode(this)
    const targetRect    = this.getRect(target)
    const documentWidth = document.documentElement.scrollWidth

    const overlayRect = {
      top: targetRect.top,
      left: targetRect.left,
      width: overlay.offsetWidth,
      height: overlay.offsetHeight
    }

    const arrowPosition = {
      top: 0,
      left: 0,
      placement: placement
    }

    if (['top','bottom'].includes(placement)) {
      // Center it
      const targetCenterX  = targetRect.width / 2
      overlayRect.left = targetRect.left + targetCenterX - (overlayRect.width / 2)
      const overlayDistanceFromRightEdge = overlayRect.left + overlayRect.width

      if (placement === 'top') {
        overlayRect.top = targetRect.top - overlayRect.height - (SPACING * 2)
        arrowPosition.top = overlayRect.height - ARROW_SPACING - ARROW_BORDER_SPACING
      } else {
        overlayRect.top = targetRect.top + targetRect.height + (SPACING * 2)
        arrowPosition.top = -ARROW_SPACING
      }

      if (overlayRect.left < 0) {
        // if over left edge of screen shift right to 8px of edge
        // or inline with target (if target is less than 8px from edge)
        overlayRect.left = Math.min(SPACING, targetRect.left)
      } else if (overlayDistanceFromRightEdge > documentWidth) {
        // If over right edge of screen shift left to 8px of edge or inline with target
        const overRightAmount = overlayDistanceFromRightEdge - documentWidth
        const targetDistanceFromRight = documentWidth - (targetRect.left + targetRect.width)

        overlayRect.left = overlayRect.left - overRightAmount - Math.min(SPACING, targetDistanceFromRight)
      }

      arrowPosition.left = targetRect.left - overlayRect.left + ARROW_BORDER_SPACING
    } else {
      const targetCenterY = targetRect.height / 2
      const overlayCenterY = overlayRect.height / 2

      overlayRect.top = targetRect.top + targetCenterY - overlayCenterY
      arrowPosition.top = overlayCenterY - ARROW_SPACING - (ARROW_BORDER_SPACING / 2)

      if (placement === 'right') {
        overlayRect.left = targetRect.left + targetRect.width + (SPACING * 2)
        arrowPosition.left = -ARROW_SPACING
      } else {
        overlayRect.left = targetRect.left - overlayRect.width - (SPACING * 2)
        arrowPosition.left = overlayRect.width - ARROW_SPACING - (ARROW_BORDER_SPACING / 2)
      }
    }

    this.setState({overlayRect: overlayRect, arrowPosition: arrowPosition})
  }

  render() {
    const { children, placement } = this.props
    const { overlayRect } = this.state
    let computedStyles = styles.root

    if (overlayRect.top) {
      computedStyles = {
        ...computedStyles,
        top: overlayRect.top,
        left: overlayRect.left
      }
    }

    let child = React.Children.only(children)

    child = cloneElement(
      child,
      {
        arrowPosition: this.state.arrowPosition,
        placement: placement
      }
    )

    return (
      <div style={computedStyles}>
        { child }
      </div>
    )

  }
}

export default TooltipPosition
