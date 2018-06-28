import {spacing, colors} from 'ic-snacks'

const groupIcon = {
  marginTop: 4,
  width: 14,
  height: 14,
}

const navLink = {
  fontSize: 14,
  textDecoration: 'none'
}

export default {
  container: {
    backgroundColor: colors.GRAY_97,
    position: 'fixed',
    height: '100vh',
    overflowY: 'scroll',
    minWidth: '20vw',
    ...spacing.PADDING_X_LG,
    zIndex: 2,
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.26)',
  },
  carrotIcon: {
    ...spacing.MARGIN_TOP_LG,
  },
  navGroupContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  navGroupTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    height: 24,
  },
  navGroupTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.GRAY_20,
    ':hover': {
      cursor: 'pointer'
    }
  },
  navGroupIcon: {
    ...groupIcon,
    color: colors.GRAY_46,
  },
  activeGroupIcon: {
    ...groupIcon,
    color: colors.GRAY_74,
  },
  navGroupLinks: {
    ...spacing.PADDING_LEFT_SM,
    ...spacing.MARGIN_Y_XS,
  },
  navLinkRow: {
    height: 40,
  },
  navLinkInactive: {
    ...navLink,
    color: '#424242',
  },
  navLinkActive: {
    ...navLink,
    color: '#FF8200',
  }

}

