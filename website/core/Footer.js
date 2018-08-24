/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return `${baseUrl}docs/${language ? `${language}/` : ''}${doc}`
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Extra</h5>
            <a href="https://github.com/syarul/keetjs-todomvc">TodoMVC</a>
            <a href="https://github.com/syarul/preact-perf">
              Performance Benchmark
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a href="https://gitter.im/keet-dev/Lobby">
              Gitter Chat
            </a>
          </div>
          <div>
            <h5>More on Github</h5>
            <a className="github-button" href="https://github.com/syarul/keet" data-icon="octicon-star" data-show-count="true" aria-label="Star syarul/keet on GitHub">Star</a>
            &nbsp;&nbsp;<a className="github-button" href="https://github.com/syarul/keet/fork" data-icon="octicon-repo-forked" aria-label="Fork syarul/keet on GitHub">Fork</a>
            &nbsp;&nbsp;<a className="github-button" href="https://github.com/syarul/keet/issues" data-icon="octicon-issue-opened" aria-label="Issue syarul/keet on GitHub">Issue</a>
          </div>
        </section>
        <p className="fbOpenSource info-footer">Site generated using <span><a href="https://docusaurus.io">docusaurus</a></span> part of</p>
        <a
          href="https://code.facebook.com/projects/"
          target="_blank"
          rel="noreferrer noopener"
          className="fbOpenSource">
          <img
            src={`${this.props.config.baseUrl}img/oss_logo.png`}
            alt="Facebook Open Source"
            width="170"
            height="45"
          />
        </a>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
