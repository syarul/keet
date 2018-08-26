/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'User1',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/docusaurus.svg'.
    image: '/img/docusaurus.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'Keet.js v4', // Title for your website.
  tagline: 'Minimalist view layer for the web',
  url: 'https://syarul.github.io', // Your website URL
  baseUrl: '/keet/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'keet',
  organizationName: 'syarul',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'intro', label: 'Docs'},
    {doc: 'api', label: 'API'},
    {page: 'help', label: 'Help'},
    // {blog: true, label: 'Blog'},
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/keet.svg',
  footerIcon: 'img/keet.svg',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#ffb133',
    secondaryColor: '#ffdf5e',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Shahrul Nizam Selamat`,
  usePrism: ['js'],
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    // theme: 'monokai',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    'https://buttons.github.io/buttons.js', 
    'https://rawgit.com/syarul/keet/diff/keet-min.js',
    'https://rawgit.com/syarul/b8a68b55dfafc9347a080bb17398e213/raw/f7cd972c6917f742fb4aa7bca652b91de99b7959/consecutive_code_blocks_merge.js',
    'https://rawgit.com/syarul/4193c8bc5988693ee9e703792bf065db/raw/86b8de871a044e72efda9256f7b9f068b350df10/counter.js',
    'https://rawgit.com/syarul/82fe2719d1df5e6e78c01db912b9528b/raw/a3889c9dc5fed7310ca488fc8da24ebc7055c32a/dynamic_nodes.js',
    'https://rawgit.com/syarul/14ce55703b7bd3a29b01adc76ece9c61/raw/549524bb87e6759443b88a242b4e1713987f9f0d/list.js'
  ],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/keet_temp_logo.png',
  twitterImage: 'img/keet_temp_logo.png',

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
