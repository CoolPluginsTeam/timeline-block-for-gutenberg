// webpack.config.js (ESM)
let parse = await import('@wordpress/scripts/config/webpack.config.js');
const defaultConfig = parse.default;

import path from 'path';
import { fileURLToPath } from 'url';
import * as sass from 'sass-embedded';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function patchSassLoaders(rules = []) {
  return rules.map((rule) => {
    if (rule.oneOf) return { ...rule, oneOf: patchSassLoaders(rule.oneOf) };
    if (!rule.use) return rule;

    const uses = Array.isArray(rule.use) ? rule.use : [rule.use];
    const patchedUses = uses.map((u) => {
      const loader = typeof u === 'string' ? u : u.loader || '';
      if (loader.includes('sass-loader')) {
        const opts = typeof u === 'string' ? {} : (u.options || {});
        return {
          ...(typeof u === 'string' ? { loader: u } : u),
          options: {
            ...opts,
            api: 'modern',
            implementation: sass,
          },
        };
      }
      return u;
    });

    return { ...rule, use: patchedUses };
  });
}

export default (env = {}, argv = {}) => {
  const isCTL = Boolean(env && env.target === 'ctl') || process.env.BUILD_TARGET === 'ctl';

  let rules = patchSassLoaders(defaultConfig.module?.rules || []);

  if (isCTL) {
    rules = [
      {
        test: /\.(jsx?|tsx?|s?css)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [
          {
            loader: path.resolve(__dirname, 'build-tools/ctl-slug-loader.cjs'),
          },
        ],
      },
      ...rules,
    ];
  }

  return {
    ...defaultConfig,
    entry: {
      index: path.resolve(__dirname, 'src/index.js'),
    },
    module: {
      ...(defaultConfig.module || {}),
      rules,
    },
    output: {
      ...(defaultConfig.output || {}),
      filename: isCTL ? 'index.js' : 'block.build.js',
      path: isCTL
        ? path.resolve(__dirname, '../../../cool-timeline/includes/cool-timeline-block/dist')
        : path.resolve(__dirname, 'dist'),
    },
  };
};
