import React from 'react';
import ComposeFormContainer from './containers/compose_form_container';
import NavigationContainer from './containers/navigation_container';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { mountCompose, unmountCompose } from '../../actions/compose';
import Link from 'react-router-dom/Link';
import { injectIntl, defineMessages } from 'react-intl';
import SearchContainer from './containers/search_container';
import Motion from 'react-motion/lib/Motion';
import spring from 'react-motion/lib/spring';
import SearchResultsContainer from './containers/search_results_container';
import { changeComposing } from '../../actions/compose';
import StatusContent from '../../components/status_content';
import { isMobile } from '../../is_mobile';
import { twitchFullscreen, twitchCloseScreen } from '../../actions/twitch';

const messages = defineMessages({
  start: { id: 'getting_started.heading', defaultMessage: 'Getting started' },
  home_timeline: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  public: { id: 'navigation_bar.public_timeline', defaultMessage: 'Federated timeline' },
  community: { id: 'navigation_bar.community_timeline', defaultMessage: 'Local timeline' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
});

const mapStateToProps = state => ({
  columns: state.getIn(['settings', 'columns']),
  showSearch: state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden']),
  twitch: state.getIn(['twitch', 'isFullscreen']),
  twitchIsClose: state.getIn(['twitch', 'isCloseScreen']),
});

@connect(mapStateToProps)
@injectIntl
export default class Compose extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    columns: ImmutablePropTypes.list.isRequired,
    multiColumn: PropTypes.bool,
    showSearch: PropTypes.bool,
    twitch: PropTypes.bool,
    twitchIsClose: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount () {
    this.props.dispatch(mountCompose());
  }

  componentWillUnmount () {
    this.props.dispatch(unmountCompose());
  }

  onFocus = () => {
    this.props.dispatch(changeComposing(true));
  }

  onBlur = () => {
    this.props.dispatch(changeComposing(false));
  }

  clickTwitchFullscreen = () => {
    this.props.dispatch(twitchFullscreen());
  }

  clickTwitchClose = () => {
    this.props.dispatch(twitchCloseScreen(true));
  }

  clickTwitchRestore = () => {
    this.props.dispatch(twitchCloseScreen(false));
  }

  twitchWindow = () => {

    let twitchId = 'araiance';
    if (!twitchId) {
      return null;
    }
    if (this.props.twitch) {
      return null;
    }
    if (this.props.twitchIsClose) {
      return (
        <div className="twitch-tags">
          <div className="tags__header twitch-label">
            <i className="fa fa-twitch tags__header__icon" />
            <div className="tags__header__name">Twitch</div>
            <i onClick={this.clickTwitchRestore} className="fa fa-window-restore tags__header__icon" />
          </div>
        </div>
      );
    }

    const autoplay = !isMobile(window.innerWidth);
    const fullIcon = isMobile(window.innerWidth) ? null : <i onClick={this.clickTwitchFullscreen} className="fa fa-expand tags__header__icon" />;

    return (
      <div className="twitch-tags">
        <div className="tags__header twitch-label">
          <i className="fa fa-twitch tags__header__icon" />
          <div className="tags__header__name">Twitch</div>
          {fullIcon}
          <i onClick={this.clickTwitchClose} className="fa fa-window-close tags__header__icon" />
        </div>
        <iframe src={`https://player.twitch.tv/?channel=${twitchId}&muted=true&autoplay=${autoplay}`} scrolling="no" height="100%" width="100%"></iframe>
      </div>
    );
  }

  render () {
    const { multiColumn, showSearch, intl } = this.props;

    let header = '';

    if (multiColumn) {
      const { columns } = this.props;
      header = (
        <nav className='drawer__header'>
          <Link to='/getting-started' className='drawer__tab' title={intl.formatMessage(messages.start)} aria-label={intl.formatMessage(messages.start)}><i role='img' className='fa fa-fw fa-asterisk' /></Link>
          {!columns.some(column => column.get('id') === 'HOME') && (
            <Link to='/timelines/home' className='drawer__tab' title={intl.formatMessage(messages.home_timeline)} aria-label={intl.formatMessage(messages.home_timeline)}><i role='img' className='fa fa-fw fa-home' /></Link>
          )}
          {!columns.some(column => column.get('id') === 'NOTIFICATIONS') && (
            <Link to='/notifications' className='drawer__tab' title={intl.formatMessage(messages.notifications)} aria-label={intl.formatMessage(messages.notifications)}><i role='img' className='fa fa-fw fa-bell' /></Link>
          )}
          {!columns.some(column => column.get('id') === 'COMMUNITY') && (
            <Link to='/timelines/public/local' className='drawer__tab' title={intl.formatMessage(messages.community)} aria-label={intl.formatMessage(messages.community)}><i role='img' className='fa fa-fw fa-users' /></Link>
          )}
          {!columns.some(column => column.get('id') === 'PUBLIC') && (
            <Link to='/timelines/public' className='drawer__tab' title={intl.formatMessage(messages.public)} aria-label={intl.formatMessage(messages.public)}><i role='img' className='fa fa-fw fa-globe' /></Link>
          )}
          <a href='/settings/preferences' className='drawer__tab' title={intl.formatMessage(messages.preferences)} aria-label={intl.formatMessage(messages.preferences)}><i role='img' className='fa fa-fw fa-cog' /></a>
          <a href='/auth/sign_out' className='drawer__tab' data-method='delete' title={intl.formatMessage(messages.logout)} aria-label={intl.formatMessage(messages.logout)}><i role='img' className='fa fa-fw fa-sign-out' /></a>
        </nav>
      );
    }

    const tags = ["フレンド募集", "80G", "プレイオフ", "大会", "イベント", "要望"];

    return (
      <div className='drawer'>
        {header}

        <SearchContainer />

        <div className='drawer__pager'>
          <div className='drawer__inner' onFocus={this.onFocus}>
            <NavigationContainer onClose={this.onBlur} />
            <ComposeFormContainer />
            <div className="trend-tags">
              <div className="tags__header">
                <i className="fa fa-line-chart tags__header__icon" />
                <div className="tags__header__name">おすすめタグ</div>
              </div>
              {tags.map(tag => 
                <ul className="status__content status__content--with-action">
                  <Link key={tag} className='mention hashtag status-link' to={`/timelines/tag/${tag}`}>
                    #{tag}
                  </Link>
                </ul>
              )}
            </div>
            {this.twitchWindow()}
          </div>
          <Motion defaultStyle={{ x: -100 }} style={{ x: spring(showSearch ? 0 : -100, { stiffness: 210, damping: 20 }) }}>
            {({ x }) =>
              <div className='drawer__inner darker' style={{ transform: `translateX(${x}%)`, visibility: x === -100 ? 'hidden' : 'visible' }}>
                <SearchResultsContainer />
              </div>
            }
          </Motion>
        </div>
      </div>
    );
  }

}
