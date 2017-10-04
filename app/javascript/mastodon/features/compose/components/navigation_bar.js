import React from 'react';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Avatar from '../../../components/avatar';
import IconButton from '../../../components/icon_button';
import Permalink from '../../../components/permalink';
import { FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';

const {
  FacebookShareButton,
  TwitterShareButton,
} = ShareButtons;

const TwitterIcon = generateShareIcon('twitter');
const FacebookIcon = generateShareIcon('facebook');

export default class NavigationBar extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render () {
    const twitter = <a href="https://twitter.com/share" className={"twitter-share-button"} data-url={this.props.account.get('url')} data-text="ハストドンはじめました" data-via="hearthtodon" data-hashtags="ハースストーン">Tweet</a>
    const url = this.props.account.get('url');
    const title = "ハストドンはじめました";
    return (
      <div className='navigation-bar'>
        <Permalink href={this.props.account.get('url')} to={`/accounts/${this.props.account.get('id')}`}>
          <span style={{ display: 'none' }}>{this.props.account.get('acct')}</span>
          <Avatar account={this.props.account} size={40} />
        </Permalink>

        <div className='navigation-bar__profile'>
          <Permalink href={this.props.account.get('url')} to={`/accounts/${this.props.account.get('id')}`}>
            <strong className='navigation-bar__profile-account'>@{this.props.account.get('acct')}</strong>
          </Permalink>
          <a href='/settings/profile' className='navigation-bar__profile-edit'><FormattedMessage id='navigation_bar.edit_profile' defaultMessage='Edit profile' /></a>
        </div>

        <TwitterShareButton
          url={url}
          title={title}
          hashtags={["ハースストーン", "ハストドン"]}
          className="Demo__some-network__share-button">
          <TwitterIcon
            size={32}
            round />
        </TwitterShareButton>

        <FacebookShareButton
          url={url}
          quote={title}
          className="Demo__some-network__share-button">
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>
      </div>
    );
  }

}
