/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
}

class Help extends React.Component {
  render() {
    const language = this.props.language || '';
    const supportLinks = [
      {
        content: `Learn more using the [documentation on this site.](${docUrl(
          'intro.html')})`,
        title: 'Browse Docs',
      },
      {
        content: 'Ask questions about the documentation and project at [gitter](https://gitter.im/keet-dev/Lobby)',
        title: 'Join the community',
      },
      {
        content: `At [GitHub repo](https://github.com/syarul/keet) Browse and submit [issues](https://github.com/syarul/keet/issues) or [pull requests](https://github.com/syarul/keet/pulls) for bugs you find or any new 
        features you may want implemented.`,
        title: 'Github',
      },
    ];

    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h1>Need help?</h1>
            </header>
            <p>If you need help with Keet.js, you can try one of the mechanisms below.</p>
            <GridBlock contents={supportLinks} layout="threeColumn" />
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Help;
