import React from 'react';
import Immutable from 'immutable';
import Link from 'react-router-dom/Link';
import IconButton from '../../../components/icon_button';

const storageKey = 'announcements_dismissed';

class Announcements extends React.PureComponent {

  componentDidUpdate (prevProps, prevState) {
    if (prevState.dismissed !== this.state.dismissed) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(this.state.dismissed));
      } catch (e) {}
    }
  }

  componentWillMount () {
    try {
      const dismissed = JSON.parse(localStorage.getItem(storageKey));
      this.state = { dismissed: Array.isArray(dismissed) ? dismissed : [] };
    } catch (e) {
      this.state = { dismissed: [] };
    }

    const announcements = [];

    announcements.push(
      {
        id: 1,
        icon: '/android-chrome-192x192.png',
        body: 'おすすめiOS・Android版アプリ！',
        link: [
          {
            reactRouter: false,
            inline: true,
            href: 'https://itunes.apple.com/jp/app/tootdon-for-mastodon/id1282283934?mt=8',
            body: 'Appストア',
          }, {
            reactRouter: false,
            inline: true,
            href: 'https://play.google.com/store/apps/details?id=club.tootdon.app&hl=ja',
            body: 'Google Playストア',
          },
        ],
      }, {
        id: 2,
        icon: '/android-chrome-192x192.png',
        body: 'おすすめユーザーをフォローしよう',
        link: [
          {
            reactRouter: true,
            inline: false,
            href: '/accounts/3',
            body: 'ahirun',
          },
          {
            reactRouter: true,
            inline: false,
            href: '/accounts/170',
            body: 'makisama',
          },
          {
            reactRouter: true,
            inline: false,
            href: '/accounts/5',
            body: 'FMいまり',
          },
          {
            reactRouter: true,
            inline: false,
            href: '/accounts/261',
            body: 'Tansoku',
          },
          {
            reactRouter: true,
            inline: false,
            href: '/accounts/428',
            body: 'POKA',
          },
          {
            reactRouter: true,
            inline: false,
            href: '/accounts/347',
            body: 'HearthGamers',
          },
        ],
      }, {
        id: 3,
        icon: '/android-chrome-192x192.png',
        body: '初めての方はコチラ',
        link: [
          {
            reactRouter: true,
            inline: false,
            href: '/timelines/tag/初めてのマストドン',
            body: '初めてのマストドンへ',
          }
        ],
      }
    );

    this.announcements = Immutable.fromJS(announcements);
  }

  handleDismiss = (event) => {
    const id = +event.currentTarget.getAttribute('title');

    if (Number.isInteger(id)) {
      this.setState({ dismissed: [].concat(this.state.dismissed, id) });
    }
  }

  render () {
    return (
      <ul className='announcements'>
        {this.announcements.map(announcement => this.state.dismissed.indexOf(announcement.get('id')) === -1 && (
          <li key={announcement.get('id')}>
            <div className='announcements__icon'>
              <img src={announcement.get('icon')} alt='' />
            </div>
            <div className='announcements__body'>
              <div className='announcements__body__dismiss'>
                <IconButton icon='close' title={`${announcement.get('id')}`} onClick={this.handleDismiss} />
              </div>
              <p>{announcement.get('body')}</p>
              <p>
                {announcement.get('link').map((link) => {
                  const classNames = ['announcements__link'];
                  const action = link.get('action');

                  if (link.get('inline')) {
                    classNames.push('announcements__link-inline');
                  }

                  if (link.get('reactRouter')) {
                    return (
                      <Link key={link.get('href')} className={classNames.join(' ')} to={link.get('href')} onClick={action ? action : null}>
                        {link.get('body')}
                      </Link>
                    );
                  } else {
                    return (
                      <a className={classNames.join(' ')} key={link.get('href')} href={link.get('href')} target='_blank' onClick={action ? action : null}>
                        {link.get('body')}
                      </a>
                    );
                  }
                })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

};

export default Announcements;

