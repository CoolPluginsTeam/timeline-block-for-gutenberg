module.exports = function (content) {
  if (typeof content !== 'string') return content;
  return content
    .replace(/cp-timeline\/content-timeline-block-child/g, 'cp-timeline/content-timeline-child')
    .replace(/cp-timeline\/content-timeline-block\b(?!-child)/g, 'cp-timeline/content-timeline')
    .replace(/(['"])Timeline Block\1/g, '$1Cool Timeline Block$1')
    .replace(/(['"])timeline-block\1/g, '$1cool-timeline$1')
    .replace(/Rate Timeline Block on WordPress\.org/g, 'Rate Cool Timeline on WordPress.org')
    .replace(/Upgrade to Timeline Block Pro/g, 'Upgrade to Cool Timeline Pro')
    .replace(/https:\/\/wordpress\.org\/support\/plugin\/timeline-block\/reviews\/#new-post/g, 'https://wordpress.org/support/plugin/cool-timeline/reviews/#new-post')
    .replace(/https:\/\/cooltimeline\.com\/plugin\/timeline-block-pro-for-gutenberg\//g, 'https://cooltimeline.com/plugin/cool-timeline-pro/')
    .replace(/https:\/\/cooltimeline\.com\/demo\/timeline-block-pro\//g, 'https://cooltimeline.com/demo/cool-timeline-pro/')
    .replace(/https:\/\/cooltimeline\.com\/block\/horizontal-default-timeline\//g, 'https://cooltimeline.com/demo/block-timeline-horizontal/')
    .replace(/utm_source=tbg_plugin/g, 'utm_source=ctl_plugin')
    .replace(/\.wp-block-cp-timeline-content-timeline-block-child/g, ':is(.wp-block-cp-timeline-content-timeline-child, .wp-block-cp-timeline-content-timeline-block-child)')
    .replace(/\.wp-block-cp-timeline-content-timeline-block\b(?!-child)/g, ':is(.wp-block-cp-timeline-content-timeline, .wp-block-cp-timeline-content-timeline-block)');
};
