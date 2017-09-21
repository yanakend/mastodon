import React from 'react';
import NotificationsContainer from './containers/notifications_container';
import PropTypes from 'prop-types';
import LoadingBarContainer from './containers/loading_bar_container';
import TabsBar from './components/tabs_bar';
import ModalContainer from './containers/modal_container';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { isMobile } from '../../is_mobile';
import { debounce } from 'lodash';
import { uploadCompose } from '../../actions/compose';
import { refreshHomeTimeline } from '../../actions/timelines';
import { refreshNotifications } from '../../actions/notifications';
import { clearHeight } from '../../actions/height_cache';
import { WrappedSwitch, WrappedRoute } from './util/react_router_helpers';
import UploadArea from './components/upload_area';
import ColumnsAreaContainer from './containers/columns_area_container';
import { twitchMiniscreen } from '../../actions/twitch';
import {
  Compose,
  Status,
  GettingStarted,
  PublicTimeline,
  CommunityTimeline,
  AccountTimeline,
  AccountGallery,
  HomeTimeline,
  Followers,
  Following,
  Reblogs,
  Favourites,
  HashtagTimeline,
  Notifications,
  FollowRequests,
  GenericNotFound,
  FavouritedStatuses,
  Blocks,
  Mutes,
  PinnedStatuses,
} from './util/async-components';

// Dummy import, to make sure that <Status /> ends up in the application bundle.
// Without this it ends up in ~8 very commonly used bundles.
import '../../components/status';

const mapStateToProps = state => ({
  isComposing: state.getIn(['compose', 'is_composing']),
  twitch: state.getIn(['twitch', 'isFullscreen']),
});

@connect(mapStateToProps)
@withRouter
export default class UI extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.node,
    isComposing: PropTypes.bool,
    location: PropTypes.object,
    twitch: PropTypes.bool,
  };

  state = {
    width: window.innerWidth,
    draggingOver: false,
  };

  handleResize = debounce(() => {
    // The cached heights are no longer accurate, invalidate
    this.props.dispatch(clearHeight());

    this.setState({ width: window.innerWidth });
  }, 500, {
    trailing: true,
  });

  handleDragEnter = (e) => {
    e.preventDefault();

    if (!this.dragTargets) {
      this.dragTargets = [];
    }

    if (this.dragTargets.indexOf(e.target) === -1) {
      this.dragTargets.push(e.target);
    }

    if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
      this.setState({ draggingOver: true });
    }
  }

  handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      e.dataTransfer.dropEffect = 'copy';
    } catch (err) {

    }

    return false;
  }

  handleDrop = (e) => {
    e.preventDefault();

    this.setState({ draggingOver: false });

    if (e.dataTransfer && e.dataTransfer.files.length === 1) {
      this.props.dispatch(uploadCompose(e.dataTransfer.files));
    }
  }

  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.dragTargets = this.dragTargets.filter(el => el !== e.target && this.node.contains(el));

    if (this.dragTargets.length > 0) {
      return;
    }

    this.setState({ draggingOver: false });
  }

  closeUploadModal = () => {
    this.setState({ draggingOver: false });
  }

  handleServiceWorkerPostMessage = ({ data }) => {
    if (data.type === 'navigate') {
      this.context.router.history.push(data.path);
    } else {
      console.warn('Unknown message type:', data.type);
    }
  }

  componentWillMount () {
    window.addEventListener('resize', this.handleResize, { passive: true });
    document.addEventListener('dragenter', this.handleDragEnter, false);
    document.addEventListener('dragover', this.handleDragOver, false);
    document.addEventListener('drop', this.handleDrop, false);
    document.addEventListener('dragleave', this.handleDragLeave, false);
    document.addEventListener('dragend', this.handleDragEnd, false);

    if ('serviceWorker' in  navigator) {
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerPostMessage);
    }

    this.props.dispatch(refreshHomeTimeline());
    this.props.dispatch(refreshNotifications());
  }

  componentDidMount () {
    var offset = [0, 0];
    var isDown = false;
    var div = document.getElementsByClassName("draggable")[0];

    div.addEventListener('mousedown', function(e) {
      isDown = true;
      offset = [
        div.offsetLeft - e.clientX,
        div.offsetTop - e.clientY
      ];
    }, true);

    document.addEventListener('mouseup', function() {
      isDown = false;
    }, true);

    document.addEventListener('mousemove', function(event) {
      if (isDown) {
        event.preventDefault();
        var mousePosition = { x : event.clientX, y : event.clientY };
        div.style.left = (mousePosition.x + offset[0]) + 'px';
        div.style.top  = (mousePosition.y + offset[1]) + 'px';
      }
    }, true);
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.isComposing !== this.props.isComposing) {
      // Avoid expensive update just to toggle a class
      this.node.classList.toggle('is-composing', nextProps.isComposing);

      return false;
    }

    // Why isn't this working?!?
    // return super.shouldComponentUpdate(nextProps, nextState);
    return true;
  }

  componentDidUpdate (prevProps) {
    if (![this.props.location.pathname, '/'].includes(prevProps.location.pathname)) {
      this.columnsAreaNode.handleChildrenContentChange();
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('dragenter', this.handleDragEnter);
    document.removeEventListener('dragover', this.handleDragOver);
    document.removeEventListener('drop', this.handleDrop);
    document.removeEventListener('dragleave', this.handleDragLeave);
    document.removeEventListener('dragend', this.handleDragEnd);
  }

  setRef = (c) => {
    this.node = c;
  }

  setColumnsAreaRef = (c) => {
    this.columnsAreaNode = c.getWrappedInstance().getWrappedInstance();
  }

  clickTwitchMiniscreen = () => {
    this.props.dispatch(twitchMiniscreen());
  }

  twitchWindow = () => {

    let twitchId = 'posesi';
    if (
      !twitchId || 
      !this.props.twitch
    ) {
      return (<div className="draggable" draggable="true"></div>);
    }
    return (
      <div className="twitch-tags twitch-full draggable" draggable="true">
        <div className="tags__header twitch-label">
          <i className="fa fa-twitch tags__header__icon" />
          <div className="tags__header__name">Twitch</div>
          <i onClick={this.clickTwitchMiniscreen} className="fa fa-compress tags__header__icon" />
        </div>
        <iframe className="video" src={`https://player.twitch.tv/?channel=${twitchId}&muted=true&autoplay=true`} scrolling="no" height="100%" width="100%"></iframe>
      </div>
    );
  }

  render () {
    const { width, draggingOver } = this.state;
    const { children } = this.props;

    let home = isMobile(width) ? '/timelines/home' : '/getting-started';
    return (
      <div className='ui' ref={this.setRef}>
        <TabsBar />
        <ColumnsAreaContainer ref={this.setColumnsAreaRef} singleColumn={isMobile(width)}>
          <WrappedSwitch>
            <Redirect from='/' to={home} exact />
            <WrappedRoute path='/getting-started' component={GettingStarted} content={children} />
            <WrappedRoute path='/timelines/home' component={HomeTimeline} content={children} />
            <WrappedRoute path='/timelines/public' exact component={PublicTimeline} content={children} />
            <WrappedRoute path='/timelines/public/local' component={CommunityTimeline} content={children} />
            <WrappedRoute path='/timelines/tag/:id' component={HashtagTimeline} content={children} />

            <WrappedRoute path='/notifications' component={Notifications} content={children} />
            <WrappedRoute path='/favourites' component={FavouritedStatuses} content={children} />
            <WrappedRoute path='/pinned' component={PinnedStatuses} content={children} />

            <WrappedRoute path='/statuses/new' component={Compose} content={children} />
            <WrappedRoute path='/statuses/:statusId' exact component={Status} content={children} />
            <WrappedRoute path='/statuses/:statusId/reblogs' component={Reblogs} content={children} />
            <WrappedRoute path='/statuses/:statusId/favourites' component={Favourites} content={children} />

            <WrappedRoute path='/accounts/:accountId' exact component={AccountTimeline} content={children} />
            <WrappedRoute path='/accounts/:accountId/followers' component={Followers} content={children} />
            <WrappedRoute path='/accounts/:accountId/following' component={Following} content={children} />
            <WrappedRoute path='/accounts/:accountId/media' component={AccountGallery} content={children} />

            <WrappedRoute path='/follow_requests' component={FollowRequests} content={children} />
            <WrappedRoute path='/blocks' component={Blocks} content={children} />
            <WrappedRoute path='/mutes' component={Mutes} content={children} />

            <WrappedRoute component={GenericNotFound} content={children} />
          </WrappedSwitch>
        </ColumnsAreaContainer>
        <NotificationsContainer />
        <LoadingBarContainer className='loading-bar' />
        <ModalContainer />
        <UploadArea active={draggingOver} onClose={this.closeUploadModal} />

        {this.twitchWindow()}
      </div>
    );
  }

}
