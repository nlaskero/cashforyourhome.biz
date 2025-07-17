const fs = require('fs');
const path = require('path');

/**
 * Validates an array of asset objects
 * @param {Array} assets - Array of asset objects to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with valid flag and errors
 */
function validateAssets(assets, options = {}) {
  if (!assets) {
    throw new Error('Assets array is required');
  }

  if (!Array.isArray(assets)) {
    throw new Error('Assets must be an array');
  }

  const results = {
    valid: true,
    errors: [],
    validAssets: [],
    invalidAssets: []
  };

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    const assetResult = validateSingleAsset(asset, options);
    
    if (assetResult.valid) {
      results.validAssets.push(asset);
    } else {
      results.invalidAssets.push({ asset, errors: assetResult.errors });
      results.errors.push(...assetResult.errors);
      results.valid = false;
    }
  }

  return results;
}

/**
 * Validates a single asset
 * @param {Object} asset - Asset object to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
function validateSingleAsset(asset, options = {}) {
  const errors = [];

  if (!asset || typeof asset !== 'object') {
    errors.push('Asset must be an object');
    return { valid: false, errors };
  }

  if (!asset.path) {
    errors.push('Asset path is required');
  } else {
    const pathResult = validateAssetPath(asset.path, options);
    if (!pathResult.valid) {
      errors.push(pathResult.error);
    }

    const formatResult = validateAssetFormat(asset.path, options);
    if (!formatResult.valid) {
      errors.push(formatResult.error);
    }

    const sizeResult = validateAssetSize(asset.path, options);
    if (!sizeResult.valid) {
      errors.push(sizeResult.error);
    }
  }

  // Validate metadata consistency if option is enabled
  if (options.validateMetadata && asset.declaredSize) {
    try {
      const stats = fs.statSync(asset.path);
      if (stats.size !== asset.declaredSize) {
        errors.push(`Size mismatch: declared ${asset.declaredSize}, actual ${stats.size}`);
      }
    } catch (err) {
      // Size validation will catch this
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates asset file size
 * @param {string} filePath - Path to the asset file
 * @param {Object} options - Size validation options
 * @returns {Object} Validation result
 */
function validateAssetSize(filePath, options = {}) {
  const { maxSize = 10 * 1024 * 1024, minSize = 1 } = options; // Default 10MB max, 1 byte min

  try {
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;

    if (fileSize === 0) {
      return {
        valid: false,
        error: 'Empty file not allowed',
        actualSize: fileSize
      };
    }

    if (fileSize > maxSize) {
      return {
        valid: false,
        error: `File size ${fileSize} exceeds maximum size ${maxSize}`,
        actualSize: fileSize
      };
    }

    if (fileSize < minSize) {
      return {
        valid: false,
        error: `File size ${fileSize} below minimum size ${minSize}`,
        actualSize: fileSize
      };
    }

    return {
      valid: true,
      actualSize: fileSize
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}

/**
 * Validates asset file format
 * @param {string} filePath - Path to the asset file
 * @param {Object} options - Format validation options
 * @returns {Object} Validation result
 */
function validateAssetFormat(filePath, options = {}) {
  const defaultFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  const { allowedFormats = defaultFormats } = options;

  if (!filePath || typeof filePath !== 'string') {
    return {
      valid: false,
      error: 'Invalid file path'
    };
  }

  const extension = path.extname(filePath).toLowerCase().slice(1);
  
  if (!extension) {
    return {
      valid: false,
      error: 'No file extension found'
    };
  }

  const normalizedFormats = allowedFormats.map(format => format.toLowerCase());
  
  if (!normalizedFormats.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported format: ${extension}. Allowed formats: ${allowedFormats.join(', ')}`
    };
  }

  return {
    valid: true,
    format: extension
  };
}

/**
 * Validates asset file path for security and validity
 * @param {string} filePath - Path to validate
 * @param {Object} options - Path validation options
 * @returns {Object} Validation result
 */
function validateAssetPath(filePath, options = {}) {
  const {
    allowedDirs = [],
    allowAbsolute = false,
    maxPathLength = 255
  } = options;

  if (!filePath || typeof filePath !== 'string') {
    return {
      valid: false,
      error: 'Invalid or empty path'
    };
  }

  if (filePath.length > maxPathLength) {
    return {
      valid: false,
      error: `Path too long: ${filePath.length} characters, max ${maxPathLength}`
    };
  }

  // Check for path traversal attempts
  const normalizedPath = path.normalize(filePath);
  if (normalizedPath.includes('..') || normalizedPath.startsWith('/') && !allowAbsolute) {
    return {
      valid: false,
      error: 'Path contains unsafe path traversal or absolute path not allowed'
    };
  }

  // Validate against allowed directories if specified
  if (allowedDirs.length > 0) {
    const isInAllowedDir = allowedDirs.some(dir => 
      normalizedPath.startsWith(dir + '/') || normalizedPath === dir
    );
    
    if (!isInAllowedDir) {
      return {
        valid: false,
        error: `Path not in allowed directories: ${allowedDirs.join(', ')}`
      };
    }
  }

  return {
    valid: true,
    normalizedPath
  };
}

module.exports = {
  validateAssets,
  validateAssetSize,
  validateAssetFormat,
  validateAssetPath
};