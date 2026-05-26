// ------------------
// @Table of Contents
// ------------------

/**
 * + @Loading Dependencies
 * + @Environment Holders
 * + @Utils
 * + @App Paths
 * + @Output Files Names
 * + @Entries Files Names
 * + @Exporting Module
 */


// ---------------------
// @Loading Dependencies
// ---------------------

const path = require('path');


// --------------------
// @Environment Holders
// --------------------

const
  NODE_ENV       = process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT = NODE_ENV === 'development',
  IS_PRODUCTION  = NODE_ENV === 'production',
  MINIFY         = process.env.MINIFY === 'true';

// ------
// @Utils
// ------

const
  dir = src => path.join(__dirname, src);


// ----------
// @App Paths
// ----------

const
  paths = {
    src   : dir('../src'),
    build : dir('../dist'),
  };


// -------------------
// @Output Files Names
// -------------------

/* In production the CSS filename is content-hashed so the 1-year immutable
   cache (set at the CDN edge) flips automatically when the bundle changes —
   stale stylesheets were the cause of post-deploy "did you hard-refresh?"
   reports. Dev keeps the plain name so source maps and HMR stay readable. */
const
  outputFiles = {
    css : IS_PRODUCTION ? 'style.[contenthash:8].css' : 'style.css',
  };


// -----------------
// @Exporting Module
// -----------------

module.exports = {
  paths,
  outputFiles,
  NODE_ENV,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  MINIFY,
};
