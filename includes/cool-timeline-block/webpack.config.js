import defaultConfig from '@wordpress/scripts/config/webpack.config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import sass from 'sass-embedded';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function patchSassLoaders(rules = []) {
	return rules.map((rule) => {
		if (rule.oneOf) {
			return { ...rule, oneOf: patchSassLoaders(rule.oneOf) };
		}
		if (!rule.use) {
			return rule;
		}

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

export default {
	...defaultConfig,
	module: {
		...(defaultConfig.module || {}),
		rules: patchSassLoaders(defaultConfig.module?.rules || []),
	},
	output: {
		...(defaultConfig.output || {}),
		filename: 'block.build.js',
		path: path.resolve(__dirname, 'dist'),
	},
};
